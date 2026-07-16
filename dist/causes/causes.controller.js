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
exports.CausesController = void 0;
const common_1 = require("@nestjs/common");
const causes_service_1 = require("./causes.service");
const create_cause_dto_1 = require("./dto/create-cause.dto");
const update_cause_dto_1 = require("./dto/update-cause.dto");
const file_upload_helper_1 = require("../common/helpers/file-upload.helper");
const rules_guard_1 = require("../auth/rules.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const rules_decorator_1 = require("../auth/rules.decorator");
let CausesController = class CausesController {
    causesService;
    constructor(causesService) {
        this.causesService = causesService;
    }
    create(createCauseDto, req) {
        console.log('Incoming CreateCauseDto:', createCauseDto);
        return this.causesService.create(createCauseDto, req.user);
    }
    findAll(req, city_id, court_id, court_division_id, includeDeleted) {
        const filters = {
            city_id: city_id ? Number(city_id) : undefined,
            court_id: court_id ? Number(court_id) : undefined,
            division_id: court_division_id ? Number(court_division_id) : undefined,
        };
        return this.causesService.findAll(req.user, filters, includeDeleted === 'true');
    }
    findOne(id, req) {
        return this.causesService.findOne(+id, req.user);
    }
    update(id, updateCauseDto, req) {
        return this.causesService.update(+id, updateCauseDto, req.user);
    }
    remove(id) {
        return this.causesService.remove(+id);
    }
    async uploadContractDoc(id, file) {
        (0, file_upload_helper_1.checkUploadedFile)(file);
        const contract_doc_path = `/uploads/documents/contracts/${file.filename}`;
        await this.causesService.updateContractDoc(+id, contract_doc_path);
        return { contract_doc_path };
    }
    getTasks(id, status_id) {
        return this.causesService.findAllTasks(id, status_id ? Number(status_id) : undefined);
    }
    toggleTask(id, taskId, is_completed, req) {
        return this.causesService.toggleTask(+taskId, req.user.id, is_completed);
    }
};
exports.CausesController = CausesController;
__decorate([
    (0, common_1.Post)(),
    (0, rules_decorator_1.Rules)('causes.create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cause_dto_1.CreateCauseDto, Object]),
    __metadata("design:returntype", void 0)
], CausesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, rules_decorator_1.Rules)('causes.view'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('city_id')),
    __param(2, (0, common_1.Query)('court_id')),
    __param(3, (0, common_1.Query)('court_division_id')),
    __param(4, (0, common_1.Query)('includeDeleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], CausesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, rules_decorator_1.Rules)('causes.view'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CausesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, rules_decorator_1.Rules)('causes.edit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cause_dto_1.UpdateCauseDto, Object]),
    __metadata("design:returntype", void 0)
], CausesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, rules_decorator_1.Rules)('causes.delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CausesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/contract-doc'),
    (0, rules_decorator_1.Rules)('causes.edit'),
    (0, common_1.UseInterceptors)((0, file_upload_helper_1.GenericFileInterceptor)('file', 'documents/contracts')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CausesController.prototype, "uploadContractDoc", null);
__decorate([
    (0, common_1.Get)(':id/tasks'),
    (0, rules_decorator_1.Rules)('causes.view'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('status_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CausesController.prototype, "getTasks", null);
__decorate([
    (0, common_1.Patch)(':id/tasks/:taskId'),
    (0, rules_decorator_1.Rules)('causes.edit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Body)('is_completed')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean, Object]),
    __metadata("design:returntype", void 0)
], CausesController.prototype, "toggleTask", null);
exports.CausesController = CausesController = __decorate([
    (0, common_1.Controller)('causes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rules_guard_1.RulesGuard),
    __metadata("design:paramtypes", [causes_service_1.CausesService])
], CausesController);
//# sourceMappingURL=causes.controller.js.map