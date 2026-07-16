import { Stage } from '../database/models/stage.model';
import { BaseService } from '../common/base.service';
export declare class StagesService extends BaseService<Stage> {
    private stageModel;
    constructor(stageModel: typeof Stage);
    findAll(): Promise<Stage[]>;
}
