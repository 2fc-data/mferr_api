export interface DashboardFilters {
    year?: string;
    periodType?: 'ano' | 'mes' | 'trimestre' | 'semestre';
    periodValue?: string;
    city_id?: string | number;
    groupBy?: string;
    subject?: string;
    litigation_type?: string;
    outcome_id?: string | number;
    status_id?: string | number;
    stage_id?: string | number;
    status_task_id?: string | number;
}
export interface TrendData {
    actionCount: number;
    meanValue: number;
    legalFeesCount: number;
}
export interface DashboardMetricsResult {
    actionCount: number;
    legalFeesCount: number;
    honoraryCount: number;
    clientFeesCount: number;
    meanValue: number;
    medianValue: number;
    meanLeadTime: number;
    medianLeadTime: number;
    histogramData: {
        range: string;
        count: number;
    }[];
    boxplotData: {
        min: number;
        q1: number;
        median: number;
        q3: number;
        max: number;
        outliers: number[];
    };
    bivariateData: any[];
    lineGraphData: {
        month: string;
        total: number;
        [key: string]: any;
    }[];
    filtros: string[];
    records: any[];
    trends?: {
        volume: number;
        ticket: number;
        value: number;
    };
}
export interface OperationalMetrics {
    bottlenecks: {
        name: string;
        avgDays: number;
    }[];
    productivity: {
        userName: string;
        tasksCompleted: number;
        avgDays: number;
    }[];
}
