import type { Role } from '@prisma/client';
declare global { namespace Express { interface Request { auth?: { userId: string; walletAddress: string; role: Role } } } }
export {};
