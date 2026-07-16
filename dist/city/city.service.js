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
exports.CityService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const city_model_1 = require("../database/models/city.model");
const cause_model_1 = require("../database/models/cause.model");
const base_service_1 = require("../common/base.service");
let CityService = class CityService extends base_service_1.BaseService {
    cityModel;
    causeModel;
    constructor(cityModel, causeModel) {
        super(cityModel);
        this.cityModel = cityModel;
        this.causeModel = causeModel;
    }
    findAll() {
        return super.findAll({ order: [['name', 'ASC']] });
    }
    async create(dto) {
        try {
            const existing = await this.cityModel.findOne({
                where: { name: dto.name },
                paranoid: false,
            });
            if (existing) {
                if (existing.deletedAt) {
                    await existing.restore();
                    await existing.update(dto);
                    return existing;
                }
                else {
                    throw new common_1.BadRequestException('Esta cidade já está cadastrada.');
                }
            }
            return await super.create(dto);
        }
        catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new common_1.BadRequestException('Esta cidade já está cadastrada.');
            }
            throw error;
        }
    }
    async remove(id) {
        const city = await this.cityModel.findByPk(id);
        if (!city) {
            throw new common_1.BadRequestException('Cidade não encontrada.');
        }
        const causeCount = await this.causeModel.count({
            where: { city_id: id },
        });
        if (causeCount > 0) {
            throw new common_1.BadRequestException(`Não é possível excluir esta cidade. Existem ${causeCount} causa(s) vinculada(s). Remova as causas primeiro.`);
        }
        return super.remove(id);
    }
};
exports.CityService = CityService;
exports.CityService = CityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(city_model_1.City)),
    __param(1, (0, sequelize_1.InjectModel)(cause_model_1.Cause)),
    __metadata("design:paramtypes", [Object, Object])
], CityService);
//# sourceMappingURL=city.service.js.map