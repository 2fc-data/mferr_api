import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../database/models/user.model';
import { Profile } from '../database/models/profile.model';
import { Rule } from '../database/models/rule.model';
import { Address } from '../database/models/address.model';
import { UserAddress } from '../database/models/user_address.model';
import { AuditService } from '../audit/audit.service';
import { AppLogger } from '../common/logger/logger.service';
import { PermissionHelper } from '../common/helpers/permission.helper';
import { BaseService } from '../common/base.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Address)
    private addressModel: typeof Address,
    @InjectModel(UserAddress)
    private userAddressModel: typeof UserAddress,
    private auditService: AuditService,
    private logger: AppLogger,
    private permissionHelper: PermissionHelper,
  ) {
    super(userModel);
  }

  private async handleUniqueConstraintError(e: any) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      const field = e.errors?.[0]?.path || Object.keys(e.fields || {})[0] || 'campo';
      const value = e.errors?.[0]?.value || e.fields?.[field];

      const fieldLabels: Record<string, string> = {
        document: 'Documento (CPF/CNPJ)',
        email: 'E-mail',
        username: 'Nome de Usuário (Login)',
        phone1: 'Telefone 1',
        rg: 'RG',
        pis: 'PIS/PASEP',
        ctps: 'CTPS',
      };
      const label = fieldLabels[field] || field;

      try {
        // Check if a deleted record exists with this value
        // Only for known columns to avoid crashing on index names
        const validFields = ['document', 'email', 'username', 'phone1', 'rg', 'pis', 'ctps'];
        if (validFields.includes(field)) {
          const deletedUser = await this.userModel.findOne({
            where: { [field]: value },
            paranoid: false,
          });

          if (deletedUser?.deleted_at) {
            throw new ConflictException(
              `Já existe um usuário cadastrado (porém excluído) com este ${label}. Entre em contato com o suporte para restaurá-lo se necessário.`,
            );
          }
        }
      } catch (innerError) {
        if (innerError instanceof ConflictException) throw innerError;
        this.logger.error(`Error checking for deleted user: ${innerError.message}`);
      }

      throw new ConflictException(
        `Já existe um usuário cadastrado com este ${label}.`,
      );
    }
    throw e;
  }

  private normalizeData(data: any) {
    const normalized = { ...data };
    if (normalized.document) {
      normalized.document = normalized.document.replace(/\D/g, '');
    }
    if (normalized.email) {
      normalized.email = normalized.email.toLowerCase().trim();
    }
    if (normalized.username === '') {
      normalized.username = null;
    } else if (normalized.username) {
      normalized.username = normalized.username.toLowerCase().trim();
    }
    if (normalized.rg) {
      normalized.rg = normalized.rg.replace(/[^\dXx]/g, '').toUpperCase();
    }
    if (normalized.phone1) {
      normalized.phone1 = normalized.phone1.replace(/\D/g, '');
    }
    if (normalized.pis) {
      normalized.pis = normalized.pis.replace(/\D/g, '');
    }
    if (normalized.ctps) {
      normalized.ctps = normalized.ctps.replace(/\D/g, '');
    }
    return normalized;
  }

  async create(createUserDto: CreateUserDto, currentUser?: any) {
    if (currentUser) {
      await this.permissionHelper.checkCanAssignProfiles(
        currentUser.id,
        createUserDto.profile_ids,
      );
    }

    const normalizedData = this.normalizeData(createUserDto);
    const { password, profile_ids, ...userData } = normalizedData;

    const finalPassword = password?.trim()
      ? password
      : Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(finalPassword, salt);

    try {
      const user = await this.userModel.create({
        ...userData,
        password_hash,
      });

      this.logger.log(`User created: ${user.id}`, 'UsersService');

      if (profile_ids && profile_ids.length > 0) {
        await user.$set('profiles', profile_ids);
      }

      return this.findOne(user.id as number);
    } catch (e) {
      await this.handleUniqueConstraintError(e);
    }
  }

  async findAll(currentUser?: any, includeDeleted = false) {
    if (currentUser) {
      const isManager = await this.permissionHelper.isManager(currentUser.id);
      const isAdmin = await this.permissionHelper.isAdmin(currentUser.id);

      if (isManager && !isAdmin) {
        return this.userModel.findAll({
          attributes: { exclude: ['password_hash'] },
          include: [
            {
              model: Profile,
              as: 'profiles',
              where: { id: [3, 4] },
              attributes: ['id', 'name'],
            },
          ],
          order: [['name', 'ASC']],
        });
      }

      // Only admins can see deleted users
      if (includeDeleted && isAdmin) {
        const users = await this.userModel.findAll({
          attributes: { exclude: ['password_hash'] },
          include: [{ model: Profile, as: 'profiles', attributes: ['id', 'name'] }],
          order: [['name', 'ASC']],
          paranoid: false,
        });

        return users.map((u) => {
          const plain = u.toJSON() as any;
          plain.deleted = !!plain.deleted_at;
          return plain;
        });
      }
    }

    return this.userModel.findAll({
      attributes: { exclude: ['password_hash'] },
      include: [{ model: Profile, as: 'profiles', attributes: ['id', 'name'] }],
      order: [['name', 'ASC']],
    });
  }

  async findCollaborators() {
    return this.userModel.findAll({
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Profile,
          as: 'profiles',
          where: { id: 3 },
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
      order: [['name', 'ASC']],
    });
  }

  async findClients() {
    return this.userModel.findAll({
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Profile,
          as: 'profiles',
          where: { id: 4 },
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
      order: [['name', 'ASC']],
    });
  }

  findOne(id: number) {
    return this.userModel.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Profile,
          as: 'profiles',
          attributes: ['id', 'name'],
          include: [{ model: Rule, as: 'rules' }],
        },
        {
          model: Address,
          as: 'addresses',
          through: { 
            attributes: ['address_type_id', 'is_primary'],
          },
          include: [{ model: User, as: 'users', attributes: ['id'], through: { attributes: [] } }]
        },
      ],
    });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const trimmed = username.trim();
    const lower = trimmed.toLowerCase();

    return this.userModel.findOne({
      attributes: { include: ['password_hash'] },
      where: {
        [Op.or]: [
          { username: trimmed },
          { username: lower },
          { email: trimmed },
          { email: lower },
        ],
      },
      include: [
        {
          model: Profile,
          as: 'profiles',
          include: [{ model: Rule, as: 'rules' }],
        },
      ],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser?: any) {
    if (currentUser) {
      const isSelfEdit = Number(currentUser.id) === Number(id);

      if (!isSelfEdit) {
        await this.permissionHelper.checkCanEditUser(
          currentUser.id,
          id,
          updateUserDto.profile_ids,
        );
      } else if (
        updateUserDto.profile_ids &&
        updateUserDto.profile_ids.length > 0
      ) {
        await this.permissionHelper.checkCanAssignProfiles(
          currentUser.id,
          updateUserDto.profile_ids,
        );
      }
    }

    const oldUser = await this.userModel.findByPk(id);
    if (!oldUser) return null;

    const normalizedData = this.normalizeData(updateUserDto);
    const { profile_ids, password, ...userData } = normalizedData;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      userData['password_hash'] = await bcrypt.hash(password, salt);
    }

    try {
      const payload = { ...userData };

      await this.userModel.update(payload, { where: { id } });

      // Registra no Log de Auditoria
      if (currentUser) {
        await this.auditService.recordUpdate(
          'User',
          id,
          oldUser.get({ plain: true }),
          payload,
          currentUser.id,
        );
      }

      if (profile_ids) {
        const user = await this.userModel.findByPk(id);
        if (user) {
          await user.$set('profiles', profile_ids);
        }
      }

      return this.findOne(id);
    } catch (e) {
      await this.handleUniqueConstraintError(e);
    }

    return this.findOne(id);
  }

  async remove(id: number, currentUser?: any) {
    if (currentUser) {
      await this.permissionHelper.checkCanDeleteUser(currentUser.id, id);
    }

    // 1. Encontrar o usuário com seus endereços para saber quais deletar depois
    const user = await this.userModel.findByPk(id, {
      include: [{ model: Address, as: 'addresses' }],
    });

    if (!user) {
      return 0;
    }

    const addressIds = user.addresses?.map((addr) => addr.id) || [];

    // 2. Deletar o usuário
    // Primeiro marcamos como inativo (is_active = 0) e depois deletamos (soft delete)
    await user.update({ is_active: false });

    // Isso removerá as associações em user_addresses devido ao CASCADE no banco de dados
    const result = await super.remove(id);

    // 3. Deletar os endereços que ficaram órfãos (sem nenhum outro usuário vinculado)
    if (addressIds.length > 0) {
      for (const addressId of addressIds) {
        const linkCount = await this.userAddressModel.count({
          where: { address_id: addressId },
        });

        if (linkCount === 0) {
          await this.addressModel.destroy({ where: { id: addressId } });
        }
      }
    }

    this.logger.log(
      `User ${id} deleted and its orphaned addresses cleaned up`,
      'UsersService',
    );
    return result;
  }

  async updateUserDocument(
    id: number,
    field: 'lgpd_doc_path' | 'lgpd_minor_doc_path' | 'avatar_url',
    path: string,
  ) {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new BadRequestException('Usuário não encontrado.');
    return user.update({ [field]: path });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const normalized = email.toLowerCase().trim();
    return this.userModel.findOne({
      where: { email: normalized },
    });
  }

  async updatePassword(id: number, password_hash: string): Promise<void> {
    await this.userModel.update({ password_hash }, { where: { id } });
  }

  async restore(id: number, currentUser?: any) {
    if (currentUser) {
      const isAdmin = await this.permissionHelper.isAdmin(currentUser.id);
      if (!isAdmin) {
        throw new ForbiddenException('Apenas administradores podem restaurar usuários.');
      }
    }

    const user = await this.userModel.findByPk(id, { paranoid: false });
    if (!user) {
      throw new BadRequestException('Usuário não encontrado.');
    }
    if (!user.deleted_at) {
      throw new BadRequestException('Este usuário já está ativo.');
    }

    await user.restore();
    await user.update({ is_active: true });

    this.logger.log(`User ${id} restored by admin`, 'UsersService');
    return this.findOne(id);
  }
}
