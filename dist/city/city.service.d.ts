import { City } from '../database/models/city.model';
import { Cause } from '../database/models/cause.model';
import { CreateCityDto } from './dto/create-city.dto';
import { BaseService } from '../common/base.service';
export declare class CityService extends BaseService<City> {
    private cityModel;
    private causeModel;
    constructor(cityModel: typeof City, causeModel: typeof Cause);
    findAll(): Promise<City[]>;
    create(dto: CreateCityDto): Promise<City>;
    remove(id: number): Promise<number>;
}
