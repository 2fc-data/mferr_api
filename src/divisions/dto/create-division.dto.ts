import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateDivisionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
