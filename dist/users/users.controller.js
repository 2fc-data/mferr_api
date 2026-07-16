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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const file_upload_helper_1 = require("../common/helpers/file-upload.helper");
const rules_guard_1 = require("../auth/rules.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const rules_decorator_1 = require("../auth/rules.decorator");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(req, createUserDto) {
        return this.usersService.create(createUserDto, req.user);
    }
    findAll(req, includeDeleted) {
        return this.usersService.findAll(req.user, includeDeleted === 'true');
    }
    findCollaborators() {
        return this.usersService.findCollaborators();
    }
    findClients() {
        return this.usersService.findClients();
    }
    findOne(id) {
        return this.usersService.findOne(+id);
    }
    update(req, id, updateUserDto) {
        return this.usersService.update(+id, updateUserDto, req.user);
    }
    async uploadAvatar(req, file) {
        (0, file_upload_helper_1.checkUploadedFile)(file);
        const avatar_url = `/uploads/avatars/${file.filename}`;
        await this.usersService.update(req.user['id'], { avatar_url });
        return { avatar_url };
    }
    remove(req, id) {
        return this.usersService.remove(+id, req.user);
    }
    restore(req, id) {
        return this.usersService.restore(+id, req.user);
    }
    async uploadLgpdDoc(id, file) {
        (0, file_upload_helper_1.checkUploadedFile)(file);
        const path = `/uploads/documents/lgpd/${file.filename}`;
        await this.usersService.updateUserDocument(+id, 'lgpd_doc_path', path);
        return { lgpd_doc_path: path };
    }
    async uploadLgpdMinorDoc(id, file) {
        (0, file_upload_helper_1.checkUploadedFile)(file);
        const path = `/uploads/documents/lgpd-minor/${file.filename}`;
        await this.usersService.updateUserDocument(+id, 'lgpd_minor_doc_path', path);
        return { lgpd_minor_doc_path: path };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, rules_decorator_1.Rules)('users.create'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, rules_decorator_1.Rules)('users.view'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('includeDeleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('collaborators'),
    (0, rules_decorator_1.Rules)('users.view'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findCollaborators", null);
__decorate([
    (0, common_1.Get)('clients'),
    (0, rules_decorator_1.Rules)('users.view'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findClients", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, rules_decorator_1.Rules)('users.view'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, rules_decorator_1.Rules)('users.edit'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('me/avatar'),
    (0, rules_decorator_1.Rules)('users.edit'),
    (0, common_1.UseInterceptors)((0, file_upload_helper_1.GenericFileInterceptor)('file', 'avatars')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, rules_decorator_1.Rules)('users.delete'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/restore'),
    (0, rules_decorator_1.Rules)('users.delete'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "restore", null);
__decorate([
    (0, common_1.Post)(':id/lgpd-doc'),
    (0, rules_decorator_1.Rules)('users.edit'),
    (0, common_1.UseInterceptors)((0, file_upload_helper_1.GenericFileInterceptor)('file', 'documents/lgpd')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadLgpdDoc", null);
__decorate([
    (0, common_1.Post)(':id/lgpd-minor-doc'),
    (0, rules_decorator_1.Rules)('users.edit'),
    (0, common_1.UseInterceptors)((0, file_upload_helper_1.GenericFileInterceptor)('file', 'documents/lgpd-minor', 'minor')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadLgpdMinorDoc", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rules_guard_1.RulesGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map