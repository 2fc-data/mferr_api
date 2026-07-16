import { Model } from 'sequelize-typescript';
import { User } from './user.model';
export declare class Address extends Model {
    id: number;
    postcode: string;
    city: string;
    state: string;
    district: string;
    street: string;
    number: string;
    complement: string;
    users: User[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
