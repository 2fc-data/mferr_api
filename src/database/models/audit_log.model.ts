import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'audit_logs',
  timestamps: false,
})
export class AuditLog extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  entity_type: string;

  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  entity_id: number;

  @Column({
    type: DataType.ENUM('CREATE', 'UPDATE', 'DELETE'),
    defaultValue: 'UPDATE',
  })
  action: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  changes: any;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at: Date;
}
