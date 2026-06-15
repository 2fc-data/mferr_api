import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditService } from '../../audit/audit.service';
import { AUDIT_KEY, AuditMetadata } from '../decorators/auditable.decorator';
import { FIELD_LABELS } from '../constants/audit.constants';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditMeta = this.reflector.get<AuditMetadata>(
      AUDIT_KEY,
      context.getHandler(),
    );

    if (!auditMeta) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { method, params, body } = request;

    if (method === 'POST' && auditMeta.action === 'CREATE') {
      return next.handle().pipe(
        tap(async (result) => {
          await this.handleCreate(auditMeta, result, user);
        }),
      );
    }

    if (method === 'PATCH' && auditMeta.action === 'UPDATE') {
      return next.handle().pipe(
        tap(async (result) => {
          // Since we can't easily get the 'old' state after the update in a generic way
          // without either a double fetch or the service providing it, 
          // we'll assume the service might have stored it or we just log the new state for now
          // if it's too complex. 
          // However, to truly avoid redundancy in services, the interceptor should be powerful.
          await this.handleUpdate(auditMeta, result, user, request.oldSnapshot);
        }),
      );
    }

    if (method === 'DELETE' && auditMeta.action === 'DELETE') {
      return next.handle().pipe(
        tap(async () => {
          await this.handleDelete(auditMeta, params.id, user);
        }),
      );
    }

    return next.handle();
  }

  private async handleCreate(meta: AuditMetadata, result: any, user: any) {
    if (!user || !result) return;

    const labels = FIELD_LABELS[meta.resource as keyof typeof FIELD_LABELS];
    if (!labels) return;

    const changes: any = {};
    for (const [field, label] of Object.entries(labels)) {
      const value = result[field];
      if (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        value !== 'vazio'
      ) {
        changes[label] = {
          old: 'vazio',
          new: typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : value,
        };
      }
    }

    await this.auditService.createRawLog(
      meta.resource,
      result.id,
      'CREATE',
      changes,
      user.id,
    );
  }

  private async handleUpdate(meta: AuditMetadata, result: any, user: any, oldSnapshot: any) {
    if (!user || !result) return;

    const labels = FIELD_LABELS[meta.resource as keyof typeof FIELD_LABELS];
    if (!labels || !oldSnapshot) return;

    const changes: any = {};
    let hasChanges = false;

    const isVazio = (v: any) =>
      v === null ||
      v === undefined ||
      v === '' ||
      String(v).trim() === '' ||
      String(v).trim() === 'null' ||
      v === 'vazio';

    for (const [field, label] of Object.entries(labels)) {
      const oldV = oldSnapshot[field];
      const newV = result[field];

      if (isVazio(oldV) && isVazio(newV)) continue;

      const formattedOldV =
        typeof oldV === 'boolean'
          ? oldV
            ? 'Sim'
            : 'Não'
          : isVazio(oldV)
            ? 'vazio'
            : oldV;
      const formattedNewV =
        typeof newV === 'boolean'
          ? newV
            ? 'Sim'
            : 'Não'
          : isVazio(newV)
            ? 'vazio'
            : newV;

      if (String(formattedOldV) !== String(formattedNewV)) {
        changes[label] = {
          old: formattedOldV,
          new: formattedNewV,
        };
        hasChanges = true;
      }
    }

    if (hasChanges) {
      await this.auditService.createRawLog(
        meta.resource,
        result.id,
        'UPDATE',
        changes,
        user.id,
      );
    }
  }

  private async handleDelete(meta: AuditMetadata, id: number, user: any) {
    if (!user || !id) return;
    await this.auditService.createRawLog(
      meta.resource,
      id,
      'DELETE',
      { deleted: true },
      user.id,
    );
  }
}
