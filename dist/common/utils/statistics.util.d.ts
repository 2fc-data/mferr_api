export declare function calculateMedian(arr: number[]): number;
export declare function calculateBoxplotData(arr: number[]): {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    outliers: number[];
};
export declare function generateHistogram(values: number[]): {
    range: string;
    count: number;
}[];
