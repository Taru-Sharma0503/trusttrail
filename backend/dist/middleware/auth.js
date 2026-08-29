import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env.js';
import { ApiError } from '../utils/errors.js';
export const requireAuth = (req, _res, next) => { const token = req.header('authorization')?.replace(/^Bearer\s+/i, ''); if (!token)
    return next(new ApiError(401, 'UNAUTHENTICATED', 'Authentication is required')); try {
    const claims = jwt.verify(token, env.JWT_SECRET);
    req.auth = { userId: claims.sub, walletAddress: claims.walletAddress, role: claims.role };
    next();
}
catch {
    next(new ApiError(401, 'INVALID_TOKEN', 'Authentication token is invalid or expired'));
} };
const NGO_ROLES = [Role.NGO_ADMIN, Role.NGO_SIGNATORY, Role.ADMIN];
export const requireNgo = (req, _res, next) => { if (!req.auth || ![Role.NGO_ADMIN, Role.NGO_SIGNATORY, Role.ADMIN].includes(req.auth.role))
    return next(new ApiError(403, 'FORBIDDEN', 'NGO authorization is required')); next(); };
