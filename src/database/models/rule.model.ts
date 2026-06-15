import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'rules', paranoid: true })
export class Rule extends Model {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_active: boolean;
}
