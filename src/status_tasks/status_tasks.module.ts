import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StatusTasksService } from './status_tasks.service';
import { StatusTasksController } from './status_tasks.controller';
import { StatusTask } from '../database/models/status_task.model';

@Module({
  imports: [SequelizeModule.forFeature([StatusTask])],
  controllers: [StatusTasksController],
  providers: [StatusTasksService],
  exports: [StatusTasksService],
})
export class StatusTasksModule {}
