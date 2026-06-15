import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { RulesGuard } from '../auth/rules.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Rules } from '../auth/rules.decorator';

@Controller('courts')
@UseGuards(JwtAuthGuard, RulesGuard)
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) {}

  @Post()
  @Rules('settings.manage')
  create(@Body() createCourtDto: CreateCourtDto) {
    return this.courtsService.create(createCourtDto);
  }

  @Get()
  @Rules('settings.manage', 'causes.view')
  findAll(@Query('state') state?: string) {
    return this.courtsService.findAll(state);
  }

  @Get(':id')
  @Rules('settings.manage')
  findOne(@Param('id') id: string) {
    return this.courtsService.findOne(+id);
  }

  @Patch(':id')
  @Rules('settings.manage')
  update(@Param('id') id: string, @Body() updateCourtDto: UpdateCourtDto) {
    return this.courtsService.update(+id, updateCourtDto);
  }

  @Delete(':id')
  @Rules('settings.manage')
  remove(@Param('id') id: string) {
    return this.courtsService.remove(+id);
  }
}
