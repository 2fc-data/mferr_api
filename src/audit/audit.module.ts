import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuditLog } from '../database/models/audit_log.model';
import { User } from '../database/models/user.model';
import { Court } from '../database/models/court.model';
import { Area } from '../database/models/area.model';
import { Stage } from '../database/models/stage.model';
import { Status } from '../database/models/status.model';
import { Outcome } from '../database/models/outcome.model';
import { City } from '../database/models/city.model';
import { Division } from '../database/models/division.model';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AuditLog,
      User,
      Court,
      Area,
      Stage,
      Status,
      Outcome,
      City,
      Division,
    ]),
  ],
  providers: [AuditService],
  controllers: [AuditController],
  exports: [AuditService],
})
export class AuditModule {}
