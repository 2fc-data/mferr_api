import { ConfigService } from '@nestjs/config';
export declare class CacheService {
    private configService;
    private redis;
    private isConnected;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttlSeconds?: number): Promise<boolean>;
    delete(key: string): Promise<boolean>;
    invalidatePattern(pattern: string): Promise<number>;
    isAvailable(): boolean;
}
