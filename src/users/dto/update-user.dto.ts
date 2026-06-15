import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsInt, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Override: on update, profile_ids is optional and CAN be empty (to clear all profiles)
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  profile_ids?: number[];
}
