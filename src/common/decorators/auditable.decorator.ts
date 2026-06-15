import { SetMetadata } from '@nestjs/common';

export const AUDIT_KEY = 'audit';
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';

export interface AuditMetadata {
  resource: string;
  action: AuditAction;
}

export const Auditable = (resource: string, action: AuditAction) =>
  SetMetadata(AUDIT_KEY, { resource, action } as AuditMetadata);
