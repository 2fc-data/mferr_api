import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CausesService } from './causes.service';
import { CausesController } from './causes.controller';
import { Cause } from '../database/models/cause.model';
import { CauseUser } from '../database/models/cause_user.model';
import { AuditModule } from '../audit/audit.module';
import { CommonModule } from '../common/common.module';
import { Court } from '../database/models/court.model';
import { Area } from '../database/models/area.model';
import { Stage } from '../database/models/stage.model';
import { Status } from '../database/models/status.model';
import { Outcome } from '../database/models/outcome.model';
import { Division } from '../database/models/division.model';
import { City } from '../database/models/city.model';
import { User } from '../database/models/user.model';
import { StatusTask } from '../database/models/status_task.model';
import { CauseTask } from '../database/models/cause_task.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Cause,
      CauseUser,
      Court,
      Area,
      Stage,
      Status,
      Outcome,
      Division,
      City,
      User,
      StatusTask,
      CauseTask,
    ]),
    AuditModule,
    CommonModule,
  ],
  controllers: [CausesController],
  providers: [CausesService],
})
export class CausesModule {}
