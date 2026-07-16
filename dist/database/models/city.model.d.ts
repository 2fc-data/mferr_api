import { Model } from 'sequelize-typescript';
import { Cause } from './cause.model';
export declare class City extends Model {
    name: string;
    uf: string;
    causes: Cause[];
}
