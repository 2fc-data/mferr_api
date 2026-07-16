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
exports.CauseUsersController = void 0;
const common_1 = require("@nestjs/common");
const cause_users_service_1 = require("./cause_users.service");
const create_cause_user_dto_1 = require("./dto/create-cause_user.dto");
const update_cause_user_dto_1 = require("./dto/update-cause_user.dto");
const rules_guard_1 = require("../auth/rules.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const rules_decorator_1 = require("../auth/rules.decorator");
let CauseUsersController = class CauseUsersController {
    causeUsersService;
    constructor(causeUsersService) {
        this.causeUsersService = causeUsersService;
    }
    create(createCauseUserDto) {
        return this.causeUsersService.create(createCauseUserDto);
    }
    findAll() {
        return this.causeUsersService.findAll();
    }
    findOne(id) {
        return this.causeUsersService.findOne(+id);
    }
    update(id, updateCauseUserDto) {
        return this.causeUsersService.update(+id, updateCauseUserDto);
    }
    remove(id) {
        return this.causeUsersService.remove(+id);
    }
};
exports.CauseUsersController = CauseUsersController;
__decorate([
    (0, common_1.Post)(),
    (0, rules_decorator_1.Rules)('causes.edit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cause_user_dto_1.CreateCauseUserDto]),
    __metadata("design:returntype", void 0)
], CauseUsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, rules_decorator_1.Rules)('causes.view'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CauseUsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, rules_decorator_1.Rules)('causes.view'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CauseUsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, rules_decorator_1.Rules)('causes.edit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cause_user_dto_1.UpdateCauseUserDto]),
    __metadata("design:returntype", void 0)
], CauseUsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, rules_decorator_1.Rules)('causes.edit'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CauseUsersController.prototype, "remove", null);
exports.CauseUsersController = CauseUsersController = __decorate([
    (0, common_1.Controller)('cause-users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rules_guard_1.RulesGuard),
    __metadata("design:paramtypes", [cause_users_service_1.CauseUsersService])
], CauseUsersController);
//# sourceMappingURL=cause_users.controller.js.map