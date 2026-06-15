import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateStatusDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsNumber()
  stage_id?: number;
}
