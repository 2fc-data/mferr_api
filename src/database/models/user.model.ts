import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Profile } from './profile.model';
import { UserProfile } from './user_profile.model';
import { Cause } from './cause.model';
import { CauseUser } from './cause_user.model';
import { Address } from './address.model';
import { UserAddress } from './user_address.model';

@Table({
  tableName: 'users',
  paranoid: true,
  defaultScope: {
    attributes: { exclude: ['password_hash'] },
  },
})
export class User extends Model {
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    unique: true,
  })
  declare username: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'CPF/CNPJ',
  })
  declare document: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(20),
    unique: true,
  })
  declare phone1: string;

  @Column({
    type: DataType.STRING(20),
  })
  declare phone2: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare password_hash: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare is_active: boolean;

  @Column({
    type: DataType.DATE,
  })
  declare email_verified_at: Date;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare avatar_url: string;

  @Column({
    type: DataType.STRING(50),
    defaultValue: 'Brasileira',
  })
  declare nationality: string;

  @Column({
    type: DataType.STRING(2),
    defaultValue: 'MG',
  })
  declare birth_state: string;

  @Column({
    type: DataType.STRING(100),
  })
  declare profession: string;

  @Column({
    type: DataType.DATEONLY,
  })
  declare birth_date: string;

  @Column({
    type: DataType.STRING(100),
  })
  declare mother_name: string;

  @Column({
    type: DataType.STRING(100),
  })
  declare father_name: string;

  @Column({
    type: DataType.STRING(20),
    unique: true,
  })
  declare rg: string;

  @Column({
    type: DataType.STRING(20),
    unique: true,
  })
  declare pis: string;

  @Column({
    type: DataType.STRING(50),
    unique: true,
  })
  declare ctps: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  declare responsible_id: number;

  @BelongsTo(() => User, 'responsible_id')
  responsible: User;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: 'Pai, Mãe, Tutor, Curador, etc.',
  })
  declare responsible_relation: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_minor: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare lgpd_date: Date;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare lgpd_doc_path: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare print_lgpd_consent: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare print_lgpd_minor_consent: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare lgpd_minor_doc_path: string;

  @BelongsToMany(() => Profile, () => UserProfile)
  profiles: Profile[];

  @BelongsToMany(() => Cause, () => CauseUser)
  responsible_causes: Cause[];

  @BelongsToMany(() => Address, () => UserAddress)
  addresses: Address[];

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @DeletedAt
  declare deleted_at: Date;
}
