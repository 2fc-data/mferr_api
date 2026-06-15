import { IsString, Length } from 'class-validator';

export class CreateCityDto {
  @IsString()
  @Length(2, 150)
  name: string;

  @IsString()
  @Length(2, 2)
  uf: string;
}
