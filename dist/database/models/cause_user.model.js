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
exports.CauseUser = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const cause_model_1 = require("./cause.model");
const user_model_1 = require("./user.model");
const cause_role_type_model_1 = require("./cause_role_type.model");
const party_side_model_1 = require("./party_side.model");
let CauseUser = class CauseUser extends sequelize_typescript_1.Model {
    cause_id;
    user_id;
    role_type_id;
    role_type;
    party_side_id;
    party_side;
    is_primary;
    cause;
    user;
};
exports.CauseUser = CauseUser;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => cause_model_1.Cause),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], CauseUser.prototype, "cause_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], CauseUser.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => cause_role_type_model_1.CauseRoleType),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], CauseUser.prototype, "role_type_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => cause_role_type_model_1.CauseRoleType),
    __metadata("design:type", cause_role_type_model_1.CauseRoleType)
], CauseUser.prototype, "role_type", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => party_side_model_1.PartySide),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], CauseUser.prototype, "party_side_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => party_side_model_1.PartySide),
    __metadata("design:type", party_side_model_1.PartySide)
], CauseUser.prototype, "party_side", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
        comment: 'Indica se é o responsável principal',
    }),
    __metadata("design:type", Boolean)
], CauseUser.prototype, "is_primary", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => cause_model_1.Cause),
    __metadata("design:type", cause_model_1.Cause)
], CauseUser.prototype, "cause", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], CauseUser.prototype, "user", void 0);
exports.CauseUser = CauseUser = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'cause_users' })
], CauseUser);
//# sourceMappingURL=cause_user.model.js.map