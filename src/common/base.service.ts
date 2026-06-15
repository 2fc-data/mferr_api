import { Model } from 'sequelize-typescript';
import { FindOptions } from 'sequelize';

export abstract class BaseService<T extends Model> {
  constructor(protected readonly model: typeof Model & { new (): T }) {}

  async create(dto: any): Promise<T | any> {
    return this.model.create({ ...dto }) as any;
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    return this.model.findAll(options) as any;
  }

  async findOne(id: number, options?: FindOptions): Promise<T | null | any> {
    return this.model.findByPk(id, options) as any;
  }

  async update(id: number, dto: any, options?: any): Promise<any> {
    return this.model.update(dto, {
      where: { id } as any,
      ...options,
    }) as any;
  }

  async remove(id: number): Promise<number> {
    return this.model.destroy({
      where: { id } as any,
    });
  }
}
