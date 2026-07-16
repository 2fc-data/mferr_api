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
exports.StatusTasksService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const status_task_model_1 = require("../database/models/status_task.model");
const base_service_1 = require("../common/base.service");
let StatusTasksService = class StatusTasksService extends base_service_1.BaseService {
    statusTaskModel;
    constructor(statusTaskModel) {
        super(statusTaskModel);
        this.statusTaskModel = statusTaskModel;
    }
    async findByStatus(statusId) {
        return this.statusTaskModel.findAll({
            where: { status_id: statusId },
            order: [['order_index', 'ASC']],
        });
    }
};
exports.StatusTasksService = StatusTasksService;
exports.StatusTasksService = StatusTasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(status_task_model_1.StatusTask)),
    __metadata("design:paramtypes", [Object])
], StatusTasksService);
//# sourceMappingURL=status_tasks.service.js.map