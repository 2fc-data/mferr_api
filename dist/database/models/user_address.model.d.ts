import { Model } from 'sequelize-typescript';
import { AddressType } from './address_type.model';
export declare class UserAddress extends Model {
    id: number;
    user_id: number;
    address_id: number;
    address_type_id: number;
    address_type: AddressType;
    is_primary: boolean;
    created_at: Date;
    updated_at: Date;
}
