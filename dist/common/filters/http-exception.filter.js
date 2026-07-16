"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : 'Erro interno no servidor. Tente novamente mais tarde.';
        if (!(exception instanceof common_1.HttpException) && exception && typeof exception === 'object' && 'name' in exception) {
            if (exception.name === 'SequelizeUniqueConstraintError') {
                status = common_1.HttpStatus.CONFLICT;
                message = 'Este registro já existe no sistema.';
            }
            else if (exception.name === 'SequelizeValidationError') {
                status = common_1.HttpStatus.BAD_REQUEST;
                message = 'Dados inválidos. Verifique os campos e tente novamente.';
            }
            else if (exception.name === 'SequelizeForeignKeyConstraintError') {
                status = common_1.HttpStatus.BAD_REQUEST;
                message = 'Erro de relacionamento. O registro referenciado não existe.';
            }
        }
        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: typeof message === 'string'
                ? message
                : message.message || message,
            error: typeof message === 'object' ? message.error || null : null,
        };
        if (status >= 500) {
            console.error(`[Error] ${request.method} ${request.url}`, exception);
        }
        response.status(status).json(errorResponse);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map