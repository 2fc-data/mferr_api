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
import { StagesService } from './stages.service';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { RulesGuard } from '../auth/rules.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Rules } from '../auth/rules.decorator';

@Controller('stages')
@UseGuards(JwtAuthGuard, RulesGuard)
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  @Post()
  @Rules('settings.manage')
  create(@Body() createStageDto: CreateStageDto) {
    return this.stagesService.create(createStageDto);
  }

  @Get()
  @Rules('settings.manage', 'causes.view')
  findAll() {
    return this.stagesService.findAll();
  }

  @Get(':id')
  @Rules('settings.manage')
  findOne(@Param('id') id: string) {
    return this.stagesService.findOne(+id);
  }

  @Patch(':id')
  @Rules('settings.manage')
  update(@Param('id') id: string, @Body() updateStageDto: UpdateStageDto) {
    return this.stagesService.update(+id, updateStageDto);
  }

  @Delete(':id')
  @Rules('settings.manage')
  remove(@Param('id') id: string) {
    return this.stagesService.remove(+id);
  }
}
