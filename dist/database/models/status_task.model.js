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
exports.StatusTask = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const status_model_1 = require("./status.model");
const cause_task_model_1 = require("./cause_task.model");
let StatusTask = class StatusTask extends sequelize_typescript_1.Model {
    status_id;
    description;
    is_required;
    order_index;
    status;
    cause_tasks;
};
exports.StatusTask = StatusTask;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], StatusTask.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => status_model_1.Status),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'status_id',
    }),
    __metadata("design:type", Number)
], StatusTask.prototype, "status_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], StatusTask.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
        field: 'is_required',
    }),
    __metadata("design:type", Boolean)
], StatusTask.prototype, "is_required", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
        field: 'order_index',
    }),
    __metadata("design:type", Number)
], StatusTask.prototype, "order_index", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => status_model_1.Status),
    __metadata("design:type", status_model_1.Status)
], StatusTask.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => cause_task_model_1.CauseTask),
    __metadata("design:type", Array)
], StatusTask.prototype, "cause_tasks", void 0);
exports.StatusTask = StatusTask = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'status_tasks', paranoid: true })
], StatusTask);
//# sourceMappingURL=status_task.model.js.map