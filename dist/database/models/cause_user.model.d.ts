import { Model } from 'sequelize-typescript';
import { Cause } from './cause.model';
import { User } from './user.model';
import { CauseRoleType } from './cause_role_type.model';
import { PartySide } from './party_side.model';
export declare class CauseUser extends Model {
    cause_id: number;
    user_id: number;
    role_type_id: number;
    role_type: CauseRoleType;
    party_side_id: number;
    party_side: PartySide;
    is_primary: boolean;
    cause: Cause;
    user: User;
}
