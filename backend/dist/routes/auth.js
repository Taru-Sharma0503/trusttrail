import { Router } from 'express';
import { z } from 'zod';
import { issueNonce, verifyWallet } from '../services/auth.js';
export const authRouter = Router();
const wallet = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
authRouter.post('/nonce', async (req, res, next) => { try {
    res.json({ success: true, data: await issueNonce(wallet.parse(req.body.walletAddress)) });
}
catch (e) {
    next(e);
} });
authRouter.post('/verify', async (req, res, next) => { try {
    const body = z.object({ walletAddress: wallet, signature: z.string().min(1) }).parse(req.body);
    res.json({ success: true, data: await verifyWallet(body.walletAddress, body.signature) });
}
catch (e) {
    next(e);
} });
