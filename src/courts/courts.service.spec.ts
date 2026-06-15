import { Test, TestingModule } from '@nestjs/testing';
import { CourtsService } from './courts.service';
import { getModelToken } from '@nestjs/sequelize';
import { Court } from '../database/models/court.model';
import { BadRequestException } from '@nestjs/common';

describe('CourtsService (TDD)', () => {
  let service: CourtsService;
  let courtModel: any;

  beforeEach(async () => {
    // Mocking the model to avoid real DB dependency for unit test
    courtModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
      findByPk: jest.fn(),
      destroy: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourtsService,
        {
          provide: getModelToken(Court),
          useValue: courtModel,
        },
      ],
    }).compile();

    service = module.get<CourtsService>(CourtsService);
  });

  it('should throw BadRequestException when creating a court with a duplicate name', async () => {
    const dto = { name: 'Vara Cível' };
    
    // Simulate existing court
    courtModel.findOne.mockResolvedValue({ id: 100, name: 'Vara Cível' });

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    await expect(service.create(dto)).rejects.toThrow('Este tribunal já está cadastrado.');
  });

  it('should restore and update a soft-deleted court if a new one is created with the same name', async () => {
    const dto = { name: 'Vara Cível' };
    const existingDeleted = { 
      id: 100, 
      name: 'Vara Cível', 
      deletedAt: new Date(),
      restore: jest.fn().mockResolvedValue(true),
      update: jest.fn().mockResolvedValue(true)
    };
    
    courtModel.findOne.mockResolvedValue(existingDeleted);

    const result = await service.create(dto);

    expect(existingDeleted.restore).toHaveBeenCalled();
    expect(existingDeleted.update).toHaveBeenCalledWith(dto);
    expect(result).toBe(existingDeleted);
  });
});
