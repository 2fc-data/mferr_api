import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppLogger } from './logger/logger.service';
import { HealthService } from './health/health.service';
import { CacheService } from './cache/cache.service';
import { PermissionHelper } from './helpers/permission.helper';
import { User } from '../database/models/user.model';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [AppLogger, HealthService, CacheService, PermissionHelper],
  exports: [AppLogger, HealthService, CacheService, PermissionHelper],
})
export class CommonModule {}
