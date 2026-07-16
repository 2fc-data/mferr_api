"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditModule = void 0;
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
const audit_service_1 = require("./audit.service");
const audit_controller_1 = require("./audit.controller");
let AuditModule = class AuditModule {
};
exports.AuditModule = AuditModule;
exports.AuditModule = AuditModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                audit_log_model_1.AuditLog,
                user_model_1.User,
                court_model_1.Court,
                area_model_1.Area,
                stage_model_1.Stage,
                status_model_1.Status,
                outcome_model_1.Outcome,
                city_model_1.City,
                division_model_1.Division,
            ]),
        ],
        providers: [audit_service_1.AuditService],
        controllers: [audit_controller_1.AuditController],
        exports: [audit_service_1.AuditService],
    })
], AuditModule);
//# sourceMappingURL=audit.module.js.map