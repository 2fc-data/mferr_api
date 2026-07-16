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
exports.Cause = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const court_model_1 = require("./court.model");
const division_model_1 = require("./division.model");
const area_model_1 = require("./area.model");
const stage_model_1 = require("./stage.model");
const status_model_1 = require("./status.model");
const outcome_model_1 = require("./outcome.model");
const city_model_1 = require("./city.model");
const cause_user_model_1 = require("./cause_user.model");
const cause_task_model_1 = require("./cause_task.model");
const user_model_1 = require("./user.model");
let Cause = class Cause extends sequelize_typescript_1.Model {
    court;
    division;
    area;
    current_stage;
    current_status;
    outcome;
    city;
    cause_users;
    cause_tasks;
    collaborators;
};
exports.Cause = Cause;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Número do processo',
    }),
    __metadata("design:type", String)
], Cause.prototype, "number", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], Cause.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => court_model_1.Court),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'court_id',
    }),
    __metadata("design:type", Number)
], Cause.prototype, "court_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => division_model_1.Division),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        field: 'division_id',
    }),
    __metadata("design:type", Number)
], Cause.prototype, "division_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => city_model_1.City),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        field: 'city_id',
    }),
    __metadata("design:type", Number)
], Cause.prototype, "city_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => area_model_1.Area),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        field: 'area_id',
    }),
    __metadata("design:type", Number)
], Cause.prototype, "area_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => stage_model_1.Stage),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        field: 'current_stage_id',
    }),
    __metadata("design:type", Number)
], Cause.prototype, "current_stage_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => status_model_1.Status),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        field: 'current_status_id',
    }),
    __metadata("design:type", Number)
], Cause.prototype, "current_status_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => outcome_model_1.Outcome),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        field: 'outcome_id',
    }),
    __metadata("design:type", Number)
], Cause.prototype, "outcome_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], Cause.prototype, "total_value", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
        defaultValue: 0.0,
        comment: 'Honorários totais',
    }),
    __metadata("design:type", Number)
], Cause.prototype, "total_fees", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
        defaultValue: 0.0,
        comment: 'Valor do cliente',
    }),
    __metadata("design:type", Number)
], Cause.prototype, "customer_amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
        defaultValue: 20.0,
        comment: 'Porcentagem de honorários',
    }),
    __metadata("design:type", Number)
], Cause.prototype, "percentage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Data do processo',
    }),
    __metadata("design:type", String)
], Cause.prototype, "process_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], Cause.prototype, "is_active", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        comment: 'Data de encerramento do processo',
    }),
    __metadata("design:type", Date)
], Cause.prototype, "closed_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Cause.prototype, "print_contract", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
    }),
    __metadata("design:type", String)
], Cause.prototype, "contract_doc_path", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => court_model_1.Court),
    __metadata("design:type", court_model_1.Court)
], Cause.prototype, "court", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => division_model_1.Division),
    __metadata("design:type", division_model_1.Division)
], Cause.prototype, "division", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => area_model_1.Area),
    __metadata("design:type", area_model_1.Area)
], Cause.prototype, "area", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => stage_model_1.Stage),
    __metadata("design:type", stage_model_1.Stage)
], Cause.prototype, "current_stage", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => status_model_1.Status),
    __metadata("design:type", status_model_1.Status)
], Cause.prototype, "current_status", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => outcome_model_1.Outcome),
    __metadata("design:type", outcome_model_1.Outcome)
], Cause.prototype, "outcome", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => city_model_1.City),
    __metadata("design:type", city_model_1.City)
], Cause.prototype, "city", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => cause_user_model_1.CauseUser),
    __metadata("design:type", Array)
], Cause.prototype, "cause_users", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => cause_task_model_1.CauseTask),
    __metadata("design:type", Array)
], Cause.prototype, "cause_tasks", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => user_model_1.User, () => cause_user_model_1.CauseUser),
    __metadata("design:type", Array)
], Cause.prototype, "collaborators", void 0);
exports.Cause = Cause = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'causes', paranoid: true })
], Cause);
//# sourceMappingURL=cause.model.js.map