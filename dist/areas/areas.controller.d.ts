import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
export declare class AreasController {
    private readonly areasService;
    constructor(areasService: AreasService);
    create(createAreaDto: CreateAreaDto): Promise<any>;
    findAll(): Promise<import("../database/models/area.model").Area[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateAreaDto: UpdateAreaDto): Promise<any>;
    remove(id: string): Promise<number>;
}
