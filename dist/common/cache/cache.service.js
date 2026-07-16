"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const config_1 = require("@nestjs/config");
let CacheService = class CacheService {
    configService;
    redis = null;
    isConnected = false;
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        const redisHost = this.configService.get('REDIS_HOST');
        if (!redisHost) {
            console.log('Redis not configured, caching disabled');
            return;
        }
        try {
            this.redis = new ioredis_1.default({
                host: redisHost,
                port: this.configService.get('REDIS_PORT', 6379),
                password: this.configService.get('REDIS_PASSWORD'),
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
        }
        catch (error) {
            console.warn('Redis not available, caching disabled');
        }
    }
    async onModuleDestroy() {
        if (this.redis) {
            await this.redis.disconnect();
        }
    }
    async get(key) {
        if (!this.isConnected || !this.redis)
            return null;
        try {
            const data = await this.redis.get(key);
            return data ? JSON.parse(data) : null;
        }
        catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }
    async set(key, value, ttlSeconds) {
        if (!this.isConnected || !this.redis)
            return false;
        try {
            const serialized = JSON.stringify(value);
            if (ttlSeconds) {
                await this.redis.setex(key, ttlSeconds, serialized);
            }
            else {
                await this.redis.set(key, serialized);
            }
            return true;
        }
        catch (error) {
            console.error('Cache set error:', error);
            return false;
        }
    }
    async delete(key) {
        if (!this.isConnected || !this.redis)
            return false;
        try {
            await this.redis.del(key);
            return true;
        }
        catch (error) {
            console.error('Cache delete error:', error);
            return false;
        }
    }
    async invalidatePattern(pattern) {
        if (!this.isConnected || !this.redis)
            return 0;
        try {
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                return await this.redis.del(...keys);
            }
            return 0;
        }
        catch (error) {
            console.error('Cache invalidate error:', error);
            return 0;
        }
    }
    isAvailable() {
        return this.isConnected;
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CacheService);
//# sourceMappingURL=cache.service.js.map