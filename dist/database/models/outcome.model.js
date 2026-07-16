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
exports.Outcome = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const status_model_1 = require("./status.model");
let Outcome = class Outcome extends sequelize_typescript_1.Model {
    name;
    description;
    status_id;
    status;
    is_active;
    is_default;
};
exports.Outcome = Outcome;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Outcome.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], Outcome.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => status_model_1.Status),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Outcome.prototype, "status_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => status_model_1.Status),
    __metadata("design:type", status_model_1.Status)
], Outcome.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], Outcome.prototype, "is_active", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Outcome.prototype, "is_default", void 0);
exports.Outcome = Outcome = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'outcomes', paranoid: true })
], Outcome);
//# sourceMappingURL=outcome.model.js.map