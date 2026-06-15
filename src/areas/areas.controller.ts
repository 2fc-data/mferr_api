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
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { RulesGuard } from '../auth/rules.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Rules } from '../auth/rules.decorator';

@Controller('areas')
@UseGuards(JwtAuthGuard, RulesGuard)
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @Rules('settings.manage')
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(createAreaDto);
  }

  @Get()
  // No specific role for viewing areas? Maybe public or basic auth.
  // For now assuming open or requiring 'dashboard.view' just to test.
  // Using 'settings.manage' as it seems administrative.
  @Rules('settings.manage')
  findAll() {
    return this.areasService.findAll();
  }

  @Get(':id')
  @Rules('settings.manage')
  findOne(@Param('id') id: string) {
    return this.areasService.findOne(+id);
  }

  @Patch(':id')
  @Rules('settings.manage')
  update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areasService.update(+id, updateAreaDto);
  }

  @Delete(':id')
  @Rules('settings.manage')
  remove(@Param('id') id: string) {
    return this.areasService.remove(+id);
  }
}
