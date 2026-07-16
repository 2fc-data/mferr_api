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
exports.PermissionHelper = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const user_model_1 = require("../../database/models/user.model");
const profile_model_1 = require("../../database/models/profile.model");
const audit_constants_1 = require("../constants/audit.constants");
let PermissionHelper = class PermissionHelper {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async getUserProfiles(userId) {
        const user = await this.userModel.findByPk(userId, {
            include: [{ model: profile_model_1.Profile, as: 'profiles' }],
        });
        return user?.profiles || [];
    }
    async isAdmin(userId) {
        const profiles = await this.getUserProfiles(userId);
        return profiles.some((p) => p.id === audit_constants_1.PROFILE_IDS.ADMIN);
    }
    async isManager(userId) {
        const profiles = await this.getUserProfiles(userId);
        return profiles.some((p) => p.id === audit_constants_1.PROFILE_IDS.MANAGER);
    }
    async checkCanAssignProfiles(currentUserId, requestedProfileIds) {
        if (!requestedProfileIds || requestedProfileIds.length === 0)
            return true;
        const isAdmin = await this.isAdmin(currentUserId);
        if (isAdmin)
            return true;
        const isManager = await this.isManager(currentUserId);
        if (isManager) {
            const hasUnauthorized = requestedProfileIds.some((id) => id !== audit_constants_1.PROFILE_IDS.CLIENT && id !== audit_constants_1.PROFILE_IDS.COLLABORATOR);
            if (hasUnauthorized) {
                throw new common_1.ForbiddenException('Gerentes só podem criar ou atribuir os perfis de Cliente e Colaborador.');
            }
        }
        return true;
    }
    async checkCanEditUser(currentUserId, targetUserId, requestedProfileIds) {
        const isAdmin = await this.isAdmin(currentUserId);
        if (isAdmin)
            return true;
        const isManager = await this.isManager(currentUserId);
        if (isManager) {
            if (requestedProfileIds) {
                const hasUnauthorized = requestedProfileIds.some((id) => id !== audit_constants_1.PROFILE_IDS.CLIENT && id !== audit_constants_1.PROFILE_IDS.COLLABORATOR);
                if (hasUnauthorized) {
                    throw new common_1.ForbiddenException('Gerentes só podem atribuir os perfis de Cliente e Colaborador.');
                }
            }
            const targetProfiles = await this.getUserProfiles(targetUserId);
            const targetIsAdminOrManager = targetProfiles.some((p) => p.id === audit_constants_1.PROFILE_IDS.ADMIN || p.id === audit_constants_1.PROFILE_IDS.MANAGER);
            if (targetIsAdminOrManager) {
                throw new common_1.ForbiddenException('Gerentes não podem modificar Administradores ou outros Gerentes.');
            }
        }
        return true;
    }
    async checkCanDeleteUser(currentUserId, targetUserId) {
        const isAdmin = await this.isAdmin(currentUserId);
        if (isAdmin)
            return true;
        const isManager = await this.isManager(currentUserId);
        if (isManager) {
            const targetProfiles = await this.getUserProfiles(targetUserId);
            const targetIsAdminOrManager = targetProfiles.some((p) => p.id === audit_constants_1.PROFILE_IDS.ADMIN || p.id === audit_constants_1.PROFILE_IDS.MANAGER);
            if (targetIsAdminOrManager) {
                throw new common_1.ForbiddenException('Gerentes não podem excluir Administradores ou outros Gerentes.');
            }
        }
        return true;
    }
    canAccessAllCauses(user) {
        return (user?.rules?.includes('admin') || user?.rules?.includes('settings.manage'));
    }
};
exports.PermissionHelper = PermissionHelper;
exports.PermissionHelper = PermissionHelper = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __metadata("design:paramtypes", [Object])
], PermissionHelper);
//# sourceMappingURL=permission.helper.js.map