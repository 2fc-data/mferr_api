import { Test, TestingModule } from '@nestjs/testing';
import { CausesService } from './causes.service';
import { getModelToken } from '@nestjs/sequelize';
import { Cause } from '../database/models/cause.model';
import { CauseUser } from '../database/models/cause_user.model';
import { Court } from '../database/models/court.model';
import { Area } from '../database/models/area.model';
import { Stage } from '../database/models/stage.model';
import { Status } from '../database/models/status.model';
import { Outcome } from '../database/models/outcome.model';
import { Division } from '../database/models/division.model';
import { City } from '../database/models/city.model';
import { StatusTask } from '../database/models/status_task.model';
import { CauseTask } from '../database/models/cause_task.model';
import { AuditService } from '../audit/audit.service';

describe('CausesService', () => {
  let service: CausesService;

  const mockModel = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
    sequelize: {
      query: jest.fn(),
    },
  };

  const mockAuditService = {
    createRawLog: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CausesService,
        { provide: getModelToken(Cause), useValue: mockModel },
        { provide: getModelToken(CauseUser), useValue: mockModel },
        { provide: getModelToken(Court), useValue: mockModel },
        { provide: getModelToken(Area), useValue: mockModel },
        { provide: getModelToken(Stage), useValue: mockModel },
        { provide: getModelToken(Status), useValue: mockModel },
        { provide: getModelToken(Outcome), useValue: mockModel },
        { provide: getModelToken(Division), useValue: mockModel },
        { provide: getModelToken(City), useValue: mockModel },
        { provide: getModelToken(StatusTask), useValue: mockModel },
        { provide: getModelToken(CauseTask), useValue: mockModel },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<CausesService>(CausesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  describe('findAll', () => {
    it('should filter causes by division_id when provided', async () => {
      const filters = { division_id: 5 };
      mockModel.findAll.mockResolvedValue([]);

      await service.findAll({ rules: ['admin'] }, filters);

      expect(mockModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            division_id: 5,
          }),
        }),
      );
    });
  });

  describe('findAllTasks', () => {
    it('should fetch tasks for a specific cause status', async () => {
      const mockResult = [{ current_status_id: 41 }];
      const mockTasks = [
        {
          id: 1,
          cause_id: 10,
          status_task_id: 1,
          is_completed: 0,
          status_task_description: 'Task 1',
          status_task_is_required: 1,
          status_task_order_index: 0,
        },
      ];

      mockModel.sequelize.query
        .mockResolvedValueOnce(mockResult) // For current_status_id lookup
        .mockResolvedValueOnce(undefined) // For syncTasks
        .mockResolvedValueOnce(mockTasks); // For tasks lookup

      const result = await service.findAllTasks('10');

      expect(result).toHaveLength(1);
      expect(result[0].status_task.description).toBe('Task 1');
      expect(mockModel.sequelize.query).toHaveBeenCalledTimes(3);
    });
  });
});
