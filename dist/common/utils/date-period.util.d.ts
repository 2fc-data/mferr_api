import { DashboardFilters } from '../../dashboard/dashboard.types';
export declare function getPeriodRange(year: number, periodType: string, periodValue?: string): {
    start: Date;
    end: Date;
};
export declare function getPreviousPeriodFilters(filters: DashboardFilters): DashboardFilters | null;
export declare function applyDateFilter(whereClause: any, filters: DashboardFilters): void;
