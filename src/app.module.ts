import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';

import { AreasModule } from './areas/areas.module';
import { ProfilesModule } from './profiles/profiles.module';
import { RulesModule } from './rules/rules.module';
import { StatusModule } from './status/status.module';
import { StagesModule } from './stages/stages.module';
import { OutcomesModule } from './outcomes/outcomes.module';
import { StatusTasksModule } from './status_tasks/status_tasks.module';
import { CourtsModule } from './courts/courts.module';
import { DivisionsModule } from './divisions/divisions.module';
import { UsersModule } from './users/users.module';
import { CausesModule } from './causes/causes.module';
import { CityModule } from './city/city.module';
import { CauseUsersModule } from './cause_users/cause_users.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuditModule } from './audit/audit.module';
import { AddressesModule } from './addresses/addresses.module';
import { LookupsModule } from './lookups/lookups.module';

@Module({
  imports: [
    CommonModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadModels: true,
        synchronize: false, // Production-safe (use migrations)
        define: {
          underscored: true,
          timestamps: true,
          paranoid: false, // disabled globally, enable per model
          createdAt: 'created_at',
          updatedAt: 'updated_at',
          deletedAt: 'deleted_at',
        },
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    AreasModule,
    ProfilesModule,
    RulesModule,
    StatusModule,
    StagesModule,
    OutcomesModule,
    StatusTasksModule,
    CourtsModule,
    DivisionsModule,
    UsersModule,
    CausesModule,
    CityModule,
    CauseUsersModule,
    AuthModule,
    DashboardModule,
    AuditModule,
    AddressesModule,
    LookupsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
