import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'password_reset_tokens',
  timestamps: true,
})
export class PasswordResetToken extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  declare userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare token: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare expiresAt: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare used: boolean;
}
