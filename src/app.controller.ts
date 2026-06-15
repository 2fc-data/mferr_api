import { Controller, Get } from '@nestjs/common';
import { HealthService } from './common/health/health.service';
import { AppLogger } from './common/logger/logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly healthService: HealthService,
    private readonly logger: AppLogger,
  ) {}

  @Get('health')
  async checkHealth() {
    this.logger.debug('Health check requested', 'HealthController');
    return this.healthService.check();
  }

  @Get()
  getHello() {
    return 'LawerOffice API v1.0.0 running';
  }
}
