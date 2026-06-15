import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'address_types', paranoid: true })
export class AddressType extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_active: boolean;
}
