import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | object =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Erro interno no servidor. Tente novamente mais tarde.';

    // Handle Sequelize errors securely if NOT already an HttpException
    if (!(exception instanceof HttpException) && exception && typeof exception === 'object' && 'name' in exception) {
      if (exception.name === 'SequelizeUniqueConstraintError') {
        status = HttpStatus.CONFLICT;
        message = 'Este registro já existe no sistema.';
      } else if (exception.name === 'SequelizeValidationError') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Dados inválidos. Verifique os campos e tente novamente.';
      } else if (exception.name === 'SequelizeForeignKeyConstraintError') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Erro de relacionamento. O registro referenciado não existe.';
      }
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof message === 'string'
          ? message
          : (message as any).message || message,
      error:
        typeof message === 'object' ? (message as any).error || null : null,
    };

    // Log error for internal tracking
    if (status >= 500) {
      console.error(`[Error] ${request.method} ${request.url}`, exception);
    }

    response.status(status).json(errorResponse);
  }
}
