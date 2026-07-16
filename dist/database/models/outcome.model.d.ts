import { Model } from 'sequelize-typescript';
import { Status } from './status.model';
export declare class Outcome extends Model {
    name: string;
    description: string;
    status_id: number;
    status: Status;
    is_active: boolean;
    is_default: boolean;
}
