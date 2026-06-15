import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOutcomeDto } from './dto/create-outcome.dto';
import { UpdateOutcomeDto } from './dto/update-outcome.dto';
import { Outcome } from '../database/models/outcome.model';
import { Status } from '../database/models/status.model';

import { BaseService } from '../common/base.service';

@Injectable()
export class OutcomesService extends BaseService<Outcome> {
  constructor(
    @InjectModel(Outcome)
    private outcomeModel: typeof Outcome,
  ) {
    super(outcomeModel);
  }

  findAll() {
    return super.findAll({ 
      order: [['name', 'ASC']],
      include: [{ model: Status, attributes: ['id', 'name'] }]
    });
  }

  findOne(id: number) {
    return super.findOne(id, {
      include: [{ model: Status, attributes: ['id', 'name'] }]
    });
  }
}
