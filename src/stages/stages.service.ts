import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { Stage } from '../database/models/stage.model';

import { BaseService } from '../common/base.service';

@Injectable()
export class StagesService extends BaseService<Stage> {
  constructor(
    @InjectModel(Stage)
    private stageModel: typeof Stage,
  ) {
    super(stageModel);
  }

  findAll() {
    return super.findAll({
      include: [
        {
          association: 'statuses',
          include: [{ association: 'tasks' }],
        },
      ],
      order: [['name', 'ASC']],
    });
  }
}
