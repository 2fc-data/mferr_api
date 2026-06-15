import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Stage } from './stage.model';
import { StatusTask } from './status_task.model';

@Table({ tableName: 'status', paranoid: true })
export class Status extends Model {
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

  @ForeignKey(() => Stage)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  stage_id: number;

  @BelongsTo(() => Stage)
  stage: Stage;

  @HasMany(() => StatusTask)
  tasks: StatusTask[];
}
