import { HealthService } from './common/health/health.service';
import { AppLogger } from './common/logger/logger.service';
export declare class AppController {
    private readonly healthService;
    private readonly logger;
    constructor(healthService: HealthService, logger: AppLogger);
    checkHealth(): Promise<import("./common/health/health.service").HealthStatus>;
    getHello(): string;
}
