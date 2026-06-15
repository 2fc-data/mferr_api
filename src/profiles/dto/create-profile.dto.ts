import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  rule_ids?: number[];
}
