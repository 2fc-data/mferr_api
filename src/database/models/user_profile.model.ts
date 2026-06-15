import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Profile } from './profile.model';

@Table({ tableName: 'user_profiles', paranoid: false })
export class UserProfile extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  declare user_id: number;

  @ForeignKey(() => Profile)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  declare profile_id: number;
}
