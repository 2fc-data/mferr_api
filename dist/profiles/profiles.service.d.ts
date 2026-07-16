import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from '../database/models/profile.model';
export declare class ProfilesService {
    private profileModel;
    constructor(profileModel: typeof Profile);
    create(createProfileDto: CreateProfileDto): Promise<Profile>;
    findAll(): Promise<Profile[]>;
    findOne(id: number): Promise<Profile | null>;
    update(id: number, updateProfileDto: UpdateProfileDto): Promise<Profile | null>;
    remove(id: number): Promise<number>;
}
