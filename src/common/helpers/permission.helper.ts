import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../database/models/user.model';
import { Profile } from '../../database/models/profile.model';
import { PROFILE_IDS } from '../constants/audit.constants';

@Injectable()
export class PermissionHelper {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async getUserProfiles(userId: number): Promise<Profile[]> {
    const user = await this.userModel.findByPk(userId, {
      include: [{ model: Profile, as: 'profiles' }],
    });
    return user?.profiles || [];
  }

  async isAdmin(userId: number): Promise<boolean> {
    const profiles = await this.getUserProfiles(userId);
    return profiles.some((p) => p.id === PROFILE_IDS.ADMIN);
  }

  async isManager(userId: number): Promise<boolean> {
    const profiles = await this.getUserProfiles(userId);
    return profiles.some((p) => p.id === PROFILE_IDS.MANAGER);
  }

  async checkCanAssignProfiles(
    currentUserId: number,
    requestedProfileIds?: number[],
  ): Promise<boolean> {
    if (!requestedProfileIds || requestedProfileIds.length === 0) return true;

    const isAdmin = await this.isAdmin(currentUserId);
    if (isAdmin) return true;

    const isManager = await this.isManager(currentUserId);
    if (isManager) {
      const hasUnauthorized = requestedProfileIds.some(
        (id) => id !== PROFILE_IDS.CLIENT && id !== PROFILE_IDS.COLLABORATOR,
      );
      if (hasUnauthorized) {
        throw new ForbiddenException(
          'Gerentes só podem criar ou atribuir os perfis de Cliente e Colaborador.',
        );
      }
    }

    return true;
  }

  async checkCanEditUser(
    currentUserId: number,
    targetUserId: number,
    requestedProfileIds?: number[],
  ): Promise<boolean> {
    const isAdmin = await this.isAdmin(currentUserId);
    if (isAdmin) return true;

    const isManager = await this.isManager(currentUserId);
    if (isManager) {
      if (requestedProfileIds) {
        const hasUnauthorized = requestedProfileIds.some(
          (id) => id !== PROFILE_IDS.CLIENT && id !== PROFILE_IDS.COLLABORATOR,
        );
        if (hasUnauthorized) {
          throw new ForbiddenException(
            'Gerentes só podem atribuir os perfis de Cliente e Colaborador.',
          );
        }
      }

      const targetProfiles = await this.getUserProfiles(targetUserId);
      const targetIsAdminOrManager = targetProfiles.some(
        (p) => p.id === PROFILE_IDS.ADMIN || p.id === PROFILE_IDS.MANAGER,
      );
      if (targetIsAdminOrManager) {
        throw new ForbiddenException(
          'Gerentes não podem modificar Administradores ou outros Gerentes.',
        );
      }
    }

    return true;
  }

  async checkCanDeleteUser(
    currentUserId: number,
    targetUserId: number,
  ): Promise<boolean> {
    const isAdmin = await this.isAdmin(currentUserId);
    if (isAdmin) return true;

    const isManager = await this.isManager(currentUserId);
    if (isManager) {
      const targetProfiles = await this.getUserProfiles(targetUserId);
      const targetIsAdminOrManager = targetProfiles.some(
        (p) => p.id === PROFILE_IDS.ADMIN || p.id === PROFILE_IDS.MANAGER,
      );
      if (targetIsAdminOrManager) {
        throw new ForbiddenException(
          'Gerentes não podem excluir Administradores ou outros Gerentes.',
        );
      }
    }

    return true;
  }

  canAccessAllCauses(user: any): boolean {
    return (
      user?.rules?.includes('admin') || user?.rules?.includes('settings.manage')
    );
  }
}
