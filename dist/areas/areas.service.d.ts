import { Area } from '../database/models/area.model';
import { BaseService } from '../common/base.service';
export declare class AreasService extends BaseService<Area> {
    private areaModel;
    constructor(areaModel: typeof Area);
    findAll(): Promise<Area[]>;
}
