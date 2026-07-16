"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CauseUsersModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const cause_users_service_1 = require("./cause_users.service");
const cause_users_controller_1 = require("./cause_users.controller");
const cause_user_model_1 = require("../database/models/cause_user.model");
let CauseUsersModule = class CauseUsersModule {
};
exports.CauseUsersModule = CauseUsersModule;
exports.CauseUsersModule = CauseUsersModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([cause_user_model_1.CauseUser])],
        controllers: [cause_users_controller_1.CauseUsersController],
        providers: [cause_users_service_1.CauseUsersService],
    })
], CauseUsersModule);
//# sourceMappingURL=cause_users.module.js.map