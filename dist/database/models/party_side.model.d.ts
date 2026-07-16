import { Model } from 'sequelize-typescript';
export declare class PartySide extends Model {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
}
