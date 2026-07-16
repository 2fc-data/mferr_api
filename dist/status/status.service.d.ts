import { Status } from '../database/models/status.model';
import { BaseService } from '../common/base.service';
export declare class StatusService extends BaseService<Status> {
    private statusModel;
    constructor(statusModel: typeof Status);
    findAll(): Promise<Status[]>;
}
