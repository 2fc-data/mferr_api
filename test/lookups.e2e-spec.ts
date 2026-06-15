import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

// Models
import { Division } from '../src/database/models/division.model';
import { Court } from '../src/database/models/court.model';
import { Status } from '../src/database/models/status.model';
import { Outcome } from '../src/database/models/outcome.model';
import { Rule } from '../src/database/models/rule.model';
import { Profile } from '../src/database/models/profile.model';
import { ProfileRule } from '../src/database/models/profile_rule.model';
import { Stage } from '../src/database/models/stage.model';
import { City } from '../src/database/models/city.model';
import { Area } from '../src/database/models/area.model';
import { StatusTask } from '../src/database/models/status_task.model';

describe('System Lookups Integration Tests (CRUD & Relationships)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let transaction: Transaction;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    sequelize = app.get(Sequelize);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Start a transaction before each test
    transaction = await sequelize.transaction();
  });

  afterEach(async () => {
    // Rollback transaction after each test to keep DB clean and untouched
    await transaction.rollback();
  });

  describe('1. Court (Tribunais)', () => {
    it('should perform CRUD on Court and enforce unique constraint', async () => {
      // Create
      const court = await Court.create(
        {
          name: 'TEST-Tribunal Regional da 9ª Região',
          description: 'Tribunal de teste para integração',
          state: 'PR',
          is_federal: true,
          is_active: true,
        },
        { transaction }
      );
      expect(court.id).toBeDefined();
      expect(court.get('name')).toBe('TEST-Tribunal Regional da 9ª Região');

      // Read
      const found = await Court.findByPk(court.id, { transaction });
      expect(found).not.toBeNull();
      expect(found?.get('description')).toBe('Tribunal de teste para integração');

      // Update
      await court.update(
        { description: 'Descrição atualizada', is_active: false },
        { transaction }
      );
      const updated = await Court.findByPk(court.id, { transaction });
      expect(updated?.get('description')).toBe('Descrição atualizada');
      expect(updated?.get('is_active')).toBe(false);

      // Unique Constraint Check
      await expect(
        Court.create(
          {
            name: 'TEST-Tribunal Regional da 9ª Região',
            state: 'PR',
          },
          { transaction }
        )
      ).rejects.toThrow();

      // Soft Delete Check
      await court.destroy({ transaction });
      const deleted = await Court.findByPk(court.id, { transaction });
      expect(deleted).toBeNull(); // Excluded from default queries

      // Paranoid query check
      const deletedParanoid = await Court.findByPk(court.id, {
        paranoid: false,
        transaction,
      });
      expect(deletedParanoid).not.toBeNull();
      expect(deletedParanoid?.get('deletedAt')).not.toBeNull();
    });
  });

  describe('2. Division (Varas)', () => {
    it('should perform CRUD on Division', async () => {
      // Create
      const division = await Division.create(
        {
          name: 'TEST-1ª Vara do Trabalho de Curitiba',
          is_active: true,
        },
        { transaction }
      );
      expect(division.id).toBeDefined();
      expect(division.get('name')).toBe('TEST-1ª Vara do Trabalho de Curitiba');

      // Read & Update
      const found = await Division.findByPk(division.id, { transaction });
      await found?.update({ name: 'TEST-2ª Vara do Trabalho' }, { transaction });
      const updated = await Division.findByPk(division.id, { transaction });
      expect(updated?.get('name')).toBe('TEST-2ª Vara do Trabalho');

      // Soft Delete Check
      await division.destroy({ transaction });
      const deleted = await Division.findByPk(division.id, { transaction });
      expect(deleted).toBeNull();
    });
  });

  describe('3. Stage (Fases)', () => {
    it('should perform CRUD on Stage and enforce unique constraint', async () => {
      // Create
      const stage = await Stage.create(
        {
          name: 'TEST-Fase Recursal',
          description: 'Fase para recursos e acórdãos',
          is_active: true,
          is_default: false,
        },
        { transaction }
      );
      expect(stage.id).toBeDefined();
      expect(stage.get('name')).toBe('TEST-Fase Recursal');

      // Read & Update
      const found = await Stage.findByPk(stage.id, { transaction });
      await found?.update({ is_default: true }, { transaction });
      const updated = await Stage.findByPk(stage.id, { transaction });
      expect(updated?.get('is_default')).toBe(true);

      // Unique Constraint Check
      await expect(
        Stage.create(
          {
            name: 'TEST-Fase Recursal',
          },
          { transaction }
        )
      ).rejects.toThrow();

      // Soft Delete Check
      await stage.destroy({ transaction });
      const deleted = await Stage.findByPk(stage.id, { transaction });
      expect(deleted).toBeNull();
    });
  });

  describe('4. Status (Status)', () => {
    it('should perform CRUD on Status and test Stage relationship', async () => {
      // Create Stage
      const stage = await Stage.create(
        {
          name: 'TEST-Fase Executiva',
          description: 'Fase de execução de sentença',
        },
        { transaction }
      );

      // Create Status linked to Stage
      const status = await Status.create(
        {
          name: 'TEST-Sentença Homologada',
          description: 'Status para processo com cálculos homologados',
          stage_id: stage.id,
          is_active: true,
          is_default: false,
        },
        { transaction }
      );
      expect(status.id).toBeDefined();
      expect(status.get('stage_id')).toBe(stage.id);

      // Read & eager load Stage
      const found = await Status.findByPk(status.id, {
        include: [Stage],
        transaction,
      });
      expect(found).not.toBeNull();
      const foundStageField = found?.get('stage') as Stage;
      expect(foundStageField).toBeDefined();
      expect(foundStageField?.get('name')).toBe('TEST-Fase Executiva');

      // Stage has many Statuses check
      const foundStage = await Stage.findByPk(stage.id, {
        include: [Status],
        transaction,
      });
      const statuses = foundStage?.get('statuses') as Status[];
      expect(statuses).toBeDefined();
      expect(statuses.length).toBeGreaterThan(0);
      expect(statuses[0].get('name')).toBe('TEST-Sentença Homologada');

      // Update
      await status.update({ name: 'TEST-Status Alterado' }, { transaction });
      const updated = await Status.findByPk(status.id, { transaction });
      expect(updated?.get('name')).toBe('TEST-Status Alterado');

      // Unique Name Check
      await expect(
        Status.create(
          {
            name: 'TEST-Status Alterado',
          },
          { transaction }
        )
      ).rejects.toThrow();

      // Soft Delete Check
      await status.destroy({ transaction });
      const deleted = await Status.findByPk(status.id, { transaction });
      expect(deleted).toBeNull();
    });
  });

  describe('5. Outcome (Resultados)', () => {
    it('should perform CRUD on Outcome and test Status relationship', async () => {
      // Create Status
      const status = await Status.create(
        {
          name: 'TEST-Status para Resultados',
          description: 'Status temporário',
        },
        { transaction }
      );

      // Create Outcome linked to Status
      const outcome = await Outcome.create(
        {
          name: 'TEST-Acordo Homologado',
          description: 'Partes celebraram acordo judicial',
          status_id: status.id,
          is_active: true,
          is_default: false,
        },
        { transaction }
      );
      expect(outcome.id).toBeDefined();
      expect(outcome.get('status_id')).toBe(status.id);

      // Read & eager load Status
      const found = await Outcome.findByPk(outcome.id, {
        include: [Status],
        transaction,
      });
      expect(found).not.toBeNull();
      const foundStatusField = found?.get('status') as Status;
      expect(foundStatusField).toBeDefined();
      expect(foundStatusField?.get('name')).toBe('TEST-Status para Resultados');

      // Update
      await outcome.update({ description: 'Nova descrição' }, { transaction });
      const updated = await Outcome.findByPk(outcome.id, { transaction });
      expect(updated?.get('description')).toBe('Nova descrição');

      // Unique Name Check
      await expect(
        Outcome.create(
          {
            name: 'TEST-Acordo Homologado',
          },
          { transaction }
        )
      ).rejects.toThrow();

      // Soft Delete Check
      await outcome.destroy({ transaction });
      const deleted = await Outcome.findByPk(outcome.id, { transaction });
      expect(deleted).toBeNull();
    });
  });

  describe('6. Rule (Regras)', () => {
    it('should perform CRUD on Rule and enforce unique constraint', async () => {
      // Create
      const rule = await Rule.create(
        {
          name: 'TEST-Rule-Manage',
          description: 'Regra de teste para gerenciamento',
          is_active: true,
        },
        { transaction }
      );
      expect(rule.id).toBeDefined();
      expect(rule.get('name')).toBe('TEST-Rule-Manage');

      // Read & Update
      const found = await Rule.findByPk(rule.id, { transaction });
      await found?.update({ is_active: false }, { transaction });
      const updated = await Rule.findByPk(rule.id, { transaction });
      expect(updated?.get('is_active')).toBe(false);

      // Unique Name Constraint
      await expect(
        Rule.create(
          {
            name: 'TEST-Rule-Manage',
          },
          { transaction }
        )
      ).rejects.toThrow();

      // Soft Delete Check
      await rule.destroy({ transaction });
      const deleted = await Rule.findByPk(rule.id, { transaction });
      expect(deleted).toBeNull();
    });
  });

  describe('7. Profile (Perfis)', () => {
    it('should perform CRUD on Profile and test Rule relationship (BelongsToMany)', async () => {
      // Create Profile
      const profile = await Profile.create(
        {
          name: 'TEST-Profile-Advogado',
          description: 'Perfil de teste para advogados',
          is_active: true,
        },
        { transaction }
      );
      expect(profile.id).toBeDefined();

      // Create Rule
      const rule = await Rule.create(
        {
          name: 'TEST-Rule-Advogar',
          description: 'Permissão para advogar',
        },
        { transaction }
      );

      // Associate Profile and Rule via ProfileRule join table
      const profileRule = await ProfileRule.create(
        {
          profile_id: profile.id,
          rule_id: rule.id,
        },
        { transaction }
      );
      expect(profileRule).not.toBeNull();

      // Read Profile and eager load Rules
      const found = await Profile.findByPk(profile.id, {
        include: [Rule],
        transaction,
      });
      expect(found).not.toBeNull();
      const rules = found?.get('rules') as Rule[];
      expect(rules).toBeDefined();
      expect(rules.length).toBeGreaterThan(0);
      expect(rules[0].get('name')).toBe('TEST-Rule-Advogar');

      // Update Profile
      await profile.update({ description: 'Descrição atualizada' }, { transaction });
      const updated = await Profile.findByPk(profile.id, { transaction });
      expect(updated?.get('description')).toBe('Descrição atualizada');

      // Unique Name Check
      await expect(
        Profile.create(
          {
            name: 'TEST-Profile-Advogado',
          },
          { transaction }
        )
      ).rejects.toThrow();

      // Soft Delete Check
      await profile.destroy({ transaction });
      const deleted = await Profile.findByPk(profile.id, { transaction });
      expect(deleted).toBeNull();
    });
  });

  describe('8. City (Cidades)', () => {
    it('should perform CRUD on City', async () => {
      // Create
      const city = await City.create(
        {
          name: 'TEST-Florianópolis',
          uf: 'SC',
        },
        { transaction }
      );
      expect(city.id).toBeDefined();
      expect(city.get('name')).toBe('TEST-Florianópolis');

      // Read & Update
      const found = await City.findByPk(city.id, { transaction });
      await found?.update({ name: 'TEST-Joinville' }, { transaction });
      const updated = await City.findByPk(city.id, { transaction });
      expect(updated?.get('name')).toBe('TEST-Joinville');

      // Soft Delete Check
      await city.destroy({ transaction });
      const deleted = await City.findByPk(city.id, { transaction });
      expect(deleted).toBeNull();
    });
  });

  describe('9. Area (Áreas)', () => {
    it('should perform CRUD on Area', async () => {
      // Create
      const area = await Area.create(
        {
          name: 'TEST-Direito Previdenciário',
          description: 'Área focada em aposentadoria e benefícios',
          is_active: true,
        },
        { transaction }
      );
      expect(area.id).toBeDefined();
      expect(area.get('name')).toBe('TEST-Direito Previdenciário');

      // Read & Update
      const found = await Area.findByPk(area.id, { transaction });
      await found?.update({ description: 'Descrição Previdenciário' }, { transaction });
      const updated = await Area.findByPk(area.id, { transaction });
      expect(updated?.get('description')).toBe('Descrição Previdenciário');

      // Soft Delete Check
      await area.destroy({ transaction });
      const deleted = await Area.findByPk(area.id, { transaction });
      expect(deleted).toBeNull();
    });
  });

  describe('10. StatusTask (Checklists)', () => {
    it('should perform CRUD on StatusTask and test Status relationship', async () => {
      // Create Status
      const status = await Status.create(
        {
          name: 'TEST-Status para Checklists',
          description: 'Status temporário para checklists',
        },
        { transaction }
      );

      // Create StatusTask
      const task = await StatusTask.create(
        {
          status_id: status.id,
          description: 'TEST-Elaborar petição de contestação',
          is_required: true,
          order_index: 2,
        },
        { transaction }
      );
      expect(task.id).toBeDefined();
      expect(task.get('status_id')).toBe(status.id);
      expect(task.get('description')).toBe('TEST-Elaborar petição de contestação');

      // Read & eager load Status
      const found = await StatusTask.findByPk(task.id, {
        include: [Status],
        transaction,
      });
      expect(found).not.toBeNull();
      const foundStatusField = found?.get('status') as Status;
      expect(foundStatusField).toBeDefined();
      expect(foundStatusField?.get('name')).toBe('TEST-Status para Checklists');

      // Status has many StatusTasks eager load
      const foundStatus = await Status.findByPk(status.id, {
        include: [StatusTask],
        transaction,
      });
      const tasks = foundStatus?.get('tasks') as StatusTask[];
      expect(tasks).toBeDefined();
      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks[0].get('description')).toBe('TEST-Elaborar petição de contestação');

      // Update
      await task.update({ order_index: 5, is_required: false }, { transaction });
      const updated = await StatusTask.findByPk(task.id, { transaction });
      expect(updated?.get('order_index')).toBe(5);
      expect(updated?.get('is_required')).toBe(false);

      // Soft Delete Check
      await task.destroy({ transaction });
      const deleted = await StatusTask.findByPk(task.id, { transaction });
      expect(deleted).toBeNull();
    });
  });
});
