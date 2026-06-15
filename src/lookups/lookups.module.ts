import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LookupsController } from './lookups.controller';
import { AddressType } from '../database/models/address_type.model';
import { CauseRoleType } from '../database/models/cause_role_type.model';
import { PartySide } from '../database/models/party_side.model';

@Module({
  imports: [
    SequelizeModule.forFeature([AddressType, CauseRoleType, PartySide]),
  ],
  controllers: [LookupsController],
})
export class LookupsModule {}
