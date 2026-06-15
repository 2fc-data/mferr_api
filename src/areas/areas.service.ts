import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from '../database/models/area.model';

import { BaseService } from '../common/base.service';

@Injectable()
export class AreasService extends BaseService<Area> {
  constructor(
    @InjectModel(Area)
    private areaModel: typeof Area,
  ) {
    super(areaModel);
  }

  findAll() {
    return super.findAll({ order: [['name', 'ASC']] });
  }
}
