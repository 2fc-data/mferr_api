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
exports.StatusTasksController = void 0;
const common_1 = require("@nestjs/common");
const status_tasks_service_1 = require("./status_tasks.service");
const create_status_task_dto_1 = require("./dto/create-status-task.dto");
const update_status_task_dto_1 = require("./dto/update-status-task.dto");
let StatusTasksController = class StatusTasksController {
    statusTasksService;
    constructor(statusTasksService) {
        this.statusTasksService = statusTasksService;
    }
    create(createStatusTaskDto) {
        return this.statusTasksService.create(createStatusTaskDto);
    }
    findAll() {
        return this.statusTasksService.findAll();
    }
    findByStatus(statusId) {
        return this.statusTasksService.findByStatus(+statusId);
    }
    findOne(id) {
        return this.statusTasksService.findOne(+id);
    }
    update(id, updateStatusTaskDto) {
        return this.statusTasksService.update(+id, updateStatusTaskDto);
    }
    remove(id) {
        return this.statusTasksService.remove(+id);
    }
};
exports.StatusTasksController = StatusTasksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_status_task_dto_1.CreateStatusTaskDto]),
    __metadata("design:returntype", void 0)
], StatusTasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatusTasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('status/:statusId'),
    __param(0, (0, common_1.Param)('statusId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StatusTasksController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StatusTasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_status_task_dto_1.UpdateStatusTaskDto]),
    __metadata("design:returntype", void 0)
], StatusTasksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StatusTasksController.prototype, "remove", null);
exports.StatusTasksController = StatusTasksController = __decorate([
    (0, common_1.Controller)('status-tasks'),
    __metadata("design:paramtypes", [status_tasks_service_1.StatusTasksService])
], StatusTasksController);
//# sourceMappingURL=status_tasks.controller.js.map