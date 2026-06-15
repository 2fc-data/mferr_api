import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateRuleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
