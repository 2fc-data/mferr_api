import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'divisions', paranoid: true })
export class Division extends Model {
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_active: boolean;
}
