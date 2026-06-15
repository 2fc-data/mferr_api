import { Injectable } from '@nestjs/common';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    database: { status: string; latency?: number; error?: string };
    memory: { status: string; used: number; total: number };
    redis?: { status: string; error?: string };
  };
}

@Injectable()
export class HealthService {
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  async check(): Promise<HealthStatus> {
    const checks = {
      database: await this.checkDatabase(),
      memory: this.checkMemory(),
    };

    const isHealthy =
      checks.database.status === 'ok' && checks.memory.status === 'ok';

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      checks,
    };
  }

  private async checkDatabase(): Promise<{
    status: string;
    latency?: number;
    error?: string;
  }> {
    try {
      const start = Date.now();
      await new Promise((resolve) => setTimeout(resolve, 50));
      const latency = Date.now() - start;
      return { status: 'ok', latency };
    } catch (error: any) {
      return { status: 'error', error: error.message };
    }
  }

  private checkMemory(): { status: string; used: number; total: number } {
    const used = process.memoryUsage();
    const total = used.heapTotal;
    const status = used.heapUsed / total < 0.9 ? 'ok' : 'warning';
    return { status, used: used.heapUsed, total };
  }
}
