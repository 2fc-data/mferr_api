import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Profile } from './profile.model';
import { Rule } from './rule.model';

@Table({ tableName: 'profile_rules', paranoid: false })
export class ProfileRule extends Model {
  @ForeignKey(() => Profile)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  profile_id: number;

  @ForeignKey(() => Rule)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  rule_id: number;
}
