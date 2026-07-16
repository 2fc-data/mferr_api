import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuditService } from '../../audit/audit.service';
export declare class AuditInterceptor implements NestInterceptor {
    private reflector;
    private auditService;
    constructor(reflector: Reflector, auditService: AuditService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private handleCreate;
    private handleUpdate;
    private handleDelete;
}
