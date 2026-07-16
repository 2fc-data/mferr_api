import { Outcome } from '../database/models/outcome.model';
import { BaseService } from '../common/base.service';
export declare class OutcomesService extends BaseService<Outcome> {
    private outcomeModel;
    constructor(outcomeModel: typeof Outcome);
    findAll(): Promise<Outcome[]>;
    findOne(id: number): Promise<any>;
}
