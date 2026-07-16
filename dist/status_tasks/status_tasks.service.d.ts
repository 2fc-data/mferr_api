import { StatusTask } from '../database/models/status_task.model';
import { BaseService } from '../common/base.service';
export declare class StatusTasksService extends BaseService<StatusTask> {
    private statusTaskModel;
    constructor(statusTaskModel: typeof StatusTask);
    findByStatus(statusId: number): Promise<StatusTask[]>;
}
