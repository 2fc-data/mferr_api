import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../database/models/user.model';
import { Address } from '../database/models/address.model';
import { UserAddress } from '../database/models/user_address.model';
import { AuditService } from '../audit/audit.service';
import { AppLogger } from '../common/logger/logger.service';
import { PermissionHelper } from '../common/helpers/permission.helper';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let model: typeof User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: {
            create: jest.fn(),
            findByPk: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getModelToken(Address),
          useValue: {},
        },
        {
          provide: getModelToken(UserAddress),
          useValue: {},
        },
        {
          provide: AuditService,
          useValue: {
            recordCreate: jest.fn(),
            recordUpdate: jest.fn(),
          },
        },
        {
          provide: AppLogger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
        {
          provide: PermissionHelper,
          useValue: {
            isManager: jest.fn(),
            isAdmin: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<typeof User>(getModelToken(User));
  });

  it('should throw ConflictException on unique constraint error', async () => {
    const error = {
      name: 'SequelizeUniqueConstraintError',
      fields: { document: '12345678901' },
    };
    (model.create as jest.Mock).mockRejectedValue(error);

    await expect(service.create({ 
      name: 'Test', 
      document: '12345678901', 
      email: 'test@test.com',
      profile_ids: [4]
    })).rejects.toThrow(ConflictException);
  });

  it('should detect if conflict is with a deleted user', async () => {
    const error = {
      name: 'SequelizeUniqueConstraintError',
      fields: { email: 'deleted@test.com' },
    };
    (model.create as jest.Mock).mockRejectedValue(error);
    // Simulate finding a deleted user
    (model.findOne as jest.Mock).mockResolvedValue({ id: 99, email: 'deleted@test.com', deleted_at: new Date() });

    try {
      await service.create({ 
        name: 'New', 
        email: 'deleted@test.com', 
        document: '99999999999',
        profile_ids: [4] 
      });
      fail('Should have thrown ConflictException');
    } catch (e: any) {
      expect(e.message).toContain('Já existe um usuário cadastrado (porém excluído) com este E-mail');
    }
  });
});
