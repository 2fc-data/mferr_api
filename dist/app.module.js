"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_1 = require("@nestjs/sequelize");
const serve_static_1 = require("@nestjs/serve-static");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const common_module_1 = require("./common/common.module");
const areas_module_1 = require("./areas/areas.module");
const profiles_module_1 = require("./profiles/profiles.module");
const rules_module_1 = require("./rules/rules.module");
const status_module_1 = require("./status/status.module");
const stages_module_1 = require("./stages/stages.module");
const outcomes_module_1 = require("./outcomes/outcomes.module");
const status_tasks_module_1 = require("./status_tasks/status_tasks.module");
const courts_module_1 = require("./courts/courts.module");
const divisions_module_1 = require("./divisions/divisions.module");
const users_module_1 = require("./users/users.module");
const causes_module_1 = require("./causes/causes.module");
const city_module_1 = require("./city/city.module");
const cause_users_module_1 = require("./cause_users/cause_users.module");
const auth_module_1 = require("./auth/auth.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const audit_module_1 = require("./audit/audit.module");
const addresses_module_1 = require("./addresses/addresses.module");
const lookups_module_1 = require("./lookups/lookups.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            common_module_1.CommonModule,
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            sequelize_1.SequelizeModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    dialect: 'mysql',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USER'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    autoLoadModels: true,
                    synchronize: false,
                    define: {
                        underscored: true,
                        timestamps: true,
                        paranoid: false,
                        createdAt: 'created_at',
                        updatedAt: 'updated_at',
                        deletedAt: 'deleted_at',
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            }),
            areas_module_1.AreasModule,
            profiles_module_1.ProfilesModule,
            rules_module_1.RulesModule,
            status_module_1.StatusModule,
            stages_module_1.StagesModule,
            outcomes_module_1.OutcomesModule,
            status_tasks_module_1.StatusTasksModule,
            courts_module_1.CourtsModule,
            divisions_module_1.DivisionsModule,
            users_module_1.UsersModule,
            causes_module_1.CausesModule,
            city_module_1.CityModule,
            cause_users_module_1.CauseUsersModule,
            auth_module_1.AuthModule,
            dashboard_module_1.DashboardModule,
            audit_module_1.AuditModule,
            addresses_module_1.AddressesModule,
            lookups_module_1.LookupsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map