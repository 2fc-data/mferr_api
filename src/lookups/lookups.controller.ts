import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddressType } from '../database/models/address_type.model';
import { CauseRoleType } from '../database/models/cause_role_type.model';
import { PartySide } from '../database/models/party_side.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Lookups')
@Controller('lookups')
@UseGuards(JwtAuthGuard)
export class LookupsController {
  constructor(
    @InjectModel(AddressType)
    private addressTypeModel: typeof AddressType,
    @InjectModel(CauseRoleType)
    private causeRoleTypeModel: typeof CauseRoleType,
    @InjectModel(PartySide)
    private partySideModel: typeof PartySide,
  ) {}

  @Get('address-types')
  getAddressTypes() {
    return this.addressTypeModel.findAll({ where: { is_active: true }, order: [['name', 'ASC']] });
  }

  @Get('cause-role-types')
  getCauseRoleTypes() {
    return this.causeRoleTypeModel.findAll({ where: { is_active: true }, order: [['name', 'ASC']] });
  }

  @Get('party-sides')
  getPartySides() {
    return this.partySideModel.findAll({ where: { is_active: true }, order: [['name', 'ASC']] });
  }
}

// Helper to use ApiTags if Swagger is installed, else ignore
function ApiTags(name: string) {
  return (target: any) => {};
}
