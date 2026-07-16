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
exports.DivisionsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const division_model_1 = require("../database/models/division.model");
const cause_model_1 = require("../database/models/cause.model");
let DivisionsService = class DivisionsService {
    divisionModel;
    causeModel;
    constructor(divisionModel, causeModel) {
        this.divisionModel = divisionModel;
        this.causeModel = causeModel;
    }
    async create(createDivisionDto) {
        const existing = await this.divisionModel.findOne({
            where: {
                name: createDivisionDto.name,
            },
            paranoid: false,
        });
        if (existing) {
            if (existing.deletedAt) {
                await existing.restore();
                await existing.update(createDivisionDto);
                return existing;
            }
            throw new common_1.BadRequestException('Esta vara/divisão já está cadastrada.');
        }
        return this.divisionModel.create({ ...createDivisionDto });
    }
    findAll() {
        return this.divisionModel.findAll({
            order: [['name', 'ASC']],
        });
    }
    findOne(id) {
        return this.divisionModel.findByPk(id);
    }
    update(id, updateDivisionDto) {
        return this.divisionModel.update(updateDivisionDto, {
            where: { id },
        });
    }
    async remove(id) {
        const division = await this.divisionModel.findByPk(id);
        if (!division) {
            throw new common_1.NotFoundException('Vara/Divisão não encontrada.');
        }
        const causeCount = await this.causeModel.count({
            where: { division_id: id },
        });
        if (causeCount > 0) {
            throw new common_1.BadRequestException(`Não é possível excluir esta vara. Existem ${causeCount} causa(s) vinculada(s). Remova as causas primeiro.`);
        }
        return this.divisionModel.destroy({ where: { id } });
    }
};
exports.DivisionsService = DivisionsService;
exports.DivisionsService = DivisionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(division_model_1.Division)),
    __param(1, (0, sequelize_1.InjectModel)(cause_model_1.Cause)),
    __metadata("design:paramtypes", [Object, Object])
], DivisionsService);
//# sourceMappingURL=divisions.service.js.map