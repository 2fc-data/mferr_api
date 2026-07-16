import { LoggerService } from '@nestjs/common';
import pino from 'pino';
export declare class AppLogger implements LoggerService {
    private logger;
    constructor();
    log(message: string, context?: string): void;
    error(message: string, trace?: string, context?: string): void;
    warn(message: string, context?: string): void;
    debug(message: string, context?: string): void;
    verbose(message: string, context?: string): void;
    info(message: string, context?: string): void;
    child(bindings: Record<string, any>): pino.Logger<never, boolean>;
}
