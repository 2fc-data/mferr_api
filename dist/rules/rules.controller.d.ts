import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
export declare class RulesController {
    private readonly rulesService;
    constructor(rulesService: RulesService);
    create(createRuleDto: CreateRuleDto): Promise<import("../database/models/rule.model").Rule>;
    findAll(): Promise<import("../database/models/rule.model").Rule[]>;
    findOne(id: string): Promise<import("../database/models/rule.model").Rule | null>;
    update(id: string, updateRuleDto: UpdateRuleDto): Promise<[affectedCount: number]>;
    remove(id: string): Promise<number>;
}
