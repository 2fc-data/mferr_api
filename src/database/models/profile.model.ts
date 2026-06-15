import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
import { UserProfile } from './user_profile.model';
import { Rule } from './rule.model';
import { ProfileRule } from './profile_rule.model';

@Table({ tableName: 'profiles', paranoid: true })
export class Profile extends Model {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
  })
  declare description: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare is_active: boolean;

  @BelongsToMany(() => User, () => UserProfile)
  users: User[];

  @BelongsToMany(() => Rule, () => ProfileRule)
  rules: Rule[];
}
