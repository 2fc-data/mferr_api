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
exports.ProfileRule = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const profile_model_1 = require("./profile.model");
const rule_model_1 = require("./rule.model");
let ProfileRule = class ProfileRule extends sequelize_typescript_1.Model {
    profile_id;
    rule_id;
};
exports.ProfileRule = ProfileRule;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => profile_model_1.Profile),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], ProfileRule.prototype, "profile_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => rule_model_1.Rule),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], ProfileRule.prototype, "rule_id", void 0);
exports.ProfileRule = ProfileRule = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'profile_rules', paranoid: false })
], ProfileRule);
//# sourceMappingURL=profile_rule.model.js.map