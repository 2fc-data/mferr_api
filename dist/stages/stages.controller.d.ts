import { StagesService } from './stages.service';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
export declare class StagesController {
    private readonly stagesService;
    constructor(stagesService: StagesService);
    create(createStageDto: CreateStageDto): Promise<any>;
    findAll(): Promise<import("../database/models/stage.model").Stage[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateStageDto: UpdateStageDto): Promise<any>;
    remove(id: string): Promise<number>;
}
