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
exports.AreasController = void 0;
const common_1 = require("@nestjs/common");
const areas_service_1 = require("./areas.service");
const create_area_dto_1 = require("./dto/create-area.dto");
const update_area_dto_1 = require("./dto/update-area.dto");
const rules_guard_1 = require("../auth/rules.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const rules_decorator_1 = require("../auth/rules.decorator");
let AreasController = class AreasController {
    areasService;
    constructor(areasService) {
        this.areasService = areasService;
    }
    create(createAreaDto) {
        return this.areasService.create(createAreaDto);
    }
    findAll() {
        return this.areasService.findAll();
    }
    findOne(id) {
        return this.areasService.findOne(+id);
    }
    update(id, updateAreaDto) {
        return this.areasService.update(+id, updateAreaDto);
    }
    remove(id) {
        return this.areasService.remove(+id);
    }
};
exports.AreasController = AreasController;
__decorate([
    (0, common_1.Post)(),
    (0, rules_decorator_1.Rules)('settings.manage'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_area_dto_1.CreateAreaDto]),
    __metadata("design:returntype", void 0)
], AreasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, rules_decorator_1.Rules)('settings.manage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AreasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, rules_decorator_1.Rules)('settings.manage'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AreasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, rules_decorator_1.Rules)('settings.manage'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_area_dto_1.UpdateAreaDto]),
    __metadata("design:returntype", void 0)
], AreasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, rules_decorator_1.Rules)('settings.manage'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AreasController.prototype, "remove", null);
exports.AreasController = AreasController = __decorate([
    (0, common_1.Controller)('areas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rules_guard_1.RulesGuard),
    __metadata("design:paramtypes", [areas_service_1.AreasService])
], AreasController);
//# sourceMappingURL=areas.controller.js.map