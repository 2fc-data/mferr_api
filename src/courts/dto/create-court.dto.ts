import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCourtDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsBoolean()
  is_federal?: boolean;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
