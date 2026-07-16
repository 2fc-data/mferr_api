import { StatusTasksService } from './status_tasks.service';
import { CreateStatusTaskDto } from './dto/create-status-task.dto';
import { UpdateStatusTaskDto } from './dto/update-status-task.dto';
export declare class StatusTasksController {
    private readonly statusTasksService;
    constructor(statusTasksService: StatusTasksService);
    create(createStatusTaskDto: CreateStatusTaskDto): Promise<any>;
    findAll(): Promise<import("../database/models/status_task.model").StatusTask[]>;
    findByStatus(statusId: string): Promise<import("../database/models/status_task.model").StatusTask[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateStatusTaskDto: UpdateStatusTaskDto): Promise<any>;
    remove(id: string): Promise<number>;
}
