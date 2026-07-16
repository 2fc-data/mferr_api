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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const sequelize_2 = require("@nestjs/sequelize");
const user_model_1 = require("../database/models/user.model");
const profile_model_1 = require("../database/models/profile.model");
const rule_model_1 = require("../database/models/rule.model");
const address_model_1 = require("../database/models/address.model");
const user_address_model_1 = require("../database/models/user_address.model");
const audit_service_1 = require("../audit/audit.service");
const logger_service_1 = require("../common/logger/logger.service");
const permission_helper_1 = require("../common/helpers/permission.helper");
const base_service_1 = require("../common/base.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService extends base_service_1.BaseService {
    userModel;
    addressModel;
    userAddressModel;
    auditService;
    logger;
    permissionHelper;
    constructor(userModel, addressModel, userAddressModel, auditService, logger, permissionHelper) {
        super(userModel);
        this.userModel = userModel;
        this.addressModel = addressModel;
        this.userAddressModel = userAddressModel;
        this.auditService = auditService;
        this.logger = logger;
        this.permissionHelper = permissionHelper;
    }
    async handleUniqueConstraintError(e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            const field = e.errors?.[0]?.path || Object.keys(e.fields || {})[0] || 'campo';
            const value = e.errors?.[0]?.value || e.fields?.[field];
            const fieldLabels = {
                document: 'Documento (CPF/CNPJ)',
                email: 'E-mail',
                username: 'Nome de Usuário (Login)',
                phone1: 'Telefone 1',
                rg: 'RG',
                pis: 'PIS/PASEP',
                ctps: 'CTPS',
            };
            const label = fieldLabels[field] || field;
            try {
                const validFields = ['document', 'email', 'username', 'phone1', 'rg', 'pis', 'ctps'];
                if (validFields.includes(field)) {
                    const deletedUser = await this.userModel.findOne({
                        where: { [field]: value },
                        paranoid: false,
                    });
                    if (deletedUser?.deleted_at) {
                        throw new common_1.ConflictException(`Já existe um usuário cadastrado (porém excluído) com este ${label}. Entre em contato com o suporte para restaurá-lo se necessário.`);
                    }
                }
            }
            catch (innerError) {
                if (innerError instanceof common_1.ConflictException)
                    throw innerError;
                this.logger.error(`Error checking for deleted user: ${innerError.message}`);
            }
            throw new common_1.ConflictException(`Já existe um usuário cadastrado com este ${label}.`);
        }
        throw e;
    }
    normalizeData(data) {
        const normalized = { ...data };
        if (normalized.document) {
            normalized.document = normalized.document.replace(/\D/g, '');
        }
        if (normalized.email) {
            normalized.email = normalized.email.toLowerCase().trim();
        }
        if (normalized.username === '') {
            normalized.username = null;
        }
        else if (normalized.username) {
            normalized.username = normalized.username.toLowerCase().trim();
        }
        if (normalized.rg) {
            normalized.rg = normalized.rg.replace(/[^\dXx]/g, '').toUpperCase();
        }
        if (normalized.phone1) {
            normalized.phone1 = normalized.phone1.replace(/\D/g, '');
        }
        if (normalized.pis) {
            normalized.pis = normalized.pis.replace(/\D/g, '');
        }
        if (normalized.ctps) {
            normalized.ctps = normalized.ctps.replace(/\D/g, '');
        }
        return normalized;
    }
    async create(createUserDto, currentUser) {
        if (currentUser) {
            await this.permissionHelper.checkCanAssignProfiles(currentUser.id, createUserDto.profile_ids);
        }
        const normalizedData = this.normalizeData(createUserDto);
        const { password, profile_ids, ...userData } = normalizedData;
        const finalPassword = password?.trim()
            ? password
            : Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(finalPassword, salt);
        try {
            const user = await this.userModel.create({
                ...userData,
                password_hash,
            });
            this.logger.log(`User created: ${user.id}`, 'UsersService');
            if (profile_ids && profile_ids.length > 0) {
                await user.$set('profiles', profile_ids);
            }
            return this.findOne(user.id);
        }
        catch (e) {
            await this.handleUniqueConstraintError(e);
        }
    }
    async findAll(currentUser, includeDeleted = false) {
        if (currentUser) {
            const isManager = await this.permissionHelper.isManager(currentUser.id);
            const isAdmin = await this.permissionHelper.isAdmin(currentUser.id);
            if (isManager && !isAdmin) {
                return this.userModel.findAll({
                    attributes: { exclude: ['password_hash'] },
                    include: [
                        {
                            model: profile_model_1.Profile,
                            as: 'profiles',
                            where: { id: [3, 4] },
                            attributes: ['id', 'name'],
                        },
                    ],
                    order: [['name', 'ASC']],
                });
            }
            if (includeDeleted && isAdmin) {
                const users = await this.userModel.findAll({
                    attributes: { exclude: ['password_hash'] },
                    include: [{ model: profile_model_1.Profile, as: 'profiles', attributes: ['id', 'name'] }],
                    order: [['name', 'ASC']],
                    paranoid: false,
                });
                return users.map((u) => {
                    const plain = u.toJSON();
                    plain.deleted = !!plain.deleted_at;
                    return plain;
                });
            }
        }
        return this.userModel.findAll({
            attributes: { exclude: ['password_hash'] },
            include: [{ model: profile_model_1.Profile, as: 'profiles', attributes: ['id', 'name'] }],
            order: [['name', 'ASC']],
        });
    }
    async findCollaborators() {
        return this.userModel.findAll({
            attributes: { exclude: ['password_hash'] },
            include: [
                {
                    model: profile_model_1.Profile,
                    as: 'profiles',
                    where: { id: 3 },
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
            ],
            order: [['name', 'ASC']],
        });
    }
    async findClients() {
        return this.userModel.findAll({
            attributes: { exclude: ['password_hash'] },
            include: [
                {
                    model: profile_model_1.Profile,
                    as: 'profiles',
                    where: { id: 4 },
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
            ],
            order: [['name', 'ASC']],
        });
    }
    findOne(id) {
        return this.userModel.findByPk(id, {
            attributes: { exclude: ['password_hash'] },
            include: [
                {
                    model: profile_model_1.Profile,
                    as: 'profiles',
                    attributes: ['id', 'name'],
                    include: [{ model: rule_model_1.Rule, as: 'rules' }],
                },
                {
                    model: address_model_1.Address,
                    as: 'addresses',
                    through: {
                        attributes: ['address_type_id', 'is_primary'],
                    },
                    include: [{ model: user_model_1.User, as: 'users', attributes: ['id'], through: { attributes: [] } }]
                },
            ],
        });
    }
    async findOneByUsername(username) {
        const trimmed = username.trim();
        const lower = trimmed.toLowerCase();
        return this.userModel.findOne({
            attributes: { include: ['password_hash'] },
            where: {
                [sequelize_1.Op.or]: [
                    { username: trimmed },
                    { username: lower },
                    { email: trimmed },
                    { email: lower },
                ],
            },
            include: [
                {
                    model: profile_model_1.Profile,
                    as: 'profiles',
                    include: [{ model: rule_model_1.Rule, as: 'rules' }],
                },
            ],
        });
    }
    async update(id, updateUserDto, currentUser) {
        if (currentUser) {
            const isSelfEdit = Number(currentUser.id) === Number(id);
            if (!isSelfEdit) {
                await this.permissionHelper.checkCanEditUser(currentUser.id, id, updateUserDto.profile_ids);
            }
            else if (updateUserDto.profile_ids &&
                updateUserDto.profile_ids.length > 0) {
                await this.permissionHelper.checkCanAssignProfiles(currentUser.id, updateUserDto.profile_ids);
            }
        }
        const oldUser = await this.userModel.findByPk(id);
        if (!oldUser)
            return null;
        const normalizedData = this.normalizeData(updateUserDto);
        const { profile_ids, password, ...userData } = normalizedData;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            userData['password_hash'] = await bcrypt.hash(password, salt);
        }
        try {
            const payload = { ...userData };
            await this.userModel.update(payload, { where: { id } });
            if (currentUser) {
                await this.auditService.recordUpdate('User', id, oldUser.get({ plain: true }), payload, currentUser.id);
            }
            if (profile_ids) {
                const user = await this.userModel.findByPk(id);
                if (user) {
                    await user.$set('profiles', profile_ids);
                }
            }
            return this.findOne(id);
        }
        catch (e) {
            await this.handleUniqueConstraintError(e);
        }
        return this.findOne(id);
    }
    async remove(id, currentUser) {
        if (currentUser) {
            await this.permissionHelper.checkCanDeleteUser(currentUser.id, id);
        }
        const user = await this.userModel.findByPk(id, {
            include: [{ model: address_model_1.Address, as: 'addresses' }],
        });
        if (!user) {
            return 0;
        }
        const addressIds = user.addresses?.map((addr) => addr.id) || [];
        await user.update({ is_active: false });
        const result = await super.remove(id);
        if (addressIds.length > 0) {
            for (const addressId of addressIds) {
                const linkCount = await this.userAddressModel.count({
                    where: { address_id: addressId },
                });
                if (linkCount === 0) {
                    await this.addressModel.destroy({ where: { id: addressId } });
                }
            }
        }
        this.logger.log(`User ${id} deleted and its orphaned addresses cleaned up`, 'UsersService');
        return result;
    }
    async updateUserDocument(id, field, path) {
        const user = await this.userModel.findByPk(id);
        if (!user)
            throw new common_1.BadRequestException('Usuário não encontrado.');
        return user.update({ [field]: path });
    }
    async findOneByEmail(email) {
        const normalized = email.toLowerCase().trim();
        return this.userModel.findOne({
            where: { email: normalized },
        });
    }
    async updatePassword(id, password_hash) {
        await this.userModel.update({ password_hash }, { where: { id } });
    }
    async restore(id, currentUser) {
        if (currentUser) {
            const isAdmin = await this.permissionHelper.isAdmin(currentUser.id);
            if (!isAdmin) {
                throw new common_1.ForbiddenException('Apenas administradores podem restaurar usuários.');
            }
        }
        const user = await this.userModel.findByPk(id, { paranoid: false });
        if (!user) {
            throw new common_1.BadRequestException('Usuário não encontrado.');
        }
        if (!user.deleted_at) {
            throw new common_1.BadRequestException('Este usuário já está ativo.');
        }
        await user.restore();
        await user.update({ is_active: true });
        this.logger.log(`User ${id} restored by admin`, 'UsersService');
        return this.findOne(id);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_2.InjectModel)(user_model_1.User)),
    __param(1, (0, sequelize_2.InjectModel)(address_model_1.Address)),
    __param(2, (0, sequelize_2.InjectModel)(user_address_model_1.UserAddress)),
    __metadata("design:paramtypes", [Object, Object, Object, audit_service_1.AuditService,
        logger_service_1.AppLogger,
        permission_helper_1.PermissionHelper])
], UsersService);
//# sourceMappingURL=users.service.js.map