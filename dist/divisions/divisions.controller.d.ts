import { DivisionsService } from './divisions.service';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
export declare class DivisionsController {
    private readonly divisionsService;
    constructor(divisionsService: DivisionsService);
    create(createDivisionDto: CreateDivisionDto): Promise<import("../database/models/division.model").Division>;
    findAll(): Promise<import("../database/models/division.model").Division[]>;
    findOne(id: string): Promise<import("../database/models/division.model").Division | null>;
    update(id: string, updateDivisionDto: UpdateDivisionDto): Promise<[affectedCount: number]>;
    remove(id: string): Promise<number>;
}
