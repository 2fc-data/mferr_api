import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEnum,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateAddressDto {
  @IsString({ message: 'CEP deve ser um texto' })
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @MaxLength(10, { message: 'CEP muito longo' })
  postcode: string;

  @IsString({ message: 'Cidade deve ser um texto' })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @MaxLength(100, { message: 'Nome da cidade muito longo' })
  city: string;

  @IsString({ message: 'UF deve ser um texto' })
  @IsNotEmpty({ message: 'UF é obrigatória' })
  @MaxLength(2, { message: 'UF deve ter 2 caracteres' })
  state: string;

  @IsString({ message: 'Bairro deve ser um texto' })
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  @MaxLength(100, { message: 'Bairro muito longo' })
  district: string;

  @IsString({ message: 'Logradouro deve ser um texto' })
  @IsNotEmpty({ message: 'Logradouro é obrigatório' })
  @MaxLength(200, { message: 'Logradouro muito longo' })
  street: string;

  @IsString({ message: 'Número deve ser um texto' })
  @IsNotEmpty({ message: 'Número é obrigatório' })
  @MaxLength(20, { message: 'Número muito longo' })
  number: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  complement?: string;

  // Relationship fields (optional during creation if linked later)
  @IsNumber()
  @IsOptional()
  user_id?: number;

  @IsNumber()
  @IsOptional()
  address_type_id?: number;

  @IsBoolean()
  @IsOptional()
  is_primary?: boolean = false;
}
