import { Model } from 'sequelize-typescript';
import { User } from './user.model';
import { Rule } from './rule.model';
export declare class Profile extends Model {
    name: string;
    description: string;
    is_active: boolean;
    users: User[];
    rules: Rule[];
}
