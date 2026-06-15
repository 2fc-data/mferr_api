import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { Profile } from '../database/models/profile.model';
import { UserProfile } from '../database/models/user_profile.model';
import { ProfileRule } from '../database/models/profile_rule.model';

@Module({
  imports: [SequelizeModule.forFeature([Profile, UserProfile, ProfileRule])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
