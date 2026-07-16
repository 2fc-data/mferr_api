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
exports.CauseTask = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const cause_model_1 = require("./cause.model");
const status_task_model_1 = require("./status_task.model");
const user_model_1 = require("./user.model");
let CauseTask = class CauseTask extends sequelize_typescript_1.Model {
    cause_id;
    status_task_id;
    is_completed;
    completed_at;
    completed_by;
    cause;
    status_task;
    completer;
};
exports.CauseTask = CauseTask;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => cause_model_1.Cause),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'cause_id',
    }),
    __metadata("design:type", Number)
], CauseTask.prototype, "cause_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => status_task_model_1.StatusTask),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'status_task_id',
    }),
    __metadata("design:type", Number)
], CauseTask.prototype, "status_task_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
        field: 'is_completed',
    }),
    __metadata("design:type", Boolean)
], CauseTask.prototype, "is_completed", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'completed_at',
    }),
    __metadata("design:type", Date)
], CauseTask.prototype, "completed_at", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'completed_by',
    }),
    __metadata("design:type", Number)
], CauseTask.prototype, "completed_by", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => cause_model_1.Cause),
    __metadata("design:type", cause_model_1.Cause)
], CauseTask.prototype, "cause", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => status_task_model_1.StatusTask),
    __metadata("design:type", status_task_model_1.StatusTask)
], CauseTask.prototype, "status_task", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], CauseTask.prototype, "completer", void 0);
exports.CauseTask = CauseTask = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'cause_tasks', paranoid: true })
], CauseTask);
//# sourceMappingURL=cause_task.model.js.map