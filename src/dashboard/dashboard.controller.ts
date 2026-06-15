import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardFilters, DashboardMetricsResult } from './dashboard.types';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  async getMetrics(
    @Query() filters: DashboardFilters,
  ): Promise<DashboardMetricsResult> {
    return this.dashboardService.getMetrics(filters);
  }

  @Get('operations')
  async getOperations(@Query() filters: DashboardFilters): Promise<any> {
    return this.dashboardService.getOperationalMetrics(filters);
  }
}
