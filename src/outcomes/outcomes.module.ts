import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OutcomesService } from './outcomes.service';
import { OutcomesController } from './outcomes.controller';
import { Outcome } from '../database/models/outcome.model';

@Module({
  imports: [SequelizeModule.forFeature([Outcome])],
  controllers: [OutcomesController],
  providers: [OutcomesService],
})
export class OutcomesModule {}
