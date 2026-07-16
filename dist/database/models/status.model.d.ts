import { Model } from 'sequelize-typescript';
import { Stage } from './stage.model';
import { StatusTask } from './status_task.model';
export declare class Status extends Model {
    name: string;
    description: string;
    is_active: boolean;
    is_default: boolean;
    stage_id: number;
    stage: Stage;
    tasks: StatusTask[];
}
