import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env.js';
import { ApiError } from '../utils/errors.js';
import type { NextFunction, Request, Response } from 'express';
type Claims = { sub: string; walletAddress: string; role: Role };
export const requireAuth = (req: Request, _res: Response, next: NextFunction) => { const token = req.header('authorization')?.replace(/^Bearer\s+/i, ''); if (!token) return next(new ApiError(401, 'UNAUTHENTICATED', 'Authentication is required')); try { const claims = jwt.verify(token, env.JWT_SECRET) as Claims; req.auth = { userId: claims.sub, walletAddress: claims.walletAddress, role: claims.role }; next(); } catch { next(new ApiError(401, 'INVALID_TOKEN', 'Authentication token is invalid or expired')); } };
const NGO_ROLES: Role[] = [Role.NGO_ADMIN, Role.NGO_SIGNATORY, Role.ADMIN];
export const requireNgo = (req: Request, _res: Response, next: NextFunction) => { if (!req.auth || ![Role.NGO_ADMIN, Role.NGO_SIGNATORY, Role.ADMIN].includes(req.auth.role)) return next(new ApiError(403, 'FORBIDDEN', 'NGO authorization is required')); next(); };