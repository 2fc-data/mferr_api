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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CauseUsersService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const cause_user_model_1 = require("../database/models/cause_user.model");
let CauseUsersService = class CauseUsersService {
    causeUserModel;
    constructor(causeUserModel) {
        this.causeUserModel = causeUserModel;
    }
    create(createCauseUserDto) {
        return this.causeUserModel.create({ ...createCauseUserDto });
    }
    findAll() {
        return this.causeUserModel.findAll();
    }
    findOne(id) {
        return this.causeUserModel.findByPk(id);
    }
    update(id, updateCauseUserDto) {
        return this.causeUserModel.update(updateCauseUserDto, {
            where: { id },
        });
    }
    remove(id) {
        return this.causeUserModel.destroy({
            where: { id },
        });
    }
};
exports.CauseUsersService = CauseUsersService;
exports.CauseUsersService = CauseUsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(cause_user_model_1.CauseUser)),
    __metadata("design:paramtypes", [Object])
], CauseUsersService);
//# sourceMappingURL=cause_users.service.js.map