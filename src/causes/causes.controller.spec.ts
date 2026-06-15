import { Test, TestingModule } from '@nestjs/testing';
import { CausesController } from './causes.controller';
import { CausesService } from './causes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RulesGuard } from '../auth/rules.guard';

describe('CausesController', () => {
  let controller: CausesController;
  let service: CausesService;

  const mockService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CausesController],
      providers: [
        { provide: CausesService, useValue: mockService },
      ],
    })
    .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
    .overrideGuard(RulesGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<CausesController>(CausesController);
    service = module.get<CausesService>(CausesService);
  });

  it('should call service.findAll with filters from query params', async () => {
    const req = { user: { id: 1, rules: ['admin'] } };
    
    await controller.findAll(req, '1', '2', '3');

    expect(service.findAll).toHaveBeenCalledWith(
      req.user,
      { city_id: 1, court_id: 2, division_id: 3 },
      false
    );
  });
});
