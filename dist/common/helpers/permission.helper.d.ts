import { User } from '../../database/models/user.model';
import { Profile } from '../../database/models/profile.model';
export declare class PermissionHelper {
    private userModel;
    constructor(userModel: typeof User);
    getUserProfiles(userId: number): Promise<Profile[]>;
    isAdmin(userId: number): Promise<boolean>;
    isManager(userId: number): Promise<boolean>;
    checkCanAssignProfiles(currentUserId: number, requestedProfileIds?: number[]): Promise<boolean>;
    checkCanEditUser(currentUserId: number, targetUserId: number, requestedProfileIds?: number[]): Promise<boolean>;
    checkCanDeleteUser(currentUserId: number, targetUserId: number): Promise<boolean>;
    canAccessAllCauses(user: any): boolean;
}
