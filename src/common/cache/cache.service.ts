import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService {
  private redis: Redis | null = null;
  private isConnected = false;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisHost = this.configService.get<string>('REDIS_HOST');
    if (!redisHost) {
      console.log('Redis not configured, caching disabled');
      return;
    }

    try {
      this.redis = new Redis({
        host: redisHost,
        port: this.configService.get<number>('REDIS_PORT', 6379),
        password: this.configService.get<string>('REDIS_PASSWORD'),
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      this.redis.on('connect', () => {
        this.isConnected = true;
        console.log('Redis connected');
      });

      this.redis.on('error', (err) => {
        this.isConnected = false;
        console.error('Redis error:', err.message);
      });
    } catch (error) {
      console.warn('Redis not available, caching disabled');
    }
  }

  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.disconnect();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.redis) return null;
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    if (!this.isConnected || !this.redis) return false;
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, serialized);
      } else {
        await this.redis.set(key, serialized);
      }
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    if (!this.isConnected || !this.redis) return false;
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async invalidatePattern(pattern: string): Promise<number> {
    if (!this.isConnected || !this.redis) return 0;
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        return await this.redis.del(...keys);
      }
      return 0;
    } catch (error) {
      console.error('Cache invalidate error:', error);
      return 0;
    }
  }

  isAvailable(): boolean {
    return this.isConnected;
  }
}
