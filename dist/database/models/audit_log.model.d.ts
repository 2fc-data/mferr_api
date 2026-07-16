import { Model } from 'sequelize-typescript';
import { User } from './user.model';
export declare class AuditLog extends Model {
    id: number;
    entity_type: string;
    entity_id: number;
    action: string;
    changes: any;
    user_id: number;
    user: User;
    created_at: Date;
}
