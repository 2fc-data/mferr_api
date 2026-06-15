import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Cause } from './cause.model';

@Table({ tableName: 'cities', paranoid: true })
export class City extends Model {
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(2),
    allowNull: false,
  })
  declare uf: string;

  @HasMany(() => Cause)
  causes: Cause[];
}
