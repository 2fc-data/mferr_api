import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CourtsService } from './courts.service';
import { CourtsController } from './courts.controller';
import { Court } from '../database/models/court.model';

@Module({
  imports: [SequelizeModule.forFeature([Court])],
  controllers: [CourtsController],
  providers: [CourtsService],
})
export class CourtsModule {}
