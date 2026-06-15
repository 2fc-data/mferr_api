import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { Division } from '../database/models/division.model';
import { Cause } from '../database/models/cause.model';

@Injectable()
export class DivisionsService {
  constructor(
    @InjectModel(Division)
    private divisionModel: typeof Division,
    @InjectModel(Cause)
    private causeModel: typeof Cause,
  ) {}

  async create(createDivisionDto: CreateDivisionDto) {
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
      throw new BadRequestException('Esta vara/divisão já está cadastrada.');
    }

    return this.divisionModel.create({ ...createDivisionDto });
  }

  findAll() {
    return this.divisionModel.findAll({
      order: [['name', 'ASC']],
    });
  }

  findOne(id: number) {
    return this.divisionModel.findByPk(id);
  }

  update(id: number, updateDivisionDto: UpdateDivisionDto) {
    return this.divisionModel.update(updateDivisionDto, {
      where: { id },
    });
  }

  async remove(id: number) {
    const division = await this.divisionModel.findByPk(id);
    if (!division) {
      throw new NotFoundException('Vara/Divisão não encontrada.');
    }

    const causeCount = await this.causeModel.count({
      where: { division_id: id },
    });

    if (causeCount > 0) {
      throw new BadRequestException(
        `Não é possível excluir esta vara. Existem ${causeCount} causa(s) vinculada(s). Remova as causas primeiro.`,
      );
    }

    return this.divisionModel.destroy({ where: { id } });
  }
}
