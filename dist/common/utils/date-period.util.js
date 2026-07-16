"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPeriodRange = getPeriodRange;
exports.getPreviousPeriodFilters = getPreviousPeriodFilters;
exports.applyDateFilter = applyDateFilter;
const sequelize_1 = require("sequelize");
function getPeriodRange(year, periodType, periodValue) {
    let start;
    let end;
    if (periodType === 'mes' && periodValue) {
        const month = parseInt(periodValue);
        start = new Date(year, month, 1);
        end = new Date(year, month + 1, 0, 23, 59, 59);
    }
    else if (periodType === 'trimestre' && periodValue) {
        const quarter = parseInt(periodValue);
        start = new Date(year, quarter * 3, 1);
        end = new Date(year, (quarter + 1) * 3, 0, 23, 59, 59);
    }
    else if (periodType === 'semestre' && periodValue) {
        const semester = parseInt(periodValue);
        start = new Date(year, semester * 6, 1);
        end = new Date(year, (semester + 1) * 6, 0, 23, 59, 59);
    }
    else {
        start = new Date(year, 0, 1);
        end = new Date(year, 11, 31, 23, 59, 59);
    }
    return { start, end };
}
function getPreviousPeriodFilters(filters) {
    if (!filters.year)
        return null;
    const currentYear = parseInt(filters.year);
    const currentVal = parseInt(filters.periodValue || '0');
    if (filters.periodType === 'mes') {
        return currentVal === 0
            ? { ...filters, year: (currentYear - 1).toString(), periodValue: '11' }
            : { ...filters, periodValue: (currentVal - 1).toString() };
    }
    if (filters.periodType === 'trimestre') {
        return currentVal === 0
            ? { ...filters, year: (currentYear - 1).toString(), periodValue: '3' }
            : { ...filters, periodValue: (currentVal - 1).toString() };
    }
    if (filters.periodType === 'semestre') {
        return currentVal === 0
            ? { ...filters, year: (currentYear - 1).toString(), periodValue: '1' }
            : { ...filters, periodValue: (currentVal - 1).toString() };
    }
    return { ...filters, year: (currentYear - 1).toString() };
}
function applyDateFilter(whereClause, filters) {
    if (!filters.year || filters.year === 'undefined')
        return;
    const { start, end } = getPeriodRange(parseInt(filters.year), filters.periodType || 'ano', filters.periodValue);
    whereClause.process_date = { [sequelize_1.Op.between]: [start, end] };
}
//# sourceMappingURL=date-period.util.js.map