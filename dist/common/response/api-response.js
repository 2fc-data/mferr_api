"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseFormatter = void 0;
class ApiResponseFormatter {
    static success(res, data, message, statusCode = 200) {
        return res.status(statusCode).json({
            status: 'success',
            message,
            data,
            timestamp: new Date().toISOString(),
        });
    }
    static created(res, data, message = 'Criado com sucesso') {
        return this.success(res, data, message, 201);
    }
    static error(res, message, statusCode = 500, errors) {
        return res.status(statusCode).json({
            status: 'error',
            message,
            ...(errors && { data: errors }),
            timestamp: new Date().toISOString(),
        });
    }
    static paginated(res, data, page, limit, total) {
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
    static noContent(res) {
        return res.status(204).json({
            status: 'success',
            timestamp: new Date().toISOString(),
        });
    }
}
exports.ApiResponseFormatter = ApiResponseFormatter;
//# sourceMappingURL=api-response.js.map