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
import { CauseUsersService } from './cause_users.service';
import { CreateCauseUserDto } from './dto/create-cause_user.dto';
import { UpdateCauseUserDto } from './dto/update-cause_user.dto';
import { RulesGuard } from '../auth/rules.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Rules } from '../auth/rules.decorator';

@Controller('cause-users')
@UseGuards(JwtAuthGuard, RulesGuard)
export class CauseUsersController {
  constructor(private readonly causeUsersService: CauseUsersService) {}

  @Post()
  @Rules('causes.edit')
  create(@Body() createCauseUserDto: CreateCauseUserDto) {
    return this.causeUsersService.create(createCauseUserDto);
  }

  @Get()
  @Rules('causes.view')
  findAll() {
    return this.causeUsersService.findAll();
  }

  @Get(':id')
  @Rules('causes.view')
  findOne(@Param('id') id: string) {
    return this.causeUsersService.findOne(+id);
  }

  @Patch(':id')
  @Rules('causes.edit')
  update(
    @Param('id') id: string,
    @Body() updateCauseUserDto: UpdateCauseUserDto,
  ) {
    return this.causeUsersService.update(+id, updateCauseUserDto);
  }

  @Delete(':id')
  @Rules('causes.edit')
  remove(@Param('id') id: string) {
    return this.causeUsersService.remove(+id);
  }
}
