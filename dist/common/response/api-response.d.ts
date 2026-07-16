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
export declare class ApiResponseFormatter {
    static success<T>(res: Response, data: T, message?: string, statusCode?: number): Response<ApiResponse<T>>;
    static created<T>(res: Response, data: T, message?: string): Response<ApiResponse<T>>;
    static error(res: Response, message: string, statusCode?: number, errors?: any): Response<ApiResponse>;
    static paginated<T>(res: Response, data: T[], page: number, limit: number, total: number): Response<ApiResponse>;
    static noContent(res: Response): Response<ApiResponse>;
}
