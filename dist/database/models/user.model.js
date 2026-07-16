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
exports.User = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const profile_model_1 = require("./profile.model");
const user_profile_model_1 = require("./user_profile.model");
const cause_model_1 = require("./cause.model");
const cause_user_model_1 = require("./cause_user.model");
const address_model_1 = require("./address.model");
const user_address_model_1 = require("./user_address.model");
let User = class User extends sequelize_typescript_1.Model {
    responsible;
    profiles;
    responsible_causes;
    addresses;
};
exports.User = User;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(150),
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: true,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: false,
        unique: true,
        comment: 'CPF/CNPJ',
    }),
    __metadata("design:type", String)
], User.prototype, "document", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(150),
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "phone1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
    }),
    __metadata("design:type", String)
], User.prototype, "phone2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "password_hash", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "is_active", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], User.prototype, "email_verified_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "avatar_url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        defaultValue: 'Brasileira',
    }),
    __metadata("design:type", String)
], User.prototype, "nationality", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(2),
        defaultValue: 'MG',
    }),
    __metadata("design:type", String)
], User.prototype, "birth_state", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", String)
], User.prototype, "profession", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
    }),
    __metadata("design:type", String)
], User.prototype, "birth_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", String)
], User.prototype, "mother_name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", String)
], User.prototype, "father_name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "rg", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "pis", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "ctps", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], User.prototype, "responsible_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User, 'responsible_id'),
    __metadata("design:type", User)
], User.prototype, "responsible", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: true,
        comment: 'Pai, Mãe, Tutor, Curador, etc.',
    }),
    __metadata("design:type", String)
], User.prototype, "responsible_relation", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "is_minor", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], User.prototype, "lgpd_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "lgpd_doc_path", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "print_lgpd_consent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "print_lgpd_minor_consent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "lgpd_minor_doc_path", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => profile_model_1.Profile, () => user_profile_model_1.UserProfile),
    __metadata("design:type", Array)
], User.prototype, "profiles", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => cause_model_1.Cause, () => cause_user_model_1.CauseUser),
    __metadata("design:type", Array)
], User.prototype, "responsible_causes", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => address_model_1.Address, () => user_address_model_1.UserAddress),
    __metadata("design:type", Array)
], User.prototype, "addresses", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    __metadata("design:type", Date)
], User.prototype, "deleted_at", void 0);
exports.User = User = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'users',
        paranoid: true,
        defaultScope: {
            attributes: { exclude: ['password_hash'] },
        },
    })
], User);
//# sourceMappingURL=user.model.js.map