import { CauseUsersService } from './cause_users.service';
import { CreateCauseUserDto } from './dto/create-cause_user.dto';
import { UpdateCauseUserDto } from './dto/update-cause_user.dto';
export declare class CauseUsersController {
    private readonly causeUsersService;
    constructor(causeUsersService: CauseUsersService);
    create(createCauseUserDto: CreateCauseUserDto): Promise<import("../database/models/cause_user.model").CauseUser>;
    findAll(): Promise<import("../database/models/cause_user.model").CauseUser[]>;
    findOne(id: string): Promise<import("../database/models/cause_user.model").CauseUser | null>;
    update(id: string, updateCauseUserDto: UpdateCauseUserDto): Promise<[affectedCount: number]>;
    remove(id: string): Promise<number>;
}
