import { DashboardService } from './dashboard.service';
import { DashboardFilters, DashboardMetricsResult } from './dashboard.types';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getMetrics(filters: DashboardFilters): Promise<DashboardMetricsResult>;
    getOperations(filters: DashboardFilters): Promise<any>;
}
