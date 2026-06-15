import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Status } from './status.model';

@Table({ tableName: 'stages', paranoid: true })
export class Stage extends Model {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_active: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_default: boolean;

  @HasMany(() => Status)
  statuses: Status[];
}
