import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status } from '../database/models/status.model';
import { Stage } from '../database/models/stage.model';

import { BaseService } from '../common/base.service';

@Injectable()
export class StatusService extends BaseService<Status> {
  constructor(
    @InjectModel(Status)
    private statusModel: typeof Status,
  ) {
    super(statusModel);
  }

  findAll() {
    return super.findAll({
      include: [
        { association: 'stage', attributes: ['id', 'name'] },
        { association: 'tasks' },
      ],
      order: [['name', 'ASC']],
    });
  }
}
