import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  MinLength,
  IsArray,
  IsInt,
  MaxLength,
  ArrayMinSize,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Nome deve ser um texto' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsString({ message: 'Usuário deve ser um texto' })
  @IsOptional()
  username?: string;

  @IsString({ message: 'Documento deve ser um texto' })
  @IsNotEmpty({ message: 'Documento é obrigatório' })
  document: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email: string;

  @IsString({ message: 'Senha deve ser um texto' })
  @IsOptional()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password?: string;

  @IsString({ message: 'Telefone deve ser um texto' })
  @IsNotEmpty({ message: 'Telefone 1 é obrigatório' })
  phone1?: string;

  @IsString()
  @IsOptional()
  phone2?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1, { message: 'Selecione pelo menos um perfil' })
  profile_ids: number[];

  @IsString()
  @MaxLength(50)
  @IsOptional()
  nationality?: string;

  @IsString()
  @MaxLength(2)
  @IsOptional()
  birth_state?: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  profession?: string;

  @IsString()
  @IsOptional()
  birth_date?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  mother_name?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  father_name?: string;

  @IsString()
  @MaxLength(14)
  @IsOptional()
  rg?: string;

  @IsString()
  @MaxLength(15)
  @IsOptional()
  pis?: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  ctps?: string;

  @IsInt()
  @IsOptional()
  responsible_id?: number;

  @IsString()
  @IsOptional()
  responsible_relation?: string;

  @IsBoolean()
  @IsOptional()
  is_minor?: boolean;

  @IsDateString()
  @IsOptional()
  lgpd_date?: string;

  @IsString()
  @IsOptional()
  lgpd_doc_path?: string;

  @IsBoolean()
  @IsOptional()
  print_lgpd_consent?: boolean;

  @IsBoolean()
  @IsOptional()
  print_lgpd_minor_consent?: boolean;

  @IsBoolean()
  @IsOptional()
  different_address?: boolean;

  @IsString()
  @IsOptional()
  lgpd_minor_doc_path?: string;
}
