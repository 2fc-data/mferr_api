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
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
let HealthService = class HealthService {
    startTime;
    constructor() {
        this.startTime = Date.now();
    }
    async check() {
        const checks = {
            database: await this.checkDatabase(),
            memory: this.checkMemory(),
        };
        const isHealthy = checks.database.status === 'ok' && checks.memory.status === 'ok';
        return {
            status: isHealthy ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            uptime: Math.floor((Date.now() - this.startTime) / 1000),
            checks,
        };
    }
    async checkDatabase() {
        try {
            const start = Date.now();
            await new Promise((resolve) => setTimeout(resolve, 50));
            const latency = Date.now() - start;
            return { status: 'ok', latency };
        }
        catch (error) {
            return { status: 'error', error: error.message };
        }
    }
    checkMemory() {
        const used = process.memoryUsage();
        const total = used.heapTotal;
        const status = used.heapUsed / total < 0.9 ? 'ok' : 'warning';
        return { status, used: used.heapUsed, total };
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], HealthService);
//# sourceMappingURL=health.service.js.map