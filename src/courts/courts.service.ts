import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { Court } from '../database/models/court.model';

@Injectable()
export class CourtsService {
  constructor(
    @InjectModel(Court)
    private courtModel: typeof Court,
  ) {}

  async create(createCourtDto: CreateCourtDto) {
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
      throw new BadRequestException('Este tribunal já está cadastrado.');
    }

    return this.courtModel.create({ ...createCourtDto });
  }

  findAll(state?: string) {
    const where: any = {};
    if (state) {
      const trfMapping: Record<string, string> = {
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

      where[Op.or] = [
        { state: state },
        {
          is_federal: true,
          name: { [Op.notLike]: 'TRF%' }, // Higher federal courts (STF, STJ, etc)
        },
      ];

      if (targetTrf) {
        where[Op.or].push({
          is_federal: true,
          name: { [Op.like]: `%${targetTrf}%` }, // Only the regional TRF
        });
      }
    }

    return this.courtModel.findAll({
      where,
      order: [['name', 'ASC']],
    });
  }

  findOne(id: number) {
    return this.courtModel.findByPk(id);
  }

  update(id: number, updateCourtDto: UpdateCourtDto) {
    return this.courtModel.update(updateCourtDto, {
      where: { id },
    });
  }

  async remove(id: number) {
    const court = await this.courtModel.findByPk(id);
    if (!court) {
      throw new NotFoundException('Tribunal não encontrado.');
    }

    // Since divisions are no longer linked to courts, we don't need to check for divisionCount
    return this.courtModel.destroy({ where: { id } });
  }
}
