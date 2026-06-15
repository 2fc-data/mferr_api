import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { UserAddress } from './user_address.model';

@Table({
  tableName: 'addresses',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Address extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  postcode: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.CHAR(2),
    allowNull: false,
  })
  state: string;

  @Column({
    type: DataType.STRING(100),
  })
  district: string;

  @Column({
    type: DataType.STRING(200),
  })
  street: string;

  @Column({
    type: DataType.STRING(20),
  })
  number: string;

  @Column({
    type: DataType.STRING(100),
  })
  complement: string;

  @BelongsToMany(() => User, () => UserAddress)
  users: User[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
