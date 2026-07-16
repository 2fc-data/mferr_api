import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { Court } from '../database/models/court.model';
export declare class CourtsService {
    private courtModel;
    constructor(courtModel: typeof Court);
    create(createCourtDto: CreateCourtDto): Promise<Court>;
    findAll(state?: string): Promise<Court[]>;
    findOne(id: number): Promise<Court | null>;
    update(id: number, updateCourtDto: UpdateCourtDto): Promise<[affectedCount: number]>;
    remove(id: number): Promise<number>;
}
