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
exports.AddressesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const address_model_1 = require("../database/models/address.model");
const user_address_model_1 = require("../database/models/user_address.model");
const address_type_model_1 = require("../database/models/address_type.model");
const audit_service_1 = require("../audit/audit.service");
const sequelize_typescript_1 = require("sequelize-typescript");
let AddressesService = class AddressesService {
    addressModel;
    userAddressModel;
    auditService;
    sequelize;
    constructor(addressModel, userAddressModel, auditService, sequelize) {
        this.addressModel = addressModel;
        this.userAddressModel = userAddressModel;
        this.auditService = auditService;
        this.sequelize = sequelize;
    }
    async create(createAddressDto, userId, performingUserId) {
        const transaction = await this.sequelize.transaction();
        try {
            const { address_type_id, is_primary, user_id, ...addressData } = createAddressDto;
            const address = await this.addressModel.create(addressData, {
                transaction,
            });
            const targetUserId = userId || user_id || createAddressDto.user_id;
            if (targetUserId) {
                await this.userAddressModel.create({
                    user_id: Number(targetUserId),
                    address_id: address.id,
                    address_type_id: address_type_id || createAddressDto.address_type_id || 1,
                    is_primary: is_primary ?? createAddressDto.is_primary ?? true,
                }, { transaction });
            }
            await transaction.commit();
            if (targetUserId) {
                const addressLabels = {
                    postcode: 'CEP',
                    city: 'Cidade',
                    state: 'UF',
                    district: 'Bairro',
                    street: 'Logradouro',
                    number: 'Número',
                    complement: 'Complemento',
                    address_type_id: 'ID do Tipo de Endereço',
                };
                const initialData = {};
                const isVazio = (v) => v === null ||
                    v === undefined ||
                    v === '' ||
                    String(v).trim() === '' ||
                    String(v).trim() === 'null';
                Object.keys(addressLabels).forEach((key) => {
                    let val;
                    if (key === 'address_type_id') {
                        val = address_type_id;
                    }
                    else {
                        val = address[key];
                    }
                    initialData[addressLabels[key]] = {
                        old: 'vazio',
                        new: isVazio(val) ? 'vazio' : val,
                    };
                });
                await this.auditService.createRawLog('user', targetUserId, 'UPDATE', { 'Endereço (Novo)': initialData }, performingUserId || targetUserId);
            }
            return address;
        }
        catch (error) {
            if (transaction)
                await transaction.rollback();
            throw error;
        }
    }
    async findAll() {
        return this.addressModel.findAll({ include: ['users'] });
    }
    async findOne(id) {
        const address = await this.addressModel.findByPk(id, {
            include: ['users'],
        });
        if (!address) {
            throw new common_1.NotFoundException(`Endereço com ID ${id} não encontrado`);
        }
        return address;
    }
    async update(id, updateAddressDto, performingUserId) {
        const address = await this.findOne(id);
        const oldValues = address.get({ plain: true });
        const { address_type_id, is_primary, user_id, ...addressData } = updateAddressDto;
        await address.update(addressData);
        const targetUserId = user_id || updateAddressDto.user_id;
        if (targetUserId || address_type_id || is_primary !== undefined) {
            const [ua, created] = await this.userAddressModel.findOrCreate({
                where: { address_id: id },
                defaults: {
                    user_id: Number(targetUserId),
                    address_id: id,
                    address_type_id: address_type_id || 1,
                    is_primary: is_primary ?? false,
                }
            });
            if (!created) {
                await ua.update({
                    ...(targetUserId && { user_id: Number(targetUserId) }),
                    ...(address_type_id && { address_type_id }),
                    ...(is_primary !== undefined && { is_primary })
                });
            }
        }
        const newValues = address.get({ plain: true });
        const userAddress = await this.userAddressModel.findOne({
            where: { address_id: id },
        });
        const targetEntityType = userAddress ? 'user' : 'address';
        const targetEntityId = userAddress ? userAddress.user_id : id;
        const addressLabels = {
            postcode: 'CEP',
            city: 'Cidade',
            state: 'UF',
            district: 'Bairro',
            street: 'Logradouro',
            number: 'Número',
            complement: 'Complemento',
            address_type_id: 'ID do Tipo de Endereço',
        };
        const isVazio = (v) => v === null ||
            v === undefined ||
            v === '' ||
            String(v).trim() === '' ||
            String(v).trim() === 'null';
        const changes = {};
        let hasChanges = false;
        for (const key of Object.keys(addressLabels)) {
            const oldV = oldValues[key];
            const newV = newValues[key];
            if (isVazio(oldV) && isVazio(newV))
                continue;
            if (String(oldV).trim() !== String(newV).trim()) {
                changes[`Endereço: ${addressLabels[key]}`] = {
                    old: isVazio(oldV) ? 'vazio' : oldV,
                    new: isVazio(newV) ? 'vazio' : newV,
                };
                hasChanges = true;
            }
        }
        if (hasChanges) {
            await this.auditService.createRawLog(targetEntityType, targetEntityId, 'UPDATE', changes, performingUserId || targetEntityId);
        }
        return address;
    }
    async remove(id, performingUserId) {
        const address = await this.findOne(id);
        const oldValues = address.get({ plain: true });
        await address.destroy();
        await this.auditService.recordUpdate('address', id, oldValues, null, performingUserId || 0);
    }
    async findByUser(userId) {
        try {
            const userAddresses = await this.userAddressModel.findAll({
                where: { user_id: userId },
                attributes: ['address_id', 'address_type_id', 'is_primary'],
                include: [{ model: address_type_model_1.AddressType, as: 'address_type' }]
            });
            if (!userAddresses || userAddresses.length === 0) {
                return [];
            }
            const addressIds = userAddresses.map((ua) => ua.address_id);
            const addresses = await this.addressModel.findAll({
                where: {
                    id: addressIds,
                },
            });
            return addresses.map((addr) => {
                const ua = userAddresses.find((u) => u.address_id === addr.id);
                const plain = addr.get({ plain: true });
                return {
                    ...plain,
                    address_type: ua?.address_type || null,
                    is_primary: ua?.is_primary || false,
                };
            });
        }
        catch (error) {
            console.error('Error in findByUser:', error);
            return [];
        }
    }
};
exports.AddressesService = AddressesService;
exports.AddressesService = AddressesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(address_model_1.Address)),
    __param(1, (0, sequelize_1.InjectModel)(user_address_model_1.UserAddress)),
    __metadata("design:paramtypes", [Object, Object, audit_service_1.AuditService,
        sequelize_typescript_1.Sequelize])
], AddressesService);
//# sourceMappingURL=addresses.service.js.map