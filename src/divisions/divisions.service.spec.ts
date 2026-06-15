import { Test, TestingModule } from '@nestjs/testing';
import { DivisionsService } from './divisions.service';
import { getModelToken } from '@nestjs/sequelize';
import { Division } from '../database/models/division.model';
import { Cause } from '../database/models/cause.model';
import { BadRequestException } from '@nestjs/common';

describe('DivisionsService (TDD)', () => {
  let service: DivisionsService;
  let divisionModel: any;

  beforeEach(async () => {
    divisionModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
      findByPk: jest.fn(),
      destroy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DivisionsService,
        {
          provide: getModelToken(Division),
          useValue: divisionModel,
        },
        {
          provide: getModelToken(Cause),
          useValue: { count: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<DivisionsService>(DivisionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException when creating a division with a duplicate name', async () => {
    const dto = { name: '1ª Vara Cível' };
    divisionModel.findOne.mockResolvedValue({ id: 200, name: '1ª Vara Cível', deletedAt: null });

    await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
    await expect(service.create(dto as any)).rejects.toThrow('Esta vara/divisão já está cadastrada.');
  });
});
