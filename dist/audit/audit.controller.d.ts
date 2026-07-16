import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    findAll(entityType: string, entityId: string): Promise<import("../database/models/audit_log.model").AuditLog[]>;
}
