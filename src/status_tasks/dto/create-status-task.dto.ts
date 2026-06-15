import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStatusTaskDto {
  @IsInt()
  @IsNotEmpty()
  status_id: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsOptional()
  is_required?: boolean;

  @IsInt()
  @IsOptional()
  order_index?: number;
}
