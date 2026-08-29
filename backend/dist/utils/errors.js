import { ZodError } from 'zod';
export class ApiError extends Error {
    status;
    code;
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
export const notFound = (_req, _res, next) => next(new ApiError(404, 'NOT_FOUND', 'Route not found'));
export const errorHandler = (err, _req, res, _next) => { const error = err instanceof ApiError ? err : err instanceof ZodError ? new ApiError(400, 'VALIDATION_ERROR', 'Invalid request data') : new ApiError(500, 'INTERNAL_ERROR', 'An unexpected error occurred'); if (error.status >= 500)
    console.error(err); res.status(error.status).json({ success: false, error: { code: error.code, message: error.message } }); };
