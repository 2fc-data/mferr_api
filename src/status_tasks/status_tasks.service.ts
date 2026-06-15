import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StatusTask } from '../database/models/status_task.model';
import { BaseService } from '../common/base.service';

@Injectable()
export class StatusTasksService extends BaseService<StatusTask> {
  constructor(
    @InjectModel(StatusTask)
    private statusTaskModel: typeof StatusTask,
  ) {
    super(statusTaskModel);
  }

  async findByStatus(statusId: number) {
    return this.statusTaskModel.findAll({
      where: { status_id: statusId },
      order: [['order_index', 'ASC']],
    });
  }
}
