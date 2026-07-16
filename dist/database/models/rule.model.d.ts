import { Model } from 'sequelize-typescript';
export declare class Rule extends Model {
    name: string;
    description: string;
    is_active: boolean;
}
