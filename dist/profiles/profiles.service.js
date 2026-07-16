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
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const profile_model_1 = require("../database/models/profile.model");
const rule_model_1 = require("../database/models/rule.model");
let ProfilesService = class ProfilesService {
    profileModel;
    constructor(profileModel) {
        this.profileModel = profileModel;
    }
    async create(createProfileDto) {
        const { rule_ids, ...profileData } = createProfileDto;
        const profile = await this.profileModel.create({ ...profileData });
        if (rule_ids && rule_ids.length > 0) {
            await profile.$set('rules', rule_ids);
        }
        return profile;
    }
    findAll() {
        return this.profileModel.findAll({
            include: [{ model: rule_model_1.Rule, as: 'rules' }],
            order: [['name', 'ASC']],
        });
    }
    findOne(id) {
        return this.profileModel.findByPk(id, {
            include: [{ model: rule_model_1.Rule, as: 'rules' }],
        });
    }
    async update(id, updateProfileDto) {
        const { rule_ids, ...profileData } = updateProfileDto;
        await this.profileModel.update(profileData, {
            where: { id },
        });
        const profile = await this.profileModel.findByPk(id);
        if (profile && rule_ids) {
            await profile.$set('rules', rule_ids);
        }
        return this.findOne(id);
    }
    remove(id) {
        return this.profileModel.destroy({
            where: { id },
        });
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(profile_model_1.Profile)),
    __metadata("design:paramtypes", [Object])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map