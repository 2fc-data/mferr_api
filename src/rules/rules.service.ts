import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { Rule } from '../database/models/rule.model';

@Injectable()
export class RulesService {
  constructor(
    @InjectModel(Rule)
    private ruleModel: typeof Rule,
  ) {}

  create(createRuleDto: CreateRuleDto) {
    return this.ruleModel.create({ ...createRuleDto });
  }

  findAll() {
    return this.ruleModel.findAll({ order: [['name', 'ASC']] });
  }

  findOne(id: number) {
    return this.ruleModel.findByPk(id);
  }

  update(id: number, updateRuleDto: UpdateRuleDto) {
    return this.ruleModel.update(updateRuleDto, {
      where: { id },
    });
  }

  remove(id: number) {
    return this.ruleModel.destroy({
      where: { id },
    });
  }
}
