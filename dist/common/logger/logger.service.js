"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLogger = void 0;
const common_1 = require("@nestjs/common");
const pino_1 = require("pino");
let AppLogger = class AppLogger {
    logger;
    constructor() {
        this.logger = (0, pino_1.default)({
            level: process.env.LOG_LEVEL || 'info',
            transport: process.env.NODE_ENV !== 'production'
                ? { target: 'pino-pretty', options: { colorize: true } }
                : undefined,
            formatters: {
                level: (label) => ({ level: label }),
            },
            base: {
                app: 'lo_api',
                env: process.env.NODE_ENV || 'development',
            },
        });
    }
    log(message, context) {
        this.logger.info({ context }, message);
    }
    error(message, trace, context) {
        this.logger.error({ trace, context }, message);
    }
    warn(message, context) {
        this.logger.warn({ context }, message);
    }
    debug(message, context) {
        this.logger.debug({ context }, message);
    }
    verbose(message, context) {
        this.logger.trace({ context }, message);
    }
    info(message, context) {
        this.logger.info({ context }, message);
    }
    child(bindings) {
        return this.logger.child(bindings);
    }
};
exports.AppLogger = AppLogger;
exports.AppLogger = AppLogger = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppLogger);
//# sourceMappingURL=logger.service.js.map