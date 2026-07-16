import { CreateCauseDto } from './dto/create-cause.dto';
import { UpdateCauseDto } from './dto/update-cause.dto';
import { Cause } from '../database/models/cause.model';
import { CauseUser } from '../database/models/cause_user.model';
import { AuditService } from '../audit/audit.service';
import { StatusTask } from '../database/models/status_task.model';
import { CauseTask } from '../database/models/cause_task.model';
import { Division } from '../database/models/division.model';
import { BaseService } from '../common/base.service';
import { CacheService } from '../common/cache/cache.service';
export declare class CausesService extends BaseService<Cause> {
    private causeModel;
    private causeUserModel;
    private statusTaskModel;
    private causeTaskModel;
    private divisionModel;
    private auditService;
    private cacheService;
    private readonly logger;
    private readonly CAUSE_INCLUDE;
    constructor(causeModel: typeof Cause, causeUserModel: typeof CauseUser, statusTaskModel: typeof StatusTask, causeTaskModel: typeof CauseTask, divisionModel: typeof Division, auditService: AuditService, cacheService: CacheService);
    create(createCauseDto: CreateCauseDto, currentUser?: any): Promise<Cause>;
    findAll(currentUser?: any, filters?: {
        city_id?: number;
        court_id?: number;
        division_id?: number;
    }, includeDeleted?: boolean): Promise<any[]>;
    findOne(id: number, currentUser?: any): Promise<any>;
    update(id: number, updateCauseDto: UpdateCauseDto, currentUser?: any): Promise<any>;
    remove(id: number): Promise<number>;
    updateContractDoc(id: number, contract_doc_path: string): Promise<Cause>;
    findAllTasks(causeId: string, providedStatusId?: number): Promise<CauseTask[]>;
    syncTasks(causeId: number, statusId: number): Promise<void>;
    toggleTask(taskId: number, userId: number, isCompleted: boolean): Promise<CauseTask>;
}
