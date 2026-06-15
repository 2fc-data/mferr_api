import {
  Injectable,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { QueryTypes } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCauseDto } from './dto/create-cause.dto';
import { UpdateCauseDto } from './dto/update-cause.dto';
import { Cause } from '../database/models/cause.model';
import { CauseUser } from '../database/models/cause_user.model';
import { AuditService } from '../audit/audit.service';
import { User } from '../database/models/user.model';
import { StatusTask } from '../database/models/status_task.model';
import { CauseTask } from '../database/models/cause_task.model';
import { Division } from '../database/models/division.model';
import { Court } from '../database/models/court.model';
import { CAUSE_INCLUDE, mapCauseRecord } from '../common/constants/cause.constants';
import { BaseService } from '../common/base.service';
import { CacheService } from '../common/cache/cache.service';

@Injectable()
export class CausesService extends BaseService<Cause> {
  private readonly logger = new Logger(CausesService.name);
  private readonly CAUSE_INCLUDE = CAUSE_INCLUDE;

  constructor(
    @InjectModel(Cause)
    private causeModel: typeof Cause,
    @InjectModel(CauseUser)
    private causeUserModel: typeof CauseUser,
    @InjectModel(StatusTask)
    private statusTaskModel: typeof StatusTask,
    @InjectModel(CauseTask)
    private causeTaskModel: typeof CauseTask,
    @InjectModel(Division)
    private divisionModel: typeof Division,
    private auditService: AuditService,
    private cacheService: CacheService,
  ) {
    super(causeModel);
  }

