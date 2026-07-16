import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
export declare class CourtsController {
    private readonly courtsService;
    constructor(courtsService: CourtsService);
    create(createCourtDto: CreateCourtDto): Promise<import("../database/models/court.model").Court>;
    findAll(state?: string): Promise<import("../database/models/court.model").Court[]>;
    findOne(id: string): Promise<import("../database/models/court.model").Court | null>;
    update(id: string, updateCourtDto: UpdateCourtDto): Promise<[affectedCount: number]>;
    remove(id: string): Promise<number>;
}
