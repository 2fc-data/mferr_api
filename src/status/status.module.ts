import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { Status } from '../database/models/status.model';
import { Stage } from '../database/models/stage.model';
import { StatusTask } from '../database/models/status_task.model';

@Module({
  imports: [SequelizeModule.forFeature([Status, Stage, StatusTask])],
  controllers: [StatusController],
  providers: [StatusService],
})
export class StatusModule {}
