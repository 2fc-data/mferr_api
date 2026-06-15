import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLog } from '../src/database/models/audit_log.model';
import { Court } from '../src/database/models/court.model';
import { Area } from '../src/database/models/area.model';
import { Stage } from '../src/database/models/stage.model';
import { Status } from '../src/database/models/status.model';
import { Outcome } from '../src/database/models/outcome.model';
import { City } from '../src/database/models/city.model';
import { Division } from '../src/database/models/division.model';
import { User } from '../src/database/models/user.model';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('--- Starting Audit Log Remediation ---');

  const auditLogModel = app.get('AuditLogRepository');
  const models: Record<string, any> = {
    court_id: app.get('CourtRepository'),
    area_id: app.get('AreaRepository'),
    current_stage_id: app.get('StageRepository'),
    current_status_id: app.get('StatusRepository'),
    outcome_id: app.get('OutcomeRepository'),
    city_id: app.get('CityRepository'),
    division_id: app.get('DivisionRepository'),
  };

  const logs = await auditLogModel.findAll({
    where: { entity_type: 'cause' },
  });

  console.log(`Found ${logs.length} logs to process.`);

  const fieldLabels: Record<string, string> = {
    court_id: 'Tribunal',
    area_id: 'Área',
    current_stage_id: 'Fase',
    current_status_id: 'Status',
    outcome_id: 'Resultado',
    city_id: 'Cidade',
    division_id: 'Vara / Divisão',
  };

  for (const log of logs) {
    let changed = false;
    const changes = typeof log.changes === 'string' ? JSON.parse(log.changes) : { ...log.changes };

    for (const field of Object.keys(changes)) {
      const delta = changes[field];
      if (!delta) continue;

      // Check if this is an ID that needs translation
      // Field could be either numerical ID or the translated label
      let targetField = field;
      // If field is a label, find the original ID key
      if (Object.values(fieldLabels).includes(field)) {
        targetField = Object.keys(fieldLabels).find(key => fieldLabels[key] === field) || field;
      }

      const model = models[targetField];
      if (model) {
        // Translate OLD value if it's a number
        if (typeof delta.old === 'number' || (typeof delta.old === 'string' && /^\d+$/.test(delta.old))) {
          const entity = await model.findByPk(delta.old);
          if (entity) {
            delta.old = entity.name;
            changed = true;
          }
        } else if (delta.old === null || delta.old === undefined || delta.old === '') {
          delta.old = 'vazio';
          changed = true;
        }

        // Translate NEW value if it's a number
        if (typeof delta.new === 'number' || (typeof delta.new === 'string' && /^\d+$/.test(delta.new))) {
          const entity = await model.findByPk(delta.new);
          if (entity) {
            delta.new = entity.name;
            changed = true;
          }
        } else if (delta.new === null || delta.new === undefined || delta.new === '') {
          delta.new = 'vazio';
          changed = true;
        }
      }

      // Cleanup: if old and new are identical after translation (or both 'vazio'), remove it
      if (delta.old === delta.new) {
        delete changes[field];
        changed = true;
      }
    }

    if (changed) {
      // Re-map labels if they were still IDs
      for (const key of Object.keys(fieldLabels)) {
        if (changes[key]) {
          changes[fieldLabels[key]] = changes[key];
          delete changes[key];
        }
      }

      log.changes = changes;
      await log.save();
      console.log(`Updated log #${log.id}`);
    }
  }

  console.log('--- Remediation Finished ---');
  await app.close();
}

bootstrap();
