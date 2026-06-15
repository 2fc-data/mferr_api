import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Court } from './court.model';
import { Division } from './division.model';
import { Area } from './area.model';
import { Stage } from './stage.model';
import { Status } from './status.model';
import { Outcome } from './outcome.model';
import { City } from './city.model';
import { CauseUser } from './cause_user.model';
import { CauseTask } from './cause_task.model';
import { User } from './user.model';

@Table({ tableName: 'causes', paranoid: true })
export class Cause extends Model {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    comment: 'Número do processo',
  })
  declare number: string;

  @Column({
    type: DataType.TEXT,
  })
  declare description: string;

  @ForeignKey(() => Court)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'court_id',
  })
  declare court_id: number;

  @ForeignKey(() => Division)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    field: 'division_id',
  })
  declare division_id: number;

  @ForeignKey(() => City)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    field: 'city_id',
  })
  declare city_id: number;

  @ForeignKey(() => Area)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    field: 'area_id',
  })
  declare area_id: number;

  @ForeignKey(() => Stage)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    field: 'current_stage_id',
  })
  declare current_stage_id: number;

  @ForeignKey(() => Status)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    field: 'current_status_id',
  })
  declare current_status_id: number;

  @ForeignKey(() => Outcome)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    field: 'outcome_id',
  })
  declare outcome_id: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    defaultValue: 0.0,
  })
  declare total_value: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    defaultValue: 0.0,
    comment: 'Honorários totais',
  })
  declare total_fees: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    defaultValue: 0.0,
    comment: 'Valor do cliente',
  })
  declare customer_amount: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    defaultValue: 20.0,
    comment: 'Porcentagem de honorários',
  })
  declare percentage: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Data do processo',
  })
  declare process_date: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare is_active: boolean;

  @Column({
    type: DataType.DATE,
    comment: 'Data de encerramento do processo',
  })
  declare closed_at: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare print_contract: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare contract_doc_path: string;

  @BelongsTo(() => Court)
  court: Court;

  @BelongsTo(() => Division)
  division: Division;

  @BelongsTo(() => Area)
  area: Area;

  @BelongsTo(() => Stage)
  current_stage: Stage;

  @BelongsTo(() => Status)
  current_status: Status;

  @BelongsTo(() => Outcome)
  outcome: Outcome;

  @BelongsTo(() => City)
  city: City;

  @HasMany(() => CauseUser)
  cause_users: CauseUser[];

  @HasMany(() => CauseTask)
  cause_tasks: CauseTask[];

  @BelongsToMany(() => User, () => CauseUser)
  collaborators: User[];
}
