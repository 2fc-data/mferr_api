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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAddress = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const address_model_1 = require("./address.model");
const address_type_model_1 = require("./address_type.model");
let UserAddress = class UserAddress extends sequelize_typescript_1.Model {
    user_id;
    address_id;
    address_type_id;
    address_type;
    is_primary;
    created_at;
    updated_at;
};
exports.UserAddress = UserAddress;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], UserAddress.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], UserAddress.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => address_model_1.Address),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], UserAddress.prototype, "address_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => address_type_model_1.AddressType),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], UserAddress.prototype, "address_type_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => address_type_model_1.AddressType),
    __metadata("design:type", address_type_model_1.AddressType)
], UserAddress.prototype, "address_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], UserAddress.prototype, "is_primary", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], UserAddress.prototype, "created_at", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], UserAddress.prototype, "updated_at", void 0);
exports.UserAddress = UserAddress = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'user_addresses',
        timestamps: true,
        underscored: true,
    })
], UserAddress);
//# sourceMappingURL=user_address.model.js.map