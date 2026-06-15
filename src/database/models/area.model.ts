import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'areas', paranoid: true })
export class Area extends Model {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
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
}
