import {
  BelongsTo,
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Address } from './address.model';
import { AddressType } from './address_type.model';

@Table({
  tableName: 'user_addresses',
  timestamps: true,
  underscored: true,
})
export class UserAddress extends Model {
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
  user_id: number;

  @ForeignKey(() => Address)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  address_id: number;

  @ForeignKey(() => AddressType)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  address_type_id: number;

  @BelongsTo(() => AddressType)
  address_type: AddressType;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_primary: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
