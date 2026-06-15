import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { Area } from '../database/models/area.model';

@Module({
  imports: [SequelizeModule.forFeature([Area])],
  controllers: [AreasController],
  providers: [AreasService],
})
export class AreasModule {}
