"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusTasksModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const status_tasks_service_1 = require("./status_tasks.service");
const status_tasks_controller_1 = require("./status_tasks.controller");
const status_task_model_1 = require("../database/models/status_task.model");
let StatusTasksModule = class StatusTasksModule {
};
exports.StatusTasksModule = StatusTasksModule;
exports.StatusTasksModule = StatusTasksModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([status_task_model_1.StatusTask])],
        controllers: [status_tasks_controller_1.StatusTasksController],
        providers: [status_tasks_service_1.StatusTasksService],
        exports: [status_tasks_service_1.StatusTasksService],
    })
], StatusTasksModule);
//# sourceMappingURL=status_tasks.module.js.map