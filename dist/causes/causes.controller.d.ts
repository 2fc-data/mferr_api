import { CausesService } from './causes.service';
import { CreateCauseDto } from './dto/create-cause.dto';
import { UpdateCauseDto } from './dto/update-cause.dto';
export declare class CausesController {
    private readonly causesService;
    constructor(causesService: CausesService);
    create(createCauseDto: CreateCauseDto, req: any): Promise<import("../database/models/cause.model").Cause>;
    findAll(req: any, city_id?: string, court_id?: string, court_division_id?: string, includeDeleted?: string): Promise<any[]>;
    findOne(id: string, req: any): Promise<any>;
    update(id: string, updateCauseDto: UpdateCauseDto, req: any): Promise<any>;
    remove(id: string): Promise<number>;
    uploadContractDoc(id: string, file: Express.Multer.File): Promise<{
        contract_doc_path: string;
    }>;
    getTasks(id: string, status_id?: string): Promise<import("../database/models/cause_task.model").CauseTask[]>;
    toggleTask(id: string, taskId: string, is_completed: boolean, req: any): Promise<import("../database/models/cause_task.model").CauseTask>;
}
