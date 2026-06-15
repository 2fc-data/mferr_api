import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusTaskDto } from './create-status-task.dto';

export class UpdateStatusTaskDto extends PartialType(CreateStatusTaskDto) {}
