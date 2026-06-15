import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { City } from '../database/models/city.model';
import { Cause } from '../database/models/cause.model';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

import { BaseService } from '../common/base.service';

@Injectable()
export class CityService extends BaseService<City> {
  constructor(
    @InjectModel(City)
    private cityModel: typeof City,
    @InjectModel(Cause)
    private causeModel: typeof Cause,
  ) {
    super(cityModel);
  }

  findAll() {
    return super.findAll({ order: [['name', 'ASC']] });
  }

  async create(dto: CreateCityDto): Promise<City> {
    try {
      // Check if city already exists (even if soft-deleted)
      const existing = await this.cityModel.findOne({
        where: { name: dto.name },
        paranoid: false,
      });

      if (existing) {
        if (existing.deletedAt) {
          // Restore the soft-deleted city and update its info
          await existing.restore();
          await existing.update(dto);
          return existing;
        } else {
          // City already exists and is active
          throw new BadRequestException('Esta cidade já está cadastrada.');
        }
      }

      return await super.create(dto);
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Esta cidade já está cadastrada.');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<number> {
    const city = await this.cityModel.findByPk(id);
    if (!city) {
      throw new BadRequestException('Cidade não encontrada.');
    }

    const causeCount = await this.causeModel.count({
      where: { city_id: id },
    });

    if (causeCount > 0) {
      throw new BadRequestException(
        `Não é possível excluir esta cidade. Existem ${causeCount} causa(s) vinculada(s). Remova as causas primeiro.`,
      );
    }

    return super.remove(id);
  }
}
