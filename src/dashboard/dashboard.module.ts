import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Cause } from '../database/models/cause.model';
import { CauseUser } from '../database/models/cause_user.model';
import { Court } from '../database/models/court.model';
import { CauseTask } from '../database/models/cause_task.model';
import { StatusTask } from '../database/models/status_task.model';
import { User } from '../database/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Cause, CauseUser, Court, CauseTask, StatusTask, User])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
