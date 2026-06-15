import { PartialType } from '@nestjs/mapped-types';
import { CreateCauseUserDto } from './create-cause_user.dto';

export class UpdateCauseUserDto extends PartialType(CreateCauseUserDto) {}
