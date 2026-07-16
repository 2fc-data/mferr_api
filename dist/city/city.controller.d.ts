import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
export declare class CityController {
    private readonly cityService;
    constructor(cityService: CityService);
    create(createCityDto: CreateCityDto): Promise<import("../database/models/city.model").City>;
    findAll(): Promise<import("../database/models/city.model").City[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateCityDto: UpdateCityDto): Promise<any>;
    remove(id: string): Promise<number>;
}
