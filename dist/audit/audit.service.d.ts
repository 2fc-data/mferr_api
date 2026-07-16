import { AuditLog } from '../database/models/audit_log.model';
import { Court } from '../database/models/court.model';
import { Area } from '../database/models/area.model';
import { Stage } from '../database/models/stage.model';
import { Status } from '../database/models/status.model';
import { Outcome } from '../database/models/outcome.model';
import { City } from '../database/models/city.model';
import { Division } from '../database/models/division.model';
export declare class AuditService {
    private auditLogModel;
    private courtModel;
    private areaModel;
    private stageModel;
    private statusModel;
    private outcomeModel;
    private cityModel;
    private divisionModel;
    constructor(auditLogModel: typeof AuditLog, courtModel: typeof Court, areaModel: typeof Area, stageModel: typeof Stage, statusModel: typeof Status, outcomeModel: typeof Outcome, cityModel: typeof City, divisionModel: typeof Division);
    private resolveName;
    recordUpdate(entityType: string, entityId: number, oldData: any, newData: any, userId: number): Promise<AuditLog | null>;
    createRawLog(entityType: string, entityId: number, action: 'CREATE' | 'UPDATE' | 'DELETE', changes: any, userId: number): Promise<AuditLog>;
    findAllByEntity(entityType: string, entityId: number): Promise<AuditLog[]>;
}
