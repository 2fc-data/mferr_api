import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Cause } from './cause.model';
import { User } from './user.model';
import { CauseRoleType } from './cause_role_type.model';
import { PartySide } from './party_side.model';

@Table({ tableName: 'cause_users' })
export class CauseUser extends Model {
  @ForeignKey(() => Cause)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  cause_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  user_id: number;

  @ForeignKey(() => CauseRoleType)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  role_type_id: number;

  @BelongsTo(() => CauseRoleType)
  role_type: CauseRoleType;

  @ForeignKey(() => PartySide)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  party_side_id: number;

  @BelongsTo(() => PartySide)
  party_side: PartySide;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    comment: 'Indica se é o responsável principal',
  })
  is_primary: boolean;

  @BelongsTo(() => Cause)
  cause: Cause;

  @BelongsTo(() => User)
  user: User;
}
