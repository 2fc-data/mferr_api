import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'courts',
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['name'],
    },
  ],
})
export class Court extends Model {
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
  })
  declare description: string;

  @Column({
    type: DataType.STRING(2),
  })
  declare state: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_federal: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare is_active: boolean;
}
