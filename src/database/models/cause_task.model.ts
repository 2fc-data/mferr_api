import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Cause } from './cause.model';
import { StatusTask } from './status_task.model';
import { User } from './user.model';

@Table({ tableName: 'cause_tasks', paranoid: true })
export class CauseTask extends Model {
  @ForeignKey(() => Cause)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'cause_id',
  })
  cause_id: number;

  @ForeignKey(() => StatusTask)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'status_task_id',
  })
  status_task_id: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'is_completed',
  })
  is_completed: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'completed_at',
  })
  completed_at: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
    field: 'completed_by',
  })
  completed_by: number;

  @BelongsTo(() => Cause)
  cause: Cause;

  @BelongsTo(() => StatusTask)
  status_task: StatusTask;

  @BelongsTo(() => User)
  completer: User;
}
