import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'party_sides', paranoid: true })
export class PartySide extends Model {
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
