import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StatusTasksService } from './status_tasks.service';
import { CreateStatusTaskDto } from './dto/create-status-task.dto';
import { UpdateStatusTaskDto } from './dto/update-status-task.dto';

@Controller('status-tasks')
export class StatusTasksController {
  constructor(private readonly statusTasksService: StatusTasksService) {}

  @Post()
  create(@Body() createStatusTaskDto: CreateStatusTaskDto) {
    return this.statusTasksService.create(createStatusTaskDto);
  }

  @Get()
  findAll() {
    return this.statusTasksService.findAll();
  }

  @Get('status/:statusId')
  findByStatus(@Param('statusId') statusId: string) {
    return this.statusTasksService.findByStatus(+statusId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusTasksService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStatusTaskDto: UpdateStatusTaskDto,
  ) {
    return this.statusTasksService.update(+id, updateStatusTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusTasksService.remove(+id);
  }
}
