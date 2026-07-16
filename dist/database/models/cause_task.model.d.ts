import { Model } from 'sequelize-typescript';
import { Cause } from './cause.model';
import { StatusTask } from './status_task.model';
import { User } from './user.model';
export declare class CauseTask extends Model {
    cause_id: number;
    status_task_id: number;
    is_completed: boolean;
    completed_at: Date;
    completed_by: number;
    cause: Cause;
    status_task: StatusTask;
    completer: User;
}
