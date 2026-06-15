import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, BadRequestException } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { Sequelize } from 'sequelize-typescript';

// Services
import { CausesService } from '../src/causes/causes.service';

// Models
import { Cause } from '../src/database/models/cause.model';
import { CauseUser } from '../src/database/models/cause_user.model';
import { User } from '../src/database/models/user.model';
import { Court } from '../src/database/models/court.model';
import { Stage } from '../src/database/models/stage.model';
import { Status } from '../src/database/models/status.model';
import { Outcome } from '../src/database/models/outcome.model';
import { StatusTask } from '../src/database/models/status_task.model';
import { CauseTask } from '../src/database/models/cause_task.model';
import { City } from '../src/database/models/city.model';
import { Area } from '../src/database/models/area.model';
import { Division } from '../src/database/models/division.model';
import { AuditLog } from '../src/database/models/audit_log.model';

describe('Causes & Users Integration Tests (Process Lifecycle & Relationships)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let service: CausesService;

  // Trackers for manual cleanups
  let createdCauseIds: number[] = [];
  let createdUserIds: number[] = [];
  let createdCourtIds: number[] = [];
  let createdCityIds: number[] = [];
  let createdAreaIds: number[] = [];
  let createdDivisionIds: number[] = [];
  let createdStatusTaskIds: number[] = [];
  let createdStatusIds: number[] = [];
  let createdStageIds: number[] = [];
  let createdOutcomeIds: number[] = [];

  // Mock lookups & relationships
  let mockCourt: Court;
  let mockStageInitial: Stage;
  let mockStageClosed: Stage;
  let mockStatusInitial: Status;
  let mockStatusClosed: Status;
  let mockOutcomeOpen: Outcome;
  let mockOutcomeClosed: Outcome;
  let mockCity: City;
  let mockArea: Area;
  let mockDivision: Division;
  let mockUserCollaborator: User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    sequelize = app.get(Sequelize);
    service = app.get(CausesService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const rand = Math.floor(Math.random() * 1000000);

    // 1. Seed lookup data without explicit transactions for E2E reads
    mockCourt = await Court.create({
      name: `TEST-Tribunal E2E Causes-${rand}`,
      state: 'SP',
      is_federal: false,
      is_active: true,
    });
    createdCourtIds.push(mockCourt.id);

    // Try finding existing core Stage/Status/Outcome records, otherwise fallback to creating
    mockStageInitial = await Stage.findByPk(1) || await Stage.create({
      id: 1,
      name: 'TEST-Fase Conhecimento',
      is_active: true,
      is_default: true,
    });
    if (!createdStageIds.includes(mockStageInitial.id) && (mockStageInitial.get('name') as string)?.startsWith('TEST-')) {
      createdStageIds.push(mockStageInitial.id);
    }

    mockStageClosed = await Stage.findByPk(3) || await Stage.create({
      id: 3,
      name: 'TEST-Fase Encerramento',
      is_active: true,
      is_default: false,
    });
    if (!createdStageIds.includes(mockStageClosed.id) && (mockStageClosed.get('name') as string)?.startsWith('TEST-')) {
      createdStageIds.push(mockStageClosed.id);
    }

    mockStatusInitial = await Status.findByPk(40) || await Status.create({
      id: 40,
      name: 'TEST-Petição Inicial',
      stage_id: mockStageInitial.id,
      is_active: true,
      is_default: true,
    });
    if (!createdStatusIds.includes(mockStatusInitial.id) && (mockStatusInitial.get('name') as string)?.startsWith('TEST-')) {
      createdStatusIds.push(mockStatusInitial.id);
    }

    mockStatusClosed = await Status.findByPk(64) || await Status.create({
      id: 64,
      name: 'TEST-Processo Arquivado',
      stage_id: mockStageClosed.id,
      is_active: true,
      is_default: false,
    });
    if (!createdStatusIds.includes(mockStatusClosed.id) && (mockStatusClosed.get('name') as string)?.startsWith('TEST-')) {
      createdStatusIds.push(mockStatusClosed.id);
    }

    mockOutcomeOpen = await Outcome.findByPk(12) || await Outcome.create({
      id: 12,
      name: 'TEST-Em Aberto',
      status_id: mockStatusInitial.id,
      is_active: true,
      is_default: true,
    });
    if (!createdOutcomeIds.includes(mockOutcomeOpen.id) && (mockOutcomeOpen.get('name') as string)?.startsWith('TEST-')) {
      createdOutcomeIds.push(mockOutcomeOpen.id);
    }

    mockOutcomeClosed = await Outcome.findByPk(13) || await Outcome.create({
      id: 13,
      name: 'TEST-Processo Arquivado Outcome',
      status_id: mockStatusClosed.id,
      is_active: true,
      is_default: false,
    });
    if (!createdOutcomeIds.includes(mockOutcomeClosed.id) && (mockOutcomeClosed.get('name') as string)?.startsWith('TEST-')) {
      createdOutcomeIds.push(mockOutcomeClosed.id);
    }

    mockCity = await City.create({
      name: `TEST-Cidade-${rand}`,
      uf: 'SP',
    });
    createdCityIds.push(mockCity.id);

    mockArea = await Area.create({
      name: `TEST-Direito Civil-${rand}`,
      is_active: true,
    });
    createdAreaIds.push(mockArea.id);

    mockDivision = await Division.create({
      name: `TEST-1ª Vara Cível-${rand}`,
      is_active: true,
    });
    createdDivisionIds.push(mockDivision.id);

    mockUserCollaborator = await User.create({
      name: 'TEST-Advogado E2E',
      username: `test_collab_${rand}`,
      document: `TEST-DOC-${rand}`,
      email: `test_collab_${rand}@legal.com`,
      password_hash: 'dummy-password-hash',
      is_active: true,
    });
    createdUserIds.push(mockUserCollaborator.id);
  });

  afterEach(async () => {
    // Orchestrated cleanup order to prevent foreign key errors
    if (createdCauseIds.length > 0) {
      await AuditLog.destroy({ where: { entity_id: createdCauseIds, entity_type: 'Cause' } });
      await CauseTask.destroy({ where: { cause_id: createdCauseIds }, force: true });
      await CauseUser.destroy({ where: { cause_id: createdCauseIds }, force: true });
      await Cause.destroy({ where: { id: createdCauseIds }, force: true });
    }

    if (createdUserIds.length > 0) {
      await AuditLog.destroy({ where: { user_id: createdUserIds } });
      await User.destroy({ where: { id: createdUserIds }, force: true });
    }
    if (createdStatusTaskIds.length > 0) {
      await StatusTask.destroy({ where: { id: createdStatusTaskIds }, force: true });
    }
    if (createdDivisionIds.length > 0) {
      await Division.destroy({ where: { id: createdDivisionIds }, force: true });
    }
    if (createdAreaIds.length > 0) {
      await Area.destroy({ where: { id: createdAreaIds }, force: true });
    }
    if (createdCityIds.length > 0) {
      await City.destroy({ where: { id: createdCityIds }, force: true });
    }
    if (createdCourtIds.length > 0) {
      await Court.destroy({ where: { id: createdCourtIds }, force: true });
    }

    // Clean up created lookups only if we explicitly seeded them
    if (createdOutcomeIds.length > 0) {
      await Outcome.destroy({ where: { id: createdOutcomeIds }, force: true });
    }
    if (createdStatusIds.length > 0) {
      await Status.destroy({ where: { id: createdStatusIds }, force: true });
    }
    if (createdStageIds.length > 0) {
      await Stage.destroy({ where: { id: createdStageIds }, force: true });
    }

    // Reset tracking lists
    createdCauseIds = [];
    createdUserIds = [];
    createdCourtIds = [];
    createdCityIds = [];
    createdAreaIds = [];
    createdDivisionIds = [];
    createdStatusTaskIds = [];
    createdStatusIds = [];
    createdStageIds = [];
    createdOutcomeIds = [];
  });

  describe('1. User Uniqueness & Constraints', () => {
    it('should prevent creating duplicate users with the same username or email', async () => {
      const rand = Math.floor(Math.random() * 1000000);
      
      const user = await User.create({
        name: 'TEST-Unique User',
        username: `test_user_unique_${rand}`,
        document: `DOC-UNIQ-${rand}`,
        email: `test_uniq_${rand}@legal.com`,
        password_hash: 'dummy-hash',
        is_active: true,
      });
      createdUserIds.push(user.id);
      expect(user.id).toBeDefined();

      await expect(
        User.create({
          name: 'TEST-Duplicate Username',
          username: `test_user_unique_${rand}`,
          document: `DOC-DUP-1-${rand}`,
          email: `test_uniq_dup1_${rand}@legal.com`,
          password_hash: 'dummy-hash',
          is_active: true,
        })
      ).rejects.toThrow();

      await expect(
        User.create({
          name: 'TEST-Duplicate Email',
          username: `test_user_other_${rand}`,
          document: `DOC-DUP-2-${rand}`,
          email: `test_uniq_${rand}@legal.com`,
          password_hash: 'dummy-hash',
          is_active: true,
        })
      ).rejects.toThrow();
    });
  });

  describe('2. Process Autolifecycle (Fase Encerramento & Outcomes)', () => {
    it('should automatically set closed_at and outcome_id = 13 when process transitions to Encerramento (stage 3) and status is 64', async () => {
      const rand = Math.floor(Math.random() * 1000000);

      const cause = await Cause.create({
        number: `TEST-PROC-${rand}`,
        description: 'Processo E2E de Teste',
        court_id: mockCourt.id,
        division_id: mockDivision.id,
        city_id: mockCity.id,
        area_id: mockArea.id,
        current_stage_id: mockStageInitial.id,
        current_status_id: mockStatusInitial.id,
        outcome_id: mockOutcomeOpen.id,
        process_date: '2026-05-18',
        is_active: true,
      });
      createdCauseIds.push(cause.id);
      expect(cause.get('closed_at')).toBeFalsy();

      const updatedCause = await service.update(
        cause.id,
        {
          current_stage_id: 3, 
          current_status_id: 64, 
        },
        { id: mockUserCollaborator.id, rules: ['admin'] }
      );

      expect(updatedCause).not.toBeNull();
      expect(updatedCause?.closed_at).toBeTruthy();
      expect(updatedCause?.outcome_id).toBe(13); 
    });

    it('should clear closed_at and map outcome_id = 12 when process transitions out of Encerramento (stage 3)', async () => {
      const rand = Math.floor(Math.random() * 1000000);

      const cause = await Cause.create({
        number: `TEST-PROC-CLOSED-${rand}`,
        description: 'Processo Fechado E2E',
        court_id: mockCourt.id,
        division_id: mockDivision.id,
        city_id: mockCity.id,
        area_id: mockArea.id,
        current_stage_id: 3, 
        current_status_id: 64, 
        outcome_id: 13, 
        closed_at: new Date(),
        process_date: '2026-05-18',
        is_active: true,
      });
      createdCauseIds.push(cause.id);
      expect(cause.get('closed_at')).toBeTruthy();

      const updatedCause = await service.update(
        cause.id,
        {
          current_stage_id: mockStageInitial.id,
          current_status_id: mockStatusInitial.id,
        },
        { id: mockUserCollaborator.id, rules: ['admin'] }
      );

      expect(updatedCause).not.toBeNull();
      expect(updatedCause?.closed_at).toBeNull(); 
      expect(updatedCause?.outcome_id).toBe(12); 
    });
  });

  describe('3. Checklist Gate Guard', () => {
    it('should throw BadRequestException when trying to change status with pending mandatory tasks in current status', async () => {
      const rand = Math.floor(Math.random() * 1000000);

      const mandatoryTask = await StatusTask.create({
        status_id: mockStatusInitial.id,
        description: `TEST-Mandatory Task-${rand}`,
        is_required: true,
        order_index: 1,
      });
      createdStatusTaskIds.push(mandatoryTask.id);

      const cause = await Cause.create({
        number: `TEST-CHECKLIST-${rand}`,
        court_id: mockCourt.id,
        division_id: mockDivision.id,
        city_id: mockCity.id,
        area_id: mockArea.id,
        current_stage_id: mockStageInitial.id,
        current_status_id: mockStatusInitial.id,
        process_date: '2026-05-18',
        is_active: true,
      });
      createdCauseIds.push(cause.id);

      await service.syncTasks(cause.id, mockStatusInitial.id);

      await expect(
        service.update(
          cause.id,
          {
            current_status_id: mockStatusClosed.id,
          },
          { id: mockUserCollaborator.id, rules: ['admin'] }
        )
      ).rejects.toThrow(BadRequestException);

      const tasks = await service.findAllTasks(cause.id.toString(), mockStatusInitial.id);
      expect(tasks.length).toBeGreaterThanOrEqual(1);
      const causeTask = tasks.find(t => t.status_task_id === mandatoryTask.id);
      expect(causeTask).toBeDefined();
      expect(causeTask!.is_completed).toBe(false);

      // Complete all mandatory tasks for the current status to allow transitioning status
      for (const t of tasks) {
        if (t.status_task?.is_required && !t.is_completed) {
          await service.toggleTask(t.id, mockUserCollaborator.id, true);
        }
      }

      const updated = await service.update(
        cause.id,
        {
          current_status_id: mockStatusClosed.id,
        },
        { id: mockUserCollaborator.id, rules: ['admin'] }
      );

      expect(updated).not.toBeNull();
      expect(updated?.current_status_id).toBe(mockStatusClosed.id);
    });
  });

  describe('4. Involved Users (CauseUser Relationship)', () => {
    it('should persist, retrieve, and update involved users on Cause registration/updates', async () => {
      const rand = Math.floor(Math.random() * 1000000);

      const cause = await service.create(
        {
          number: `TEST-USERS-INVOLVED-${rand}`,
          description: 'Processo com Envolvidos',
          court_id: mockCourt.id,
          division_id: mockDivision.id,
          city_id: mockCity.id,
          area_id: mockArea.id,
          current_stage_id: mockStageInitial.id,
          current_status_id: mockStatusInitial.id,
          process_date: '2026-05-18',
          involved_users: [
            {
              user_id: mockUserCollaborator.id,
              role_type_id: 1, 
              party_side_id: 1, 
              is_primary: true,
            },
          ],
        },
        { id: mockUserCollaborator.id, rules: ['admin'] }
      );
      createdCauseIds.push(cause.id);

      const found = await service.findOne(cause.id, { id: mockUserCollaborator.id, rules: ['admin'] });
      expect(found).not.toBeNull();
      expect(found?.cause_users).toBeDefined();
      expect(found?.cause_users?.length).toBeGreaterThan(0);
      expect(found?.cause_users?.[0].user_id).toBe(mockUserCollaborator.id);
      expect(found?.cause_users?.[0].is_primary).toBe(true);

      const randOther = Math.floor(Math.random() * 1000000);
      const otherUser = await User.create({
        name: 'TEST-Other Adv',
        username: `other_${randOther}`,
        document: `DOC-OTHER-${randOther}`,
        email: `other_${randOther}@legal.com`,
        password_hash: 'dummy-hash',
        is_active: true,
      });
      createdUserIds.push(otherUser.id);

      const updated = await service.update(
        cause.id,
        {
          involved_users: [
            {
              user_id: otherUser.id,
              role_type_id: 1,
              party_side_id: 1,
              is_primary: true,
            },
          ],
        },
        { id: mockUserCollaborator.id, rules: ['admin'] }
      );

      expect(updated?.cause_users).toBeDefined();
      expect(updated?.cause_users?.length).toBe(1);
      expect(updated?.cause_users?.[0].user_id).toBe(otherUser.id);
    });
  });

  describe('5. Strict Collaborator Isolation (Access Control)', () => {
    it('should isolate processes so that collaborators can only access processes they are assigned to', async () => {
      const rand = Math.floor(Math.random() * 1000000);

      const cause = await Cause.create({
        number: `TEST-ISOLATION-${rand}`,
        court_id: mockCourt.id,
        division_id: mockDivision.id,
        city_id: mockCity.id,
        area_id: mockArea.id,
        current_stage_id: mockStageInitial.id,
        current_status_id: mockStatusInitial.id,
        process_date: '2026-05-18',
        is_active: true,
      });
      createdCauseIds.push(cause.id);

      const adminResults = await service.findAll(
        { id: mockUserCollaborator.id, rules: ['admin'] },
        { division_id: mockDivision.id }
      );
      const foundInAdmin = adminResults.find((c) => c.id === cause.id);
      expect(foundInAdmin).toBeDefined();

      const collabResults = await service.findAll(
        { id: mockUserCollaborator.id, rules: ['collaborator'] },
        { division_id: mockDivision.id }
      );
      const foundInCollab = collabResults.find((c) => c.id === cause.id);
      expect(foundInCollab).toBeUndefined();

      await CauseUser.create({
        cause_id: cause.id,
        user_id: mockUserCollaborator.id,
        role_type_id: 2, // Lawyer
        party_side_id: 1,
        is_primary: true,
      });

      const assignedCollabResults = await service.findAll(
        { id: mockUserCollaborator.id, rules: ['collaborator'] },
        { division_id: mockDivision.id }
      );
      const foundAssigned = assignedCollabResults.find((c) => c.id === cause.id);
      expect(foundAssigned).toBeDefined();
    });
  });
});
