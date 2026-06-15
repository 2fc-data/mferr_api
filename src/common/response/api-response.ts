import { Response } from 'express';

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  pagination?: PaginatedResponse<any>;
  timestamp: string;
}

export class ApiResponseFormatter {
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode = 200,
  ): Response<ApiResponse<T>> {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static created<T>(
    res: Response,
    data: T,
    message = 'Criado com sucesso',
  ): Response<ApiResponse<T>> {
    return this.success(res, data, message, 201);
  }

  static error(
    res: Response,
    message: string,
    statusCode = 500,
    errors?: any,
  ): Response<ApiResponse> {
    return res.status(statusCode).json({
      status: 'error',
      message,
      ...(errors && { data: errors }),
      timestamp: new Date().toISOString(),
    });
  }

  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
  ): Response<ApiResponse> {
    return res.status(200).json({
      status: 'success',
      data,
      pagination: {
        data,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      timestamp: new Date().toISOString(),
    });
  }

  static noContent(res: Response): Response<ApiResponse> {
    return res.status(204).json({
      status: 'success',
      timestamp: new Date().toISOString(),
    });
  }
}
