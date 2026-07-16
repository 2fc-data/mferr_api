"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const cause_model_1 = require("../database/models/cause.model");
const cause_user_model_1 = require("../database/models/cause_user.model");
const cause_task_model_1 = require("../database/models/cause_task.model");
const cache_service_1 = require("../common/cache/cache.service");
const logger_service_1 = require("../common/logger/logger.service");
const sequelize_2 = require("sequelize");
const cause_constants_1 = require("../common/constants/cause.constants");
const statistics_util_1 = require("../common/utils/statistics.util");
const date_period_util_1 = require("../common/utils/date-period.util");
let DashboardService = class DashboardService {
    causeModel;
    causeUserModel;
    causeTaskModel;
    cacheService;
    logger;
    CACHE_TTL = 300;
    MAX_FILTER_VALUE = 999999999;
    constructor(causeModel, causeUserModel, causeTaskModel, cacheService, logger) {
        this.causeModel = causeModel;
        this.causeUserModel = causeUserModel;
        this.causeTaskModel = causeTaskModel;
        this.cacheService = cacheService;
        this.logger = logger;
    }
    async getMetrics(filters) {
        const cacheKey = `dashboard:metrics:${JSON.stringify(filters)}`;
        if (this.cacheService.isAvailable()) {
            const cached = await this.cacheService.get(cacheKey);
            if (cached) {
                this.logger.debug('Cache hit for dashboard metrics', 'DashboardService');
                return cached;
            }
        }
        const result = await this.computeMetrics(filters);
        if (this.cacheService.isAvailable()) {
            await this.cacheService.set(cacheKey, result, this.CACHE_TTL);
        }
        return result;
    }
    async invalidateCache(pattern = 'dashboard:*') {
        await this.cacheService.invalidatePattern(pattern);
        this.logger.log(`Cache invalidated: ${pattern}`, 'DashboardService');
    }
    async getOperationalMetrics(filters) {
        const cacheKey = `dashboard:operations:${JSON.stringify(filters)}`;
        if (this.cacheService.isAvailable()) {
            const cached = await this.cacheService.get(cacheKey);
            if (cached)
                return cached;
        }
        try {
            const tasksRaw = await this.causeTaskModel.findAll({
                where: {
                    is_completed: true,
                    completed_at: { [sequelize_2.Op.not]: null },
                    completed_by: { [sequelize_2.Op.not]: null },
                },
                include: [
                    { association: 'status_task', required: true },
                    { association: 'completer', required: true },
                ],
                raw: false,
                nest: true,
            });
            const tasks = tasksRaw.map((t) => {
                const json = t.toJSON();
                const start = new Date(json.createdAt || json.created_at || new Date().toISOString());
                const end = new Date(json.completed_at);
                let days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
                if (days < 0 || isNaN(days))
                    days = 0;
                return { ...json, leadTimeDays: days };
            });
            const bottlenecks = this.calculateBottlenecks(tasks);
            const productivity = this.calculateProductivity(tasks);
            const result = { bottlenecks: bottlenecks.slice(0, 15), productivity };
            if (this.cacheService.isAvailable()) {
                await this.cacheService.set(cacheKey, result, this.CACHE_TTL);
            }
            return result;
        }
        catch (error) {
            this.logger.error(`ERROR IN GETOPERATIONALMETRICS: ${error.message}`, error.stack, 'DashboardService');
            throw error;
        }
    }
    calculateBottlenecks(tasks) {
        const bottlenecksMap = new Map();
        for (const t of tasks) {
            const statusName = t.status_task?.description || 'Desconhecido';
            const current = bottlenecksMap.get(statusName) || {
                totalDays: 0,
                count: 0,
            };
            current.totalDays += t.leadTimeDays;
            current.count += 1;
            bottlenecksMap.set(statusName, current);
        }
        return Array.from(bottlenecksMap.entries())
            .map(([name, data]) => ({
            name,
            avgDays: parseFloat((data.totalDays / data.count).toFixed(2)),
        }))
            .sort((a, b) => b.avgDays - a.avgDays);
    }
    calculateProductivity(tasks) {
        const prodMap = new Map();
        for (const t of tasks) {
            const complId = t.completed_by;
            const userName = t.completer?.name || 'Desconhecido';
            const current = prodMap.get(complId) || {
                userName,
                totalDays: 0,
                count: 0,
            };
            current.totalDays += t.leadTimeDays;
            current.count += 1;
            prodMap.set(complId, current);
        }
        return Array.from(prodMap.values())
            .map((data) => ({
            userName: data.userName,
            tasksCompleted: data.count,
            avgDays: parseFloat((data.totalDays / data.count).toFixed(2)),
        }))
            .sort((a, b) => b.tasksCompleted - a.tasksCompleted);
    }
    async computeMetrics(filters) {
        try {
            const whereClause = this.buildWhereClause(filters);
            const causes = await this.fetchCauses(whereClause);
            const totals = await this.fetchTotals(whereClause);
            const prevMetrics = await this.computePreviousPeriodMetrics(filters);
            return this.buildMetricsResult(causes, totals, prevMetrics, filters);
        }
        catch (error) {
            this.logger.error(`ERROR IN GETMETRICS: ${error.message}`, error.stack, 'DashboardService');
            throw error;
        }
    }
    buildWhereClause(filters) {
        const whereClause = { is_active: true };
        const validated = this.validateFilters(filters);
        if (validated.city_id)
            whereClause.city_id = validated.city_id;
        if (validated.subject)
            whereClause.subject = validated.subject;
        if (validated.litigation_type)
            whereClause.litigation_type = validated.litigation_type;
        if (validated.outcome_id)
            whereClause.outcome_id = validated.outcome_id;
        if (validated.status_id)
            whereClause.current_status_id = validated.status_id;
        if (validated.stage_id)
            whereClause.current_stage_id = validated.stage_id;
        if (validated.status_task_id) {
            whereClause.id = {
                [sequelize_2.Op.in]: sequelize_2.Sequelize.literal(`(SELECT cause_id FROM cause_tasks WHERE status_task_id = ${validated.status_task_id})`),
            };
        }
        (0, date_period_util_1.applyDateFilter)(whereClause, validated);
        return whereClause;
    }
    validateFilters(filters) {
        return {
            year: filters.year && /^\d{4}$/.test(filters.year) ? filters.year : undefined,
            periodType: filters.periodType || 'ano',
            periodValue: filters.periodValue,
            city_id: this.sanitizeNumericParam(filters.city_id),
            groupBy: filters.groupBy,
            subject: filters.subject?.substring(0, 255),
            litigation_type: filters.litigation_type?.substring(0, 100),
            outcome_id: this.sanitizeNumericParam(filters.outcome_id),
            status_id: this.sanitizeNumericParam(filters.status_id),
            stage_id: this.sanitizeNumericParam(filters.stage_id),
            status_task_id: this.sanitizeNumericParam(filters.status_task_id),
        };
    }
    sanitizeNumericParam(value) {
        if (!value)
            return undefined;
        const num = typeof value === 'string' ? parseInt(value, 10) : value;
        if (isNaN(num))
            return undefined;
        if (num < 0 || num > this.MAX_FILTER_VALUE)
            return undefined;
        return num;
    }
    async fetchCauses(whereClause) {
        const causesRaw = await this.causeModel.findAll({
            where: whereClause,
            include: cause_constants_1.CAUSE_INCLUDE,
            raw: false,
            nest: true,
        });
        return causesRaw.map((c) => (0, cause_constants_1.mapCauseRecord)(c));
    }
    async fetchTotals(whereClause) {
        const totalsResult = await this.causeModel.findAll({
            attributes: [
                [(0, sequelize_2.fn)('SUM', (0, sequelize_2.col)('total_value')), 'legalFees'],
                [(0, sequelize_2.fn)('SUM', (0, sequelize_2.col)('total_fees')), 'honorary'],
                [(0, sequelize_2.fn)('SUM', (0, sequelize_2.col)('customer_amount')), 'clientFees'],
            ],
            where: whereClause,
            raw: true,
        });
        return totalsResult?.[0] || {};
    }
    async computePreviousPeriodMetrics(filters) {
        const prevFilters = (0, date_period_util_1.getPreviousPeriodFilters)(filters);
        if (!prevFilters)
            return null;
        const whereClause = this.buildWhereClause(prevFilters);
        const [count, totalsResult] = await Promise.all([
            this.causeModel.count({ where: whereClause }),
            this.causeModel.findAll({
                attributes: [[(0, sequelize_2.fn)('SUM', (0, sequelize_2.col)('total_value')), 'totalValue']],
                where: whereClause,
                raw: true,
            }),
        ]);
        const actionCount = count || 0;
        const legalFeesCount = parseFloat(totalsResult?.[0]?.['totalValue'] || '0');
        const meanValue = actionCount > 0 ? legalFeesCount / actionCount : 0;
        return { actionCount, meanValue, legalFeesCount };
    }
    buildMetricsResult(causes, totals, prevMetrics, filters) {
        const totalActions = causes.length;
        const values = causes
            .map((c) => parseFloat(c.total_value?.toString() || '0'))
            .sort((a, b) => a - b);
        const totalValueSum = values.reduce((a, b) => a + b, 0);
        const meanValue = totalActions > 0 ? totalValueSum / totalActions : 0;
        const leadTimes = causes
            .filter((c) => (c.createdAt || c.created_at) && c.closed_at)
            .map((c) => {
            const start = new Date(c.createdAt || c.created_at);
            const end = new Date(c.closed_at);
            return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        })
            .sort((a, b) => a - b);
        const meanLeadTime = leadTimes.length > 0
            ? leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length
            : 0;
        const groupBy = filters.groupBy || 'court';
        const fieldResolver = (c) => this.resolveField(c, groupBy);
        const filtros = [...new Set(causes.map(fieldResolver))]
            .filter(Boolean)
            .slice(0, 10);
        return {
            actionCount: totalActions,
            legalFeesCount: parseFloat(totals?.['legalFees'] || '0'),
            honoraryCount: parseFloat(totals?.['honorary'] || '0'),
            clientFeesCount: parseFloat(totals?.['clientFees'] || '0'),
            meanValue,
            medianValue: (0, statistics_util_1.calculateMedian)(values),
            meanLeadTime,
            medianLeadTime: (0, statistics_util_1.calculateMedian)(leadTimes),
            histogramData: (0, statistics_util_1.generateHistogram)(values),
            boxplotData: (0, statistics_util_1.calculateBoxplotData)(leadTimes),
            bivariateData: this.generateBivariateData(causes, groupBy),
            lineGraphData: this.generateTimelineData(causes, fieldResolver, filtros),
            filtros,
            records: causes,
            trends: this.calculateTrends({
                actionCount: totalActions,
                meanValue,
                legalFeesCount: parseFloat(totals?.['legalFees'] || '0'),
            }, prevMetrics),
        };
    }
    generateBivariateData(causes, field) {
        const fieldResolver = (c) => this.resolveField(c, field);
        const outcomeResolver = (c) => {
            const name = c.outcome?.name || 'Em Andamento';
            const normalized = name.trim().toLowerCase();
            if (normalized.includes('ganho') || normalized.includes('procedente') || normalized.includes('êxito'))
                return 'Ganho';
            if (normalized.includes('perdido') || normalized.includes('improcedente') || normalized.includes('perda'))
                return 'Perdido';
            if (normalized.includes('acordo') || normalized.includes('parcialmente'))
                return 'Acordo';
            return 'Em Andamento';
        };
        const uniqueFields = [...new Set(causes.map(fieldResolver))].slice(0, 10);
        return uniqueFields.map((val) => {
            const related = causes.filter((c) => fieldResolver(c) === val);
            return {
                name: val,
                Ganho: related.filter((c) => outcomeResolver(c) === 'Ganho').length,
                Perdido: related.filter((c) => outcomeResolver(c) === 'Perdido').length,
                Acordo: related.filter((c) => outcomeResolver(c) === 'Acordo').length,
                "Em Andamento": related.filter((c) => outcomeResolver(c) === 'Em Andamento').length,
            };
        });
    }
    generateTimelineData(causes, fieldResolver, filtros) {
        const monthLabels = [
            'Jan',
            'Fev',
            'Mar',
            'Abr',
            'Mai',
            'Jun',
            'Jul',
            'Ago',
            'Set',
            'Out',
            'Nov',
            'Dez',
        ];
        return monthLabels.map((month, i) => {
            const monthCauses = causes.filter((c) => new Date(c.process_date).getMonth() === i);
            const dataPoint = { month, total: monthCauses.length };
            filtros.forEach((f) => {
                dataPoint[f] = monthCauses.filter((c) => fieldResolver(c) === f).length;
            });
            return dataPoint;
        });
    }
    calculateTrends(current, previous) {
        const calc = (cur, pre) => {
            if (!pre || pre === 0)
                return cur > 0 ? 100 : 0;
            return Math.round(((cur - pre) / pre) * 100);
        };
        return {
            volume: calc(current.actionCount, previous?.actionCount ?? 0),
            ticket: calc(current.meanValue, previous?.meanValue ?? 0),
            value: calc(current.legalFeesCount, previous?.legalFeesCount ?? 0),
        };
    }
    resolveField(c, field) {
        if (!field)
            return 'Não Informado';
        const resolvers = {
            court: () => c.court?.name,
            tribunal: () => c.court?.name,
            area: () => c.area?.name,
            area_atuacao: () => c.area?.name,
            assunto: () => c.subject,
            tipo_litigio: () => c.litigation_type,
            status_processo: () => c.current_status?.name,
            status: () => c.current_status?.name,
            estagio_atual: () => c.current_stage?.name,
            fase: () => c.current_stage?.name,
            resultado: () => c.outcome?.name || 'Pendente',
            outcome: () => c.outcome?.name || 'Pendente',
            desfecho: () => c.outcome?.name || 'Pendente',
        };
        if (resolvers[field])
            return resolvers[field]() || 'Não Informado';
        const value = c[field];
        if (typeof value === 'object' && value !== null)
            return value.name || 'Não Informado';
        return value || 'Não Informado';
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(cause_model_1.Cause)),
    __param(1, (0, sequelize_1.InjectModel)(cause_user_model_1.CauseUser)),
    __param(2, (0, sequelize_1.InjectModel)(cause_task_model_1.CauseTask)),
    __metadata("design:paramtypes", [Object, Object, Object, cache_service_1.CacheService,
        logger_service_1.AppLogger])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map