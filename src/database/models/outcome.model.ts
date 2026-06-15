import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Status } from './status.model';

@Table({ tableName: 'outcomes', paranoid: true })
export class Outcome extends Model {
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

  @ForeignKey(() => Status)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  status_id: number;

  @BelongsTo(() => Status)
  status: Status;

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
}
