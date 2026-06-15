import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Status } from './status.model';
import { CauseTask } from './cause_task.model';

@Table({ tableName: 'status_tasks', paranoid: true })
export class StatusTask extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;
  @ForeignKey(() => Status)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'status_id',
  })
  status_id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'is_required',
  })
  is_required: boolean;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    field: 'order_index',
  })
  order_index: number;

  @BelongsTo(() => Status)
  status: Status;

  @HasMany(() => CauseTask)
  cause_tasks: CauseTask[];
}
