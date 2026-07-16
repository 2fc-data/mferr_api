import { Model } from 'sequelize-typescript';
import { Status } from './status.model';
import { CauseTask } from './cause_task.model';
export declare class StatusTask extends Model {
    id: number;
    status_id: number;
    description: string;
    is_required: boolean;
    order_index: number;
    status: Status;
    cause_tasks: CauseTask[];
}
