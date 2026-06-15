import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { RulesGuard } from '../auth/rules.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Rules } from '../auth/rules.decorator';

@Controller('status')
@UseGuards(JwtAuthGuard, RulesGuard)
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  @Rules('settings.manage')
  create(@Body() createStatusDto: CreateStatusDto) {
    return this.statusService.create(createStatusDto);
  }

  @Get()
  @Rules('settings.manage', 'causes.view')
  findAll() {
    return this.statusService.findAll();
  }

  @Get(':id')
  @Rules('settings.manage')
  findOne(@Param('id') id: string) {
    return this.statusService.findOne(+id);
  }

  @Patch(':id')
  @Rules('settings.manage')
  update(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.statusService.update(+id, updateStatusDto);
  }

  @Delete(':id')
  @Rules('settings.manage')
  remove(@Param('id') id: string) {
    return this.statusService.remove(+id);
  }
}
