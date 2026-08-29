import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
export class ApiError extends Error { constructor(public status: number, public code: string, message: string) { super(message); } }
export const notFound = (_req: Request, _res: Response, next: NextFunction) => next(new ApiError(404, 'NOT_FOUND', 'Route not found'));
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => { const error = err instanceof ApiError ? err : err instanceof ZodError ? new ApiError(400, 'VALIDATION_ERROR', 'Invalid request data') : new ApiError(500, 'INTERNAL_ERROR', 'An unexpected error occurred'); if (error.status >= 500) console.error(err); res.status(error.status).json({ success: false, error: { code: error.code, message: error.message } }); };
