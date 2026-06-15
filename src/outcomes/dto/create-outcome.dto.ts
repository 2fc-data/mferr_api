import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateOutcomeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  status_id?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
