import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StagesService } from './stages.service';
import { StagesController } from './stages.controller';
import { Status } from '../database/models/status.model';
import { Stage } from '../database/models/stage.model';
import { StatusTask } from '../database/models/status_task.model';

@Module({
  imports: [SequelizeModule.forFeature([Status, Stage, StatusTask])],
  controllers: [StagesController],
  providers: [StagesService],
})
export class StagesModule {}
