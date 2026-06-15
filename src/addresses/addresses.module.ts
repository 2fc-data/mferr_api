import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { Address } from '../database/models/address.model';
import { UserAddress } from '../database/models/user_address.model';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [SequelizeModule.forFeature([Address, UserAddress]), AuditModule],
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressesModule {}
