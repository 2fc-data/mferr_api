import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../database/models/user.model';
import { Profile } from '../database/models/profile.model';
import { Address } from '../database/models/address.model';
import { UserAddress } from '../database/models/user_address.model';
import { AuditModule } from '../audit/audit.module';
import { PermissionHelper } from '../common/helpers/permission.helper';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Profile, Address, UserAddress]),
    AuditModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, PermissionHelper],
  exports: [UsersService, PermissionHelper],
})
export class UsersModule {}
