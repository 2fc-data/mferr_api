import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
export declare class StatusController {
    private readonly statusService;
    constructor(statusService: StatusService);
    create(createStatusDto: CreateStatusDto): Promise<any>;
    findAll(): Promise<import("../database/models/status.model").Status[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateStatusDto: UpdateStatusDto): Promise<any>;
    remove(id: string): Promise<number>;
}
