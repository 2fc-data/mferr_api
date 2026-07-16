import { Model } from 'sequelize-typescript';
export declare class Court extends Model {
    name: string;
    description: string;
    state: string;
    is_federal: boolean;
    is_active: boolean;
}
