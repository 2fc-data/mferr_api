import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    create(createProfileDto: CreateProfileDto): Promise<import("../database/models/profile.model").Profile>;
    findAll(): Promise<import("../database/models/profile.model").Profile[]>;
    findOne(id: string): Promise<import("../database/models/profile.model").Profile | null>;
    update(id: string, updateProfileDto: UpdateProfileDto): Promise<import("../database/models/profile.model").Profile | null>;
    remove(id: string): Promise<number>;
}
