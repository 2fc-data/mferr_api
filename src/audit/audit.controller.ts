import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get(':entityType/:entityId')
  findAll(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.auditService.findAllByEntity(entityType, Number(entityId));
  }
}
