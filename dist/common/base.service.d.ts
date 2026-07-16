import { Model } from 'sequelize-typescript';
import { FindOptions } from 'sequelize';
export declare abstract class BaseService<T extends Model> {
    protected readonly model: typeof Model & {
        new (): T;
    };
    constructor(model: typeof Model & {
        new (): T;
    });
    create(dto: any): Promise<T | any>;
    findAll(options?: FindOptions): Promise<T[]>;
    findOne(id: number, options?: FindOptions): Promise<T | null | any>;
    update(id: number, dto: any, options?: any): Promise<any>;
    remove(id: number): Promise<number>;
}
