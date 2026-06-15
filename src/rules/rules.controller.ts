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
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { RulesGuard } from '../auth/rules.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Rules } from '../auth/rules.decorator';

@Controller('rules')
@UseGuards(JwtAuthGuard, RulesGuard)
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Post()
  @Rules('settings.manage')
  create(@Body() createRuleDto: CreateRuleDto) {
    return this.rulesService.create(createRuleDto);
  }

  @Get()
  @Rules('settings.manage', 'users.view')
  findAll() {
    return this.rulesService.findAll();
  }

  @Get(':id')
  @Rules('settings.manage')
  findOne(@Param('id') id: string) {
    return this.rulesService.findOne(+id);
  }

  @Patch(':id')
  @Rules('settings.manage')
  update(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto) {
    return this.rulesService.update(+id, updateRuleDto);
  }

  @Delete(':id')
  @Rules('settings.manage')
  remove(@Param('id') id: string) {
    return this.rulesService.remove(+id);
  }
}
