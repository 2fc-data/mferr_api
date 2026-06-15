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
import { DivisionsService } from './divisions.service';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('divisions')
@UseGuards(JwtAuthGuard)
export class DivisionsController {
  constructor(private readonly divisionsService: DivisionsService) {}

  @Post()
  create(@Body() createDivisionDto: CreateDivisionDto) {
    return this.divisionsService.create(createDivisionDto);
  }

  @Get()
  findAll() {
    return this.divisionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.divisionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDivisionDto: UpdateDivisionDto,
  ) {
    return this.divisionsService.update(+id, updateDivisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.divisionsService.remove(+id);
  }
}
