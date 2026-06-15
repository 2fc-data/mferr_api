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
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RulesGuard } from '../auth/rules.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Rules } from '../auth/rules.decorator';

@Controller('profiles')
@UseGuards(JwtAuthGuard, RulesGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @Rules('settings.manage')
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @Get()
  @Rules('users.view') // Viewing profiles is common for user management
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  @Rules('users.view')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(+id);
  }

  @Patch(':id')
  @Rules('settings.manage')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  @Rules('settings.manage')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
