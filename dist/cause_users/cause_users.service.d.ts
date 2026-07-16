import { CreateCauseUserDto } from './dto/create-cause_user.dto';
import { UpdateCauseUserDto } from './dto/update-cause_user.dto';
import { CauseUser } from '../database/models/cause_user.model';
export declare class CauseUsersService {
    private causeUserModel;
    constructor(causeUserModel: typeof CauseUser);
    create(createCauseUserDto: CreateCauseUserDto): Promise<CauseUser>;
    findAll(): Promise<CauseUser[]>;
    findOne(id: number): Promise<CauseUser | null>;
    update(id: number, updateCauseUserDto: UpdateCauseUserDto): Promise<[affectedCount: number]>;
    remove(id: number): Promise<number>;
}
