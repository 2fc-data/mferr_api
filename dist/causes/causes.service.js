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
var CausesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CausesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const sequelize_2 = require("@nestjs/sequelize");
const cause_model_1 = require("../database/models/cause.model");
const cause_user_model_1 = require("../database/models/cause_user.model");
const audit_service_1 = require("../audit/audit.service");
const user_model_1 = require("../database/models/user.model");
const status_task_model_1 = require("../database/models/status_task.model");
const cause_task_model_1 = require("../database/models/cause_task.model");
const division_model_1 = require("../database/models/division.model");
const cause_constants_1 = require("../common/constants/cause.constants");
const base_service_1 = require("../common/base.service");
const cache_service_1 = require("../common/cache/cache.service");
let CausesService = CausesService_1 = class CausesService extends base_service_1.BaseService {
    causeModel;
    causeUserModel;
    statusTaskModel;
    causeTaskModel;
    divisionModel;
    auditService;
    cacheService;
    logger = new common_1.Logger(CausesService_1.name);
    CAUSE_INCLUDE = cause_constants_1.CAUSE_INCLUDE;
    constructor(causeModel, causeUserModel, statusTaskModel, causeTaskModel, divisionModel, auditService, cacheService) {
        super(causeModel);
        this.causeModel = causeModel;
        this.causeUserModel = causeUserModel;
        this.statusTaskModel = statusTaskModel;
        this.causeTaskModel = causeTaskModel;
        this.divisionModel = divisionModel;
        this.auditService = auditService;
        this.cacheService = cacheService;
    }
    async create(createCauseDto, currentUser) {
        try {
            const { involved_users, ...causeData } = createCauseDto;
            const stageId = causeData.current_stage_id ? Number(causeData.current_stage_id) : null;
            const statusId = causeData.current_status_id ? Number(causeData.current_status_id) : null;
            if (stageId === 3) {
                if (!causeData.closed_at) {
                    causeData.closed_at = new Date();
                }
                if (statusId === 64 && (causeData.outcome_id === undefined || causeData.outcome_id === null || causeData.outcome_id === 12)) {
                    causeData.outcome_id = 13;
                }
            }
            const cause = await this.causeModel.create({ ...causeData });
            if (involved_users && involved_users.length > 0) {
                await Promise.all(involved_users.map(async (userRef) => {
                    await this.causeUserModel.create({
                        cause_id: cause.id,
                        user_id: userRef.user_id,
                        role_type_id: userRef.role_type_id,
                        party_side_id: userRef.party_side_id,
                        is_primary: userRef.is_primary ?? false,
                    });
                }));
            }
            if (statusId) {
                await this.syncTasks(cause.id, statusId);
            }
            await this.cacheService.invalidatePattern('dashboard:*');
            return cause;
        }
        catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new common_1.ConflictException('Já existe um processo cadastrado com este número.');
            }
            throw error;
        }
    }
    async findAll(currentUser, filters, includeDeleted = false) {
        const whereClause = {};
        if (filters) {
            if (filters.city_id)
                whereClause.city_id = filters.city_id;
            if (filters.court_id)
                whereClause.court_id = filters.court_id;
            if (filters.division_id)
                whereClause.division_id = filters.division_id;
        }
        if (currentUser?.rules) {
            const isAdmin = currentUser.rules.includes('admin') ||
                currentUser.rules.includes('settings.manage');
            if (!isAdmin) {
                const userCauses = await this.causeUserModel.findAll({
                    where: { user_id: currentUser.id },
                    attributes: ['cause_id'],
                });
                const causeIds = userCauses.map((uc) => Number(uc.get('cause_id')));
                whereClause.id = causeIds;
            }
        }
        const causes = await this.causeModel.findAll({
            where: whereClause,
            include: this.CAUSE_INCLUDE,
            order: [['process_date', 'DESC']],
            paranoid: !includeDeleted,
        });
        return causes.map((cause) => (0, cause_constants_1.mapCauseRecord)(cause));
    }
    async findOne(id, currentUser) {
        const cause = await this.causeModel.findByPk(id, {
            include: this.CAUSE_INCLUDE,
        });
        if (!cause)
            return null;
        if (currentUser?.rules) {
            const isAdmin = currentUser.rules.includes('admin') ||
                currentUser.rules.includes('settings.manage');
            if (!isAdmin) {
                const isAssigned = await this.causeUserModel.count({
                    where: { cause_id: id, user_id: currentUser.id },
                });
                if (isAssigned === 0) {
                    throw new common_1.ForbiddenException('Você não tem permissão para acessar este processo.');
                }
            }
        }
        return (0, cause_constants_1.mapCauseRecord)(cause);
    }
    async update(id, updateCauseDto, currentUser) {
        const oldCause = await this.causeModel.findByPk(id);
        if (!oldCause)
            return null;
        const { involved_users, ...causeData } = updateCauseDto;
        const stageId = causeData.current_stage_id !== undefined ? (causeData.current_stage_id ? Number(causeData.current_stage_id) : null) : oldCause.current_stage_id;
        const statusId = causeData.current_status_id !== undefined ? (causeData.current_status_id ? Number(causeData.current_status_id) : null) : oldCause.current_status_id;
        if (stageId === 3) {
            if (!oldCause.closed_at && !causeData.closed_at) {
                causeData.closed_at = new Date();
            }
            if (statusId === 64 && (causeData.outcome_id === undefined || causeData.outcome_id === null || oldCause.outcome_id === 12)) {
                causeData.outcome_id = 13;
            }
        }
        else if (stageId !== null && stageId !== 3) {
            causeData.closed_at = null;
            if (oldCause.outcome_id === 13) {
                causeData.outcome_id = 12;
            }
        }
        try {
            if (oldCause.current_status_id &&
                causeData.current_status_id &&
                Number(causeData.current_status_id) !==
                    Number(oldCause.current_status_id)) {
                const pendingMandatory = await this.causeTaskModel.count({
                    where: { cause_id: id, is_completed: false },
                    include: [
                        {
                            model: status_task_model_1.StatusTask,
                            as: 'status_task',
                            where: {
                                status_id: oldCause.current_status_id,
                                is_required: true,
                            },
                        },
                    ],
                });
                if (pendingMandatory > 0) {
                    throw new common_1.BadRequestException('Atividades obrigatórias pendentes no status atual.');
                }
            }
            await this.causeModel.update(causeData, { where: { id } });
            if (currentUser) {
                await this.auditService.recordUpdate('Cause', id, oldCause.get({ plain: true }), causeData, currentUser.id);
            }
            if (causeData.current_status_id &&
                Number(causeData.current_status_id) !==
                    Number(oldCause.current_status_id)) {
                await this.syncTasks(id, Number(causeData.current_status_id));
            }
            if (involved_users) {
                await this.causeUserModel.destroy({
                    where: { cause_id: id },
                });
                await Promise.all(involved_users.map(async (userRef) => {
                    await this.causeUserModel.create({
                        cause_id: id,
                        user_id: userRef.user_id,
                        role_type_id: userRef.role_type_id,
                        party_side_id: userRef.party_side_id,
                        is_primary: userRef.is_primary ?? false,
                    });
                }));
            }
            await this.cacheService.invalidatePattern('dashboard:*');
            return this.findOne(id, currentUser);
        }
        catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                throw new common_1.ConflictException('Número de processo já cadastrado.');
            }
            throw e;
        }
    }
    async remove(id) {
        const res = await super.remove(id);
        await this.cacheService.invalidatePattern('dashboard:*');
        return res;
    }
    async updateContractDoc(id, contract_doc_path) {
        const cause = await this.causeModel.findByPk(id);
        if (!cause)
            throw new common_1.BadRequestException('Processo não encontrado.');
        return cause.update({ contract_doc_path });
    }
    async findAllTasks(causeId, providedStatusId) {
        const id = Number(causeId);
        if (!this.causeModel.sequelize) {
            throw new Error('Base de dados não inicializada corretamente.');
        }
        try {
            let statusId = providedStatusId;
            if (!statusId) {
                const result = await this.causeModel.sequelize.query('SELECT current_status_id FROM causes WHERE id = :id', { replacements: { id }, type: sequelize_1.QueryTypes.SELECT });
                const causeRow = result[0];
                if (!causeRow)
                    throw new common_1.BadRequestException('Processo não encontrado.');
                statusId = causeRow.current_status_id;
            }
            if (!statusId)
                return [];
            await this.syncTasks(id, Number(statusId));
            const tasks = await this.causeModel.sequelize.query(`
        SELECT 
          ct.id, ct.cause_id, ct.status_task_id, ct.is_completed, ct.completed_at, ct.completed_by,
          st.description as 'status_task_description',
          st.is_required as 'status_task_is_required',
          st.order_index as 'status_task_order_index'
        FROM cause_tasks ct
        JOIN status_tasks st ON ct.status_task_id = st.id
        WHERE ct.cause_id = :causeId AND st.status_id = :statusId
        ORDER BY st.order_index ASC
      `, {
                replacements: { causeId: id, statusId },
                type: sequelize_1.QueryTypes.SELECT,
            });
            return tasks.map((t) => ({
                id: t.id,
                cause_id: t.cause_id,
                status_task_id: t.status_task_id,
                is_completed: !!t.is_completed,
                completed_at: t.completed_at,
                completed_by: t.completed_by,
                status_task: {
                    description: t.status_task_description,
                    is_required: !!t.status_task_is_required,
                    order_index: t.status_task_order_index,
                },
            }));
        }
        catch (error) {
            this.logger.error(`[findAllTasks] Error: ${error.message}`);
            throw error;
        }
    }
    async syncTasks(causeId, statusId) {
        if (!this.causeModel.sequelize)
            return;
        try {
            await this.causeModel.sequelize.query(`
        INSERT IGNORE INTO cause_tasks (cause_id, status_task_id, is_completed, created_at, updated_at)
        SELECT :causeId, id, 0, NOW(), NOW()
        FROM status_tasks
        WHERE status_id = :statusId
        AND id NOT IN (
          SELECT status_task_id FROM cause_tasks WHERE cause_id = :causeId
        )
      `, {
                replacements: { causeId, statusId },
            });
        }
        catch (error) {
            this.logger.error(`[syncTasks] Error: ${error.message}`);
        }
    }
    async toggleTask(taskId, userId, isCompleted) {
        const task = await this.causeTaskModel.findByPk(taskId);
        if (!task)
            throw new common_1.BadRequestException('Atividade não encontrada.');
        await task.update({
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date() : null,
            completed_by: isCompleted ? userId : null,
        });
        const res = await task.reload({
            include: [
                { model: status_task_model_1.StatusTask, as: 'status_task' },
                { model: user_model_1.User, as: 'completer', attributes: ['id', 'name'] },
            ],
        });
        await this.cacheService.invalidatePattern('dashboard:*');
        return res;
    }
};
exports.CausesService = CausesService;
exports.CausesService = CausesService = CausesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_2.InjectModel)(cause_model_1.Cause)),
    __param(1, (0, sequelize_2.InjectModel)(cause_user_model_1.CauseUser)),
    __param(2, (0, sequelize_2.InjectModel)(status_task_model_1.StatusTask)),
    __param(3, (0, sequelize_2.InjectModel)(cause_task_model_1.CauseTask)),
    __param(4, (0, sequelize_2.InjectModel)(division_model_1.Division)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, audit_service_1.AuditService,
        cache_service_1.CacheService])
], CausesService);
//# sourceMappingURL=causes.service.js.map