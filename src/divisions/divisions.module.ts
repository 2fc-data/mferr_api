import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DivisionsService } from './divisions.service';
import { DivisionsController } from './divisions.controller';
import { Division } from '../database/models/division.model';
import { Cause } from '../database/models/cause.model';

@Module({
  imports: [SequelizeModule.forFeature([Division, Cause])],
  controllers: [DivisionsController],
  providers: [DivisionsService],
})
export class DivisionsModule {}
