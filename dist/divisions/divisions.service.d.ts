import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { Division } from '../database/models/division.model';
import { Cause } from '../database/models/cause.model';
export declare class DivisionsService {
    private divisionModel;
    private causeModel;
    constructor(divisionModel: typeof Division, causeModel: typeof Cause);
    create(createDivisionDto: CreateDivisionDto): Promise<Division>;
    findAll(): Promise<Division[]>;
    findOne(id: number): Promise<Division | null>;
    update(id: number, updateDivisionDto: UpdateDivisionDto): Promise<[affectedCount: number]>;
    remove(id: number): Promise<number>;
}
