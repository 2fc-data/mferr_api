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
import { OutcomesService } from './outcomes.service';
import { CreateOutcomeDto } from './dto/create-outcome.dto';
import { UpdateOutcomeDto } from './dto/update-outcome.dto';
import { RulesGuard } from '../auth/rules.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Rules } from '../auth/rules.decorator';

@Controller('outcomes')
@UseGuards(JwtAuthGuard, RulesGuard)
export class OutcomesController {
  constructor(private readonly outcomesService: OutcomesService) {}

  @Post()
  @Rules('settings.manage')
  create(@Body() createOutcomeDto: CreateOutcomeDto) {
    return this.outcomesService.create(createOutcomeDto);
  }

  @Get()
  @Rules('settings.manage', 'causes.view')
  findAll() {
    return this.outcomesService.findAll();
  }

  @Get(':id')
  @Rules('settings.manage')
  findOne(@Param('id') id: string) {
    return this.outcomesService.findOne(+id);
  }

  @Patch(':id')
  @Rules('settings.manage')
  update(@Param('id') id: string, @Body() updateOutcomeDto: UpdateOutcomeDto) {
    return this.outcomesService.update(+id, updateOutcomeDto);
  }

  @Delete(':id')
  @Rules('settings.manage')
  remove(@Param('id') id: string) {
    return this.outcomesService.remove(+id);
  }
}
