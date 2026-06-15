import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';
import { Rule } from '../database/models/rule.model';
import { ProfileRule } from '../database/models/profile_rule.model';

@Module({
  imports: [SequelizeModule.forFeature([Rule, ProfileRule])],
  controllers: [RulesController],
  providers: [RulesService],
})
export class RulesModule {}
