"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const logger_service_1 = require("./logger/logger.service");
const health_service_1 = require("./health/health.service");
const cache_service_1 = require("./cache/cache.service");
const permission_helper_1 = require("./helpers/permission.helper");
const user_model_1 = require("../database/models/user.model");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([user_model_1.User])],
        providers: [logger_service_1.AppLogger, health_service_1.HealthService, cache_service_1.CacheService, permission_helper_1.PermissionHelper],
        exports: [logger_service_1.AppLogger, health_service_1.HealthService, cache_service_1.CacheService, permission_helper_1.PermissionHelper],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map