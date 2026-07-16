export declare const AUDIT_KEY = "audit";
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';
export interface AuditMetadata {
    resource: string;
    action: AuditAction;
}
export declare const Auditable: (resource: string, action: AuditAction) => import("@nestjs/common").CustomDecorator<string>;
