import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(req: any, createUserDto: CreateUserDto): Promise<import("../database/models/user.model").User | null | undefined>;
    findAll(req: any, includeDeleted?: string): Promise<any[]>;
    findCollaborators(): Promise<import("../database/models/user.model").User[]>;
    findClients(): Promise<import("../database/models/user.model").User[]>;
    findOne(id: string): Promise<import("../database/models/user.model").User | null>;
    update(req: any, id: string, updateUserDto: UpdateUserDto): Promise<import("../database/models/user.model").User | null>;
    uploadAvatar(req: any, file: Express.Multer.File): Promise<{
        avatar_url: string;
    }>;
    remove(req: any, id: string): Promise<number>;
    restore(req: any, id: string): Promise<import("../database/models/user.model").User | null>;
    uploadLgpdDoc(id: string, file: Express.Multer.File): Promise<{
        lgpd_doc_path: string;
    }>;
    uploadLgpdMinorDoc(id: string, file: Express.Multer.File): Promise<{
        lgpd_minor_doc_path: string;
    }>;
}
