import { OutcomesService } from './outcomes.service';
import { CreateOutcomeDto } from './dto/create-outcome.dto';
import { UpdateOutcomeDto } from './dto/update-outcome.dto';
export declare class OutcomesController {
    private readonly outcomesService;
    constructor(outcomesService: OutcomesService);
    create(createOutcomeDto: CreateOutcomeDto): Promise<any>;
    findAll(): Promise<import("../database/models/outcome.model").Outcome[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateOutcomeDto: UpdateOutcomeDto): Promise<any>;
    remove(id: string): Promise<number>;
}
