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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const audit_log_model_1 = require("../database/models/audit_log.model");
const user_model_1 = require("../database/models/user.model");
const court_model_1 = require("../database/models/court.model");
const area_model_1 = require("../database/models/area.model");
const stage_model_1 = require("../database/models/stage.model");
const status_model_1 = require("../database/models/status.model");
const outcome_model_1 = require("../database/models/outcome.model");
const city_model_1 = require("../database/models/city.model");
const division_model_1 = require("../database/models/division.model");
let AuditService = class AuditService {
    auditLogModel;
    courtModel;
    areaModel;
    stageModel;
    statusModel;
    outcomeModel;
    cityModel;
    divisionModel;
    constructor(auditLogModel, courtModel, areaModel, stageModel, statusModel, outcomeModel, cityModel, divisionModel) {
        this.auditLogModel = auditLogModel;
        this.courtModel = courtModel;
        this.areaModel = areaModel;
        this.stageModel = stageModel;
        this.statusModel = statusModel;
        this.outcomeModel = outcomeModel;
        this.cityModel = cityModel;
        this.divisionModel = divisionModel;
    }
    async resolveName(field, value) {
        if (!value)
            return 'vazio';
        const modelMap = {
            court_id: this.courtModel,
            area_id: this.areaModel,
            current_stage_id: this.stageModel,
            current_status_id: this.statusModel,
            outcome_id: this.outcomeModel,
            city_id: this.cityModel,
            division_id: this.divisionModel,
        };
        const model = modelMap[field];
        if (model) {
            try {
                const record = await model.findByPk(value);
                return record ? record.name : value;
            }
            catch (e) {
                return value;
            }
        }
        return value;
    }
    async recordUpdate(entityType, entityId, oldData, newData, userId) {
        const changes = {};
        let hasChanges = false;
        for (const key in newData) {
            if (['updated_at', 'created_at', 'password_hash'].includes(key))
                continue;
            const oldVal = oldData[key];
            const newVal = newData[key];
            if (oldVal !== newVal &&
                JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
                const oldResolved = await this.resolveName(key, oldVal);
                const newResolved = await this.resolveName(key, newVal);
                changes[key] = {
                    old: oldResolved,
                    new: newResolved,
                };
                hasChanges = true;
            }
        }
        if (!hasChanges)
            return null;
        return this.createRawLog(entityType, entityId, 'UPDATE', changes, userId);
    }
    async createRawLog(entityType, entityId, action, changes, userId) {
        console.log(`[AuditLog] Creating log for ${entityType}#${entityId} - Action: ${action}`);
        return this.auditLogModel.create({
            entity_type: entityType,
            entity_id: entityId,
            action,
            changes,
            user_id: userId,
        });
    }
    async findAllByEntity(entityType, entityId) {
        return this.auditLogModel.findAll({
            where: { entity_type: entityType, entity_id: entityId },
            include: [{ model: user_model_1.User, attributes: ['id', 'name'] }],
            order: [['created_at', 'DESC']],
        });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(audit_log_model_1.AuditLog)),
    __param(1, (0, sequelize_1.InjectModel)(court_model_1.Court)),
    __param(2, (0, sequelize_1.InjectModel)(area_model_1.Area)),
    __param(3, (0, sequelize_1.InjectModel)(stage_model_1.Stage)),
    __param(4, (0, sequelize_1.InjectModel)(status_model_1.Status)),
    __param(5, (0, sequelize_1.InjectModel)(outcome_model_1.Outcome)),
    __param(6, (0, sequelize_1.InjectModel)(city_model_1.City)),
    __param(7, (0, sequelize_1.InjectModel)(division_model_1.Division)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object])
], AuditService);
//# sourceMappingURL=audit.service.js.map