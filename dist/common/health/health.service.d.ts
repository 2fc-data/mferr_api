export interface HealthStatus {
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    uptime: number;
    checks: {
        database: {
            status: string;
            latency?: number;
            error?: string;
        };
        memory: {
            status: string;
            used: number;
            total: number;
        };
        redis?: {
            status: string;
            error?: string;
        };
    };
}
export declare class HealthService {
    private startTime;
    constructor();
    check(): Promise<HealthStatus>;
    private checkDatabase;
    private checkMemory;
}
