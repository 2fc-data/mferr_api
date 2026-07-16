"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CausesModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const causes_service_1 = require("./causes.service");
const causes_controller_1 = require("./causes.controller");
const cause_model_1 = require("../database/models/cause.model");
const cause_user_model_1 = require("../database/models/cause_user.model");
const audit_module_1 = require("../audit/audit.module");
const common_module_1 = require("../common/common.module");
const court_model_1 = require("../database/models/court.model");
const area_model_1 = require("../database/models/area.model");
const stage_model_1 = require("../database/models/stage.model");
const status_model_1 = require("../database/models/status.model");
const outcome_model_1 = require("../database/models/outcome.model");
const division_model_1 = require("../database/models/division.model");
const city_model_1 = require("../database/models/city.model");
const user_model_1 = require("../database/models/user.model");
const status_task_model_1 = require("../database/models/status_task.model");
const cause_task_model_1 = require("../database/models/cause_task.model");
let CausesModule = class CausesModule {
};
exports.CausesModule = CausesModule;
exports.CausesModule = CausesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                cause_model_1.Cause,
                cause_user_model_1.CauseUser,
                court_model_1.Court,
                area_model_1.Area,
                stage_model_1.Stage,
                status_model_1.Status,
                outcome_model_1.Outcome,
                division_model_1.Division,
                city_model_1.City,
                user_model_1.User,
                status_task_model_1.StatusTask,
                cause_task_model_1.CauseTask,
            ]),
            audit_module_1.AuditModule,
            common_module_1.CommonModule,
        ],
        controllers: [causes_controller_1.CausesController],
        providers: [causes_service_1.CausesService],
    })
], CausesModule);
//# sourceMappingURL=causes.module.js.map