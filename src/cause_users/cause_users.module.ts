import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CauseUsersService } from './cause_users.service';
import { CauseUsersController } from './cause_users.controller';
import { CauseUser } from '../database/models/cause_user.model';

@Module({
  imports: [SequelizeModule.forFeature([CauseUser])],
  controllers: [CauseUsersController],
  providers: [CauseUsersService],
})
export class CauseUsersModule {}
