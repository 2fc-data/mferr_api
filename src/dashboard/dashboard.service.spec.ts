import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { DashboardService } from './dashboard.service';
import { Cause } from '../database/models/cause.model';
import { CauseUser } from '../database/models/cause_user.model';
import { CauseTask } from '../database/models/cause_task.model';
import { CacheService } from '../common/cache/cache.service';
import { AppLogger } from '../common/logger/logger.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let causeModel: any;

  const mockCauseModel = {
    findAll: jest.fn(),
    count: jest.fn(),
  };

  const mockCacheService = {
    isAvailable: jest.fn().mockReturnValue(false),
    get: jest.fn(),
    set: jest.fn(),
    invalidatePattern: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: getModelToken(Cause), useValue: mockCauseModel },
        { provide: getModelToken(CauseUser), useValue: {} },
        { provide: getModelToken(CauseTask), useValue: { findAll: jest.fn().mockResolvedValue([]) } },
        { provide: CacheService, useValue: mockCacheService },
        { provide: AppLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    causeModel = module.get(getModelToken(Cause));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateBottlenecks', () => {
    it('should calculate average days per status correctly', () => {
      const mockTasks = [
        { status_task: { description: 'Status A' }, leadTimeDays: 10 },
        { status_task: { description: 'Status A' }, leadTimeDays: 20 },
        { status_task: { description: 'Status B' }, leadTimeDays: 5 },
      ];

      // @ts-ignore - accessing private for unit test
      const result = service.calculateBottlenecks(mockTasks);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Status A');
      expect(result[0].avgDays).toBe(15); // (10+20)/2
      expect(result[1].name).toBe('Status B');
      expect(result[1].avgDays).toBe(5);
    });
  });

  describe('Trends calculation', () => {
    it('should return 100% trend when previous period is zero', () => {
       const current = { actionCount: 10, meanValue: 100, legalFeesCount: 1000 };
       const previous = null;
       
       // @ts-ignore
       const result = service.calculateTrends(current, previous);
       expect(result.volume).toBe(100);
    });

    it('should calculate correct percentage trend', () => {
       const current = { actionCount: 12, meanValue: 100, legalFeesCount: 1000 };
       const previous = { actionCount: 10, meanValue: 80, legalFeesCount: 800 };
       
       // @ts-ignore
       const result = service.calculateTrends(current, previous);
       expect(result.volume).toBe(20); // (12-10)/10 = 20%
    });
  });
});
