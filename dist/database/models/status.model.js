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
exports.Status = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const stage_model_1 = require("./stage.model");
const status_task_model_1 = require("./status_task.model");
let Status = class Status extends sequelize_typescript_1.Model {
    name;
    description;
    is_active;
    is_default;
    stage_id;
    stage;
    tasks;
};
exports.Status = Status;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Status.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], Status.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], Status.prototype, "is_active", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Status.prototype, "is_default", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => stage_model_1.Stage),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Status.prototype, "stage_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => stage_model_1.Stage),
    __metadata("design:type", stage_model_1.Stage)
], Status.prototype, "stage", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => status_task_model_1.StatusTask),
    __metadata("design:type", Array)
], Status.prototype, "tasks", void 0);
exports.Status = Status = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'status', paranoid: true })
], Status);
//# sourceMappingURL=status.model.js.map