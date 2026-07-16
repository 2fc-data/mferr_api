import { Model } from 'sequelize-typescript';
import { User } from './user.model';
export declare class PasswordResetToken extends Model {
    id: number;
    userId: number;
    user: User;
    token: string;
    expiresAt: Date;
    used: boolean;
}
