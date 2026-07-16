"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const user_model_1 = require("../database/models/user.model");
const profile_model_1 = require("../database/models/profile.model");
const address_model_1 = require("../database/models/address.model");
const user_address_model_1 = require("../database/models/user_address.model");
const audit_module_1 = require("../audit/audit.module");
const permission_helper_1 = require("../common/helpers/permission.helper");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([user_model_1.User, profile_model_1.Profile, address_model_1.Address, user_address_model_1.UserAddress]),
            audit_module_1.AuditModule,
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService, permission_helper_1.PermissionHelper],
        exports: [users_service_1.UsersService, permission_helper_1.PermissionHelper],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map