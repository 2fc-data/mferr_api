"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionsModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const divisions_service_1 = require("./divisions.service");
const divisions_controller_1 = require("./divisions.controller");
const division_model_1 = require("../database/models/division.model");
const cause_model_1 = require("../database/models/cause.model");
let DivisionsModule = class DivisionsModule {
};
exports.DivisionsModule = DivisionsModule;
exports.DivisionsModule = DivisionsModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([division_model_1.Division, cause_model_1.Cause])],
        controllers: [divisions_controller_1.DivisionsController],
        providers: [divisions_service_1.DivisionsService],
    })
], DivisionsModule);
//# sourceMappingURL=divisions.module.js.map