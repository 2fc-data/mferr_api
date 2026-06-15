import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { City } from '../database/models/city.model';
import { Cause } from '../database/models/cause.model';

@Module({
  imports: [SequelizeModule.forFeature([City, Cause])],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}
