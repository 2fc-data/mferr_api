import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { Rule } from '../database/models/rule.model';
export declare class RulesService {
    private ruleModel;
    constructor(ruleModel: typeof Rule);
    create(createRuleDto: CreateRuleDto): Promise<Rule>;
    findAll(): Promise<Rule[]>;
    findOne(id: number): Promise<Rule | null>;
    update(id: number, updateRuleDto: UpdateRuleDto): Promise<[affectedCount: number]>;
    remove(id: number): Promise<number>;
}
