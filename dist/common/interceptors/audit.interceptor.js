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
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const core_1 = require("@nestjs/core");
const audit_service_1 = require("../../audit/audit.service");
const auditable_decorator_1 = require("../decorators/auditable.decorator");
const audit_constants_1 = require("../constants/audit.constants");
let AuditInterceptor = class AuditInterceptor {
    reflector;
    auditService;
    constructor(reflector, auditService) {
        this.reflector = reflector;
        this.auditService = auditService;
    }
    intercept(context, next) {
        const auditMeta = this.reflector.get(auditable_decorator_1.AUDIT_KEY, context.getHandler());
        if (!auditMeta) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const { method, params, body } = request;
        if (method === 'POST' && auditMeta.action === 'CREATE') {
            return next.handle().pipe((0, operators_1.tap)(async (result) => {
                await this.handleCreate(auditMeta, result, user);
            }));
        }
        if (method === 'PATCH' && auditMeta.action === 'UPDATE') {
            return next.handle().pipe((0, operators_1.tap)(async (result) => {
                await this.handleUpdate(auditMeta, result, user, request.oldSnapshot);
            }));
        }
        if (method === 'DELETE' && auditMeta.action === 'DELETE') {
            return next.handle().pipe((0, operators_1.tap)(async () => {
                await this.handleDelete(auditMeta, params.id, user);
            }));
        }
        return next.handle();
    }
    async handleCreate(meta, result, user) {
        if (!user || !result)
            return;
        const labels = audit_constants_1.FIELD_LABELS[meta.resource];
        if (!labels)
            return;
        const changes = {};
        for (const [field, label] of Object.entries(labels)) {
            const value = result[field];
            if (value !== null &&
                value !== undefined &&
                value !== '' &&
                value !== 'vazio') {
                changes[label] = {
                    old: 'vazio',
                    new: typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : value,
                };
            }
        }
        await this.auditService.createRawLog(meta.resource, result.id, 'CREATE', changes, user.id);
    }
    async handleUpdate(meta, result, user, oldSnapshot) {
        if (!user || !result)
            return;
        const labels = audit_constants_1.FIELD_LABELS[meta.resource];
        if (!labels || !oldSnapshot)
            return;
        const changes = {};
        let hasChanges = false;
        const isVazio = (v) => v === null ||
            v === undefined ||
            v === '' ||
            String(v).trim() === '' ||
            String(v).trim() === 'null' ||
            v === 'vazio';
        for (const [field, label] of Object.entries(labels)) {
            const oldV = oldSnapshot[field];
            const newV = result[field];
            if (isVazio(oldV) && isVazio(newV))
                continue;
            const formattedOldV = typeof oldV === 'boolean'
                ? oldV
                    ? 'Sim'
                    : 'Não'
                : isVazio(oldV)
                    ? 'vazio'
                    : oldV;
            const formattedNewV = typeof newV === 'boolean'
                ? newV
                    ? 'Sim'
                    : 'Não'
                : isVazio(newV)
                    ? 'vazio'
                    : newV;
            if (String(formattedOldV) !== String(formattedNewV)) {
                changes[label] = {
                    old: formattedOldV,
                    new: formattedNewV,
                };
                hasChanges = true;
            }
        }
        if (hasChanges) {
            await this.auditService.createRawLog(meta.resource, result.id, 'UPDATE', changes, user.id);
        }
    }
    async handleDelete(meta, id, user) {
        if (!user || !id)
            return;
        await this.auditService.createRawLog(meta.resource, id, 'DELETE', { deleted: true }, user.id);
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        audit_service_1.AuditService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map