  async create(createCauseDto: CreateCauseDto, currentUser?: any) {
    try {
      const { involved_users, ...causeData } = createCauseDto;

      // Automated stage/status/outcome/closed_at lifecycle handling
      const stageId = causeData.current_stage_id ? Number(causeData.current_stage_id) : null;
      const statusId = causeData.current_status_id ? Number(causeData.current_status_id) : null;
      if (stageId === 3) {
        if (!causeData.closed_at) {
          (causeData as any).closed_at = new Date();
        }
        if (statusId === 64 && (causeData.outcome_id === undefined || causeData.outcome_id === null || causeData.outcome_id === 12)) {
          causeData.outcome_id = 13; // Arquivado
        }
      }

      const cause = await this.causeModel.create({ ...causeData });

      if (involved_users && involved_users.length > 0) {
        await Promise.all(
          involved_users.map(async (userRef) => {
            await this.causeUserModel.create({
              cause_id: cause.id,
              user_id: userRef.user_id,
              role_type_id: userRef.role_type_id,
              party_side_id: userRef.party_side_id,
              is_primary: userRef.is_primary ?? false,
            });
          }),
        );
      }

      if (statusId) {
        await this.syncTasks(cause.id, statusId);
      }

      await this.cacheService.invalidatePattern('dashboard:*');

      return cause;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException(
          'Já existe um processo cadastrado com este número.',
        );
      }
      throw error;
    }
  }

  async findAll(
    currentUser?: any,
    filters?: {
      city_id?: number;
      court_id?: number;
      division_id?: number;
    },
    includeDeleted = false,
  ) {
    const whereClause: any = {};

    if (filters) {
      if (filters.city_id) whereClause.city_id = filters.city_id;
      if (filters.court_id) whereClause.court_id = filters.court_id;
      if (filters.division_id)
        whereClause.division_id = filters.division_id;
    }

    if (currentUser?.rules) {
      const isAdmin =
        currentUser.rules.includes('admin') ||
        currentUser.rules.includes('settings.manage');
      if (!isAdmin) {
        const userCauses = await this.causeUserModel.findAll({
          where: { user_id: currentUser.id },
          attributes: ['cause_id'],
        });
        const causeIds = userCauses.map((uc) => Number(uc.get('cause_id')));
        whereClause.id = causeIds;
      }
    }

    const causes = await this.causeModel.findAll({
      where: whereClause,
      include: this.CAUSE_INCLUDE,
      order: [['process_date', 'DESC']],
      paranoid: !includeDeleted,
    });

    return causes.map((cause) => mapCauseRecord(cause));
  }

  async findOne(id: number, currentUser?: any) {
    const cause = await this.causeModel.findByPk(id, {
      include: this.CAUSE_INCLUDE,
    });
    if (!cause) return null;

    if (currentUser?.rules) {
      const isAdmin =
        currentUser.rules.includes('admin') ||
        currentUser.rules.includes('settings.manage');
      if (!isAdmin) {
        const isAssigned = await this.causeUserModel.count({
          where: { cause_id: id, user_id: currentUser.id },
        });
        if (isAssigned === 0) {
          throw new ForbiddenException(
            'Você não tem permissão para acessar este processo.',
          );
        }
      }
    }

    return mapCauseRecord(cause);
  }

  async update(id: number, updateCauseDto: UpdateCauseDto, currentUser?: any) {
    const oldCause = await this.causeModel.findByPk(id);
    if (!oldCause) return null;

    const { involved_users, ...causeData } = updateCauseDto;

    // Automated stage/status/outcome/closed_at lifecycle handling
    const stageId = causeData.current_stage_id !== undefined ? (causeData.current_stage_id ? Number(causeData.current_stage_id) : null) : oldCause.current_stage_id;
    const statusId = causeData.current_status_id !== undefined ? (causeData.current_status_id ? Number(causeData.current_status_id) : null) : oldCause.current_status_id;

    if (stageId === 3) {
      if (!oldCause.closed_at && !causeData.closed_at) {
        (causeData as any).closed_at = new Date();
      }
      if (statusId === 64 && (causeData.outcome_id === undefined || causeData.outcome_id === null || oldCause.outcome_id === 12)) {
        causeData.outcome_id = 13; // Arquivado
      }
    } else if (stageId !== null && stageId !== 3) {
      (causeData as any).closed_at = null;
      if (oldCause.outcome_id === 13) {
        causeData.outcome_id = 12; // Em Aberto
      }
    }

    try {
      // 1. Status change guards
      // ... (keeping guard logic)
      if (
        oldCause.current_status_id &&
        causeData.current_status_id &&
        Number(causeData.current_status_id) !==
          Number(oldCause.current_status_id)
      ) {
        const pendingMandatory = await this.causeTaskModel.count({
          where: { cause_id: id, is_completed: false },
          include: [
            {
              model: StatusTask,
              as: 'status_task',
              where: {
                status_id: oldCause.current_status_id,
                is_required: true,
              },
            },
          ],
        });

        if (pendingMandatory > 0) {
          throw new BadRequestException(
            'Atividades obrigatórias pendentes no status atual.',
          );
        }
      }

      // 2. Perform updates
      await this.causeModel.update(causeData, { where: { id } });

      // Registra no Log de Auditoria
      if (currentUser) {
        await this.auditService.recordUpdate(
          'Cause',
          id,
          oldCause.get({ plain: true }),
          causeData,
          currentUser.id,
        );
      }

      if (
        causeData.current_status_id &&
        Number(causeData.current_status_id) !==
          Number(oldCause.current_status_id)
      ) {
        await this.syncTasks(id, Number(causeData.current_status_id));
      }

      // 3. Update users involved
      if (involved_users) {
        await this.causeUserModel.destroy({
          where: { cause_id: id },
        });
        await Promise.all(
          involved_users.map(async (userRef) => {
            await this.causeUserModel.create({
              cause_id: id,
              user_id: userRef.user_id,
              role_type_id: userRef.role_type_id,
              party_side_id: userRef.party_side_id,
              is_primary: userRef.is_primary ?? false,
            });
          }),
        );
      }

      await this.cacheService.invalidatePattern('dashboard:*');

      return this.findOne(id, currentUser);
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Número de processo já cadastrado.');
      }
      throw e;
    }
  }

  async remove(id: number) {
    const res = await super.remove(id);
    await this.cacheService.invalidatePattern('dashboard:*');
    return res;
  }

  async updateContractDoc(id: number, contract_doc_path: string) {
    const cause = await this.causeModel.findByPk(id);
    if (!cause) throw new BadRequestException('Processo não encontrado.');
    return cause.update({ contract_doc_path });
  }

  // --- CHECKLIST METHODS ---

  async findAllTasks(
    causeId: string,
    providedStatusId?: number,
  ): Promise<CauseTask[]> {
    const id = Number(causeId);
    if (!this.causeModel.sequelize) {
      throw new Error('Base de dados não inicializada corretamente.');
    }

    try {
      let statusId = providedStatusId;
      if (!statusId) {
        const result = await this.causeModel.sequelize.query(
          'SELECT current_status_id FROM causes WHERE id = :id',
          { replacements: { id }, type: QueryTypes.SELECT },
        );
        const causeRow = result[0] as any;
        if (!causeRow)
          throw new BadRequestException('Processo não encontrado.');
        statusId = causeRow.current_status_id;
      }

      if (!statusId) return [];
      await this.syncTasks(id, Number(statusId));

      const tasks = await this.causeModel.sequelize.query(
        `
        SELECT 
          ct.id, ct.cause_id, ct.status_task_id, ct.is_completed, ct.completed_at, ct.completed_by,
          st.description as 'status_task_description',
          st.is_required as 'status_task_is_required',
          st.order_index as 'status_task_order_index'
        FROM cause_tasks ct
        JOIN status_tasks st ON ct.status_task_id = st.id
        WHERE ct.cause_id = :causeId AND st.status_id = :statusId
        ORDER BY st.order_index ASC
      `,
        {
          replacements: { causeId: id, statusId },
          type: QueryTypes.SELECT,
        },
      );

      return tasks.map((t: any) => ({
        id: t.id,
        cause_id: t.cause_id,
        status_task_id: t.status_task_id,
        is_completed: !!t.is_completed,
        completed_at: t.completed_at,
        completed_by: t.completed_by,
        status_task: {
          description: t.status_task_description,
          is_required: !!t.status_task_is_required,
          order_index: t.status_task_order_index,
        },
      })) as any;
    } catch (error) {
      this.logger.error(`[findAllTasks] Error: ${error.message}`);
      throw error;
    }
  }

  async syncTasks(causeId: number, statusId: number): Promise<void> {
    if (!this.causeModel.sequelize) return;
    try {
      await this.causeModel.sequelize.query(
        `
        INSERT IGNORE INTO cause_tasks (cause_id, status_task_id, is_completed, created_at, updated_at)
        SELECT :causeId, id, 0, NOW(), NOW()
        FROM status_tasks
        WHERE status_id = :statusId
        AND id NOT IN (
          SELECT status_task_id FROM cause_tasks WHERE cause_id = :causeId
        )
      `,
        {
          replacements: { causeId, statusId },
        },
      );
    } catch (error) {
      this.logger.error(`[syncTasks] Error: ${error.message}`);
    }
  }

  async toggleTask(taskId: number, userId: number, isCompleted: boolean) {
    const task = await this.causeTaskModel.findByPk(taskId);
    if (!task) throw new BadRequestException('Atividade não encontrada.');

    await task.update({
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date() : null,
      completed_by: isCompleted ? userId : null,
    });

    const res = await task.reload({
      include: [
        { model: StatusTask, as: 'status_task' },
        { model: User, as: 'completer', attributes: ['id', 'name'] },
      ],
    });
    await this.cacheService.invalidatePattern('dashboard:*');
    return res;
  }
}
