import { Model } from 'sequelize-typescript';
import { Status } from './status.model';
export declare class Stage extends Model {
    name: string;
    description: string;
    is_active: boolean;
    is_default: boolean;
    statuses: Status[];
}
