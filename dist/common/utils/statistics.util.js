"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMedian = calculateMedian;
exports.calculateBoxplotData = calculateBoxplotData;
exports.generateHistogram = generateHistogram;
function calculateMedian(arr) {
    if (!arr || arr.length === 0)
        return 0;
    const sortedArr = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sortedArr.length / 2);
    return sortedArr.length % 2 !== 0
        ? sortedArr[mid]
        : (sortedArr[mid - 1] + sortedArr[mid]) / 2;
}
function calculateBoxplotData(arr) {
    if (!arr || arr.length === 0)
        return { min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [] };
    const sorted = [...arr].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length / 4)];
    const q3 = sorted[Math.floor((sorted.length * 3) / 4)];
    const median = calculateMedian(sorted);
    const iqr = q3 - q1;
    const min = Math.max(sorted[0], q1 - 1.5 * iqr);
    const max = Math.min(sorted[sorted.length - 1], q3 + 1.5 * iqr);
    const outliers = sorted.filter((x) => x < min || x > max);
    return { min, q1, median, q3, max, outliers: outliers.slice(0, 50) };
}
function generateHistogram(values) {
    if (!values || values.length === 0)
        return [];
    const ranges = [
        { label: '< R$ 1k', min: 0, max: 1000 },
        { label: 'R$ 1k-10k', min: 1000, max: 10000 },
        { label: 'R$ 10k-50k', min: 10000, max: 50000 },
        { label: 'R$ 50k-100k', min: 50000, max: 100000 },
        { label: '> R$ 100k', min: 100000, max: Infinity },
    ];
    return ranges.map((r) => ({
        range: r.label,
        count: values.filter((v) => v >= r.min && v < r.max).length,
    }));
}
//# sourceMappingURL=statistics.util.js.map