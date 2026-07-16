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
exports.CourtsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const court_model_1 = require("../database/models/court.model");
let CourtsService = class CourtsService {
    courtModel;
    constructor(courtModel) {
        this.courtModel = courtModel;
    }
    async create(createCourtDto) {
        const existing = await this.courtModel.findOne({
            where: {
                name: createCourtDto.name,
            },
            paranoid: false,
        });
        if (existing) {
            if (existing.deletedAt) {
                await existing.restore();
                await existing.update(createCourtDto);
                return existing;
            }
            throw new common_1.BadRequestException('Este tribunal já está cadastrado.');
        }
        return this.courtModel.create({ ...createCourtDto });
    }
    findAll(state) {
        const where = {};
        if (state) {
            const trfMapping = {
                AC: 'TRF1', AM: 'TRF1', AP: 'TRF1', BA: 'TRF1', DF: 'TRF1',
                GO: 'TRF1', MA: 'TRF1', MT: 'TRF1', PA: 'TRF1', PI: 'TRF1',
                RO: 'TRF1', RR: 'TRF1', TO: 'TRF1',
                RJ: 'TRF2', ES: 'TRF2',
                SP: 'TRF3', MS: 'TRF3',
                PR: 'TRF4', SC: 'TRF4', RS: 'TRF4',
                AL: 'TRF5', CE: 'TRF5', PB: 'TRF5', PE: 'TRF5', RN: 'TRF5', SE: 'TRF5',
                MG: 'TRF6',
            };
            const targetTrf = trfMapping[state.toUpperCase()];
            where[sequelize_2.Op.or] = [
                { state: state },
                {
                    is_federal: true,
                    name: { [sequelize_2.Op.notLike]: 'TRF%' },
                },
            ];
            if (targetTrf) {
                where[sequelize_2.Op.or].push({
                    is_federal: true,
                    name: { [sequelize_2.Op.like]: `%${targetTrf}%` },
                });
            }
        }
        return this.courtModel.findAll({
            where,
            order: [['name', 'ASC']],
        });
    }
    findOne(id) {
        return this.courtModel.findByPk(id);
    }
    update(id, updateCourtDto) {
        return this.courtModel.update(updateCourtDto, {
            where: { id },
        });
    }
    async remove(id) {
        const court = await this.courtModel.findByPk(id);
        if (!court) {
            throw new common_1.NotFoundException('Tribunal não encontrado.');
        }
        return this.courtModel.destroy({ where: { id } });
    }
};
exports.CourtsService = CourtsService;
exports.CourtsService = CourtsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(court_model_1.Court)),
    __metadata("design:paramtypes", [Object])
], CourtsService);
//# sourceMappingURL=courts.service.js.map