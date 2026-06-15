import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RulesGuard } from '../auth/rules.guard';
import { Rules } from '../auth/rules.decorator';

@Controller('addresses')
@UseGuards(JwtAuthGuard, RulesGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @Rules('users.create', 'users.edit')
  create(@Body() createAddressDto: CreateAddressDto, @Request() req) {
    return this.addressesService.create(
      createAddressDto,
      undefined,
      req.user?.id,
    );
  }

  @Get()
  @Rules('users.view')
  findAll() {
    return this.addressesService.findAll();
  }

  @Get(':id')
  @Rules('users.view')
  findOne(@Param('id') id: string) {
    return this.addressesService.findOne(+id);
  }

  @Get('user/:userId')
  @Rules('users.view')
  findByUser(@Param('userId') userId: string) {
    return this.addressesService.findByUser(+userId);
  }

  @Patch(':id')
  @Rules('users.edit')
  update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Request() req,
  ) {
    return this.addressesService.update(+id, updateAddressDto, req.user?.id);
  }

  @Delete(':id')
  @Rules('users.edit', 'users.delete')
  remove(@Param('id') id: string, @Request() req) {
    return this.addressesService.remove(+id, req.user?.id);
  }
}
