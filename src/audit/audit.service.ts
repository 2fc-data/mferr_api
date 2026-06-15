import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLog } from '../database/models/audit_log.model';
import { User } from '../database/models/user.model';
import { Court } from '../database/models/court.model';
import { Area } from '../database/models/area.model';
import { Stage } from '../database/models/stage.model';
import { Status } from '../database/models/status.model';
import { Outcome } from '../database/models/outcome.model';
import { City } from '../database/models/city.model';
import { Division } from '../database/models/division.model';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog)
    private auditLogModel: typeof AuditLog,
    @InjectModel(Court) private courtModel: typeof Court,
    @InjectModel(Area) private areaModel: typeof Area,
    @InjectModel(Stage) private stageModel: typeof Stage,
    @InjectModel(Status) private statusModel: typeof Status,
    @InjectModel(Outcome) private outcomeModel: typeof Outcome,
    @InjectModel(City) private cityModel: typeof City,
    @InjectModel(Division)
    private divisionModel: typeof Division,
  ) {}

  private async resolveName(field: string, value: any): Promise<string> {
    if (!value) return 'vazio';

    const modelMap: Record<string, any> = {
      court_id: this.courtModel,
      area_id: this.areaModel,
      current_stage_id: this.stageModel,
      current_status_id: this.statusModel,
      outcome_id: this.outcomeModel,
      city_id: this.cityModel,
      division_id: this.divisionModel,
    };

    const model = modelMap[field];
    if (model) {
      try {
        const record = await model.findByPk(value);
        return record ? record.name : value;
      } catch (e) {
        return value;
      }
    }

    return value;
  }

  async recordUpdate(
    entityType: string,
    entityId: number,
    oldData: any,
    newData: any,
    userId: number,
  ) {
    const changes: any = {};
    let hasChanges = false;

    // Compare fields
    for (const key in newData) {
      // Skip some fields that shouldn't be tracked or are internal
      if (['updated_at', 'created_at', 'password_hash'].includes(key)) continue;

      const oldVal = oldData[key];
      const newVal = newData[key];

      if (
        oldVal !== newVal &&
        JSON.stringify(oldVal) !== JSON.stringify(newVal)
      ) {
        const oldResolved = await this.resolveName(key, oldVal);
        const newResolved = await this.resolveName(key, newVal);

        changes[key] = {
          old: oldResolved,
          new: newResolved,
        };
        hasChanges = true;
      }
    }

    if (!hasChanges) return null;

    return this.createRawLog(entityType, entityId, 'UPDATE', changes, userId);
  }

  async createRawLog(
    entityType: string,
    entityId: number,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    changes: any,
    userId: number,
  ) {
    console.log(
      `[AuditLog] Creating log for ${entityType}#${entityId} - Action: ${action}`,
    );
    return this.auditLogModel.create({
      entity_type: entityType,
      entity_id: entityId,
      action,
      changes,
      user_id: userId,
    });
  }

  async findAllByEntity(entityType: string, entityId: number) {
    return this.auditLogModel.findAll({
      where: { entity_type: entityType, entity_id: entityId },
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']],
    });
  }
}
