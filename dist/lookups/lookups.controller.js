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
exports.LookupsController = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const address_type_model_1 = require("../database/models/address_type.model");
const cause_role_type_model_1 = require("../database/models/cause_role_type.model");
const party_side_model_1 = require("../database/models/party_side.model");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let LookupsController = class LookupsController {
    addressTypeModel;
    causeRoleTypeModel;
    partySideModel;
    constructor(addressTypeModel, causeRoleTypeModel, partySideModel) {
        this.addressTypeModel = addressTypeModel;
        this.causeRoleTypeModel = causeRoleTypeModel;
        this.partySideModel = partySideModel;
    }
    getAddressTypes() {
        return this.addressTypeModel.findAll({ where: { is_active: true }, order: [['name', 'ASC']] });
    }
    getCauseRoleTypes() {
        return this.causeRoleTypeModel.findAll({ where: { is_active: true }, order: [['name', 'ASC']] });
    }
    getPartySides() {
        return this.partySideModel.findAll({ where: { is_active: true }, order: [['name', 'ASC']] });
    }
};
exports.LookupsController = LookupsController;
__decorate([
    (0, common_1.Get)('address-types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LookupsController.prototype, "getAddressTypes", null);
__decorate([
    (0, common_1.Get)('cause-role-types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LookupsController.prototype, "getCauseRoleTypes", null);
__decorate([
    (0, common_1.Get)('party-sides'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LookupsController.prototype, "getPartySides", null);
exports.LookupsController = LookupsController = __decorate([
    ApiTags('Lookups'),
    (0, common_1.Controller)('lookups'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, sequelize_1.InjectModel)(address_type_model_1.AddressType)),
    __param(1, (0, sequelize_1.InjectModel)(cause_role_type_model_1.CauseRoleType)),
    __param(2, (0, sequelize_1.InjectModel)(party_side_model_1.PartySide)),
    __metadata("design:paramtypes", [Object, Object, Object])
], LookupsController);
function ApiTags(name) {
    return (target) => { };
}
//# sourceMappingURL=lookups.controller.js.map