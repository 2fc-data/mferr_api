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
exports.StagesController = void 0;
const common_1 = require("@nestjs/common");
const stages_service_1 = require("./stages.service");
const create_stage_dto_1 = require("./dto/create-stage.dto");
const update_stage_dto_1 = require("./dto/update-stage.dto");
const rules_guard_1 = require("../auth/rules.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const rules_decorator_1 = require("../auth/rules.decorator");
let StagesController = class StagesController {
    stagesService;
    constructor(stagesService) {
        this.stagesService = stagesService;
    }
    create(createStageDto) {
        return this.stagesService.create(createStageDto);
    }
    findAll() {
        return this.stagesService.findAll();
    }
    findOne(id) {
        return this.stagesService.findOne(+id);
    }
    update(id, updateStageDto) {
        return this.stagesService.update(+id, updateStageDto);
    }
    remove(id) {
        return this.stagesService.remove(+id);
    }
};
exports.StagesController = StagesController;
__decorate([
    (0, common_1.Post)(),
    (0, rules_decorator_1.Rules)('settings.manage'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_stage_dto_1.CreateStageDto]),
    __metadata("design:returntype", void 0)
], StagesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, rules_decorator_1.Rules)('settings.manage', 'causes.view'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, rules_decorator_1.Rules)('settings.manage'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, rules_decorator_1.Rules)('settings.manage'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_stage_dto_1.UpdateStageDto]),
    __metadata("design:returntype", void 0)
], StagesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, rules_decorator_1.Rules)('settings.manage'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StagesController.prototype, "remove", null);
exports.StagesController = StagesController = __decorate([
    (0, common_1.Controller)('stages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rules_guard_1.RulesGuard),
    __metadata("design:paramtypes", [stages_service_1.StagesService])
], StagesController);
//# sourceMappingURL=stages.controller.js.map