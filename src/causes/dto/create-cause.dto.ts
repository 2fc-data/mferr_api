import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsDateString,
  IsBoolean,
  ArrayMinSize,
} from 'class-validator';

export class CreateCauseDto {
  @IsString()
  number: string;

  @IsNumber()
  court_id: number;

  @IsOptional()
  @IsNumber()
  division_id?: number;

  @IsOptional()
  @IsNumber()
  area_id?: number;

  @IsOptional()
  @IsNumber()
  current_stage_id?: number;

  @IsOptional()
  @IsNumber()
  current_status_id?: number;

  @IsOptional()
  @IsNumber()
  outcome_id?: number;

  @IsOptional()
  @IsNumber()
  city_id?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  total_value?: number;

  @IsOptional()
  @IsNumber()
  total_fees?: number;

  @IsOptional()
  @IsNumber()
  customer_amount?: number;

  @IsOptional()
  @IsNumber()
  percentage?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsArray()
  involved_users?: {
    user_id: number;
    role_type_id: number;
    party_side_id: number;
    is_primary?: boolean;
  }[];

  @IsDateString()
  process_date: string;

  @IsOptional()
  @IsBoolean()
  print_contract?: boolean;

  @IsOptional()
  closed_at?: Date;
}
