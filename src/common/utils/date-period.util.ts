import { Op } from 'sequelize';
import { DashboardFilters } from '../../dashboard/dashboard.types';

/**
 * Utility for handling dashboard date periods and filter application.
 */

export function getPeriodRange(year: number, periodType: string, periodValue?: string) {
  let start: Date;
  let end: Date;

  if (periodType === 'mes' && periodValue) {
    const month = parseInt(periodValue);
    start = new Date(year, month, 1);
    end = new Date(year, month + 1, 0, 23, 59, 59);
  } else if (periodType === 'trimestre' && periodValue) {
    const quarter = parseInt(periodValue);
    start = new Date(year, quarter * 3, 1);
    end = new Date(year, (quarter + 1) * 3, 0, 23, 59, 59);
  } else if (periodType === 'semestre' && periodValue) {
    const semester = parseInt(periodValue);
    start = new Date(year, semester * 6, 1);
    end = new Date(year, (semester + 1) * 6, 0, 23, 59, 59);
  } else {
    start = new Date(year, 0, 1);
    end = new Date(year, 11, 31, 23, 59, 59);
  }

  return { start, end };
}

export function getPreviousPeriodFilters(filters: DashboardFilters): DashboardFilters | null {
  if (!filters.year) return null;

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

export function applyDateFilter(whereClause: any, filters: DashboardFilters): void {
  if (!filters.year || filters.year === 'undefined') return;

  const { start, end } = getPeriodRange(
    parseInt(filters.year),
    filters.periodType || 'ano',
    filters.periodValue
  );

  whereClause.process_date = { [Op.between]: [start, end] };
}
