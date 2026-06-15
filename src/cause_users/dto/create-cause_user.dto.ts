import { IsNumber } from 'class-validator';

export class CreateCauseUserDto {
  @IsNumber()
  cause_id: number;

  @IsNumber()
  user_id: number;
}
