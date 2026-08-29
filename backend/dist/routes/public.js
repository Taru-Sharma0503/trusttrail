import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../utils/errors.js';
export const publicRouter = Router();
publicRouter.get('/campaigns/:id/transparency', async (req, res, next) => { try {
    const c = await prisma.campaign.findUnique({ where: { id: req.params.id }, include: { ngo: true, categories: true, milestones: true, donations: { orderBy: { timestamp: 'asc' } }, withdrawals: { include: { category: true, milestone: true, receipts: true }, orderBy: { timestamp: 'asc' } }, receipts: true } });
    if (!c)
        throw new ApiError(404, 'CAMPAIGN_NOT_FOUND', 'Campaign not found');
    const totalDonated = c.donations.filter(d => d.status === 'CONFIRMED').reduce((s, d) => s + Number(d.amount), 0);
    const totalReleased = c.withdrawals.reduce((s, w) => s + Number(w.amount), 0);
    const auditTrail = [...c.donations.map(d => ({ type: 'DONATION', at: d.timestamp, transactionHash: d.transactionHash, amount: d.amount, status: d.status })), ...c.withdrawals.map(w => ({ type: 'WITHDRAWAL', at: w.timestamp, transactionHash: w.transactionHash, amount: w.amount, category: w.category?.name, recipient: w.recipientWalletAddress, receipt: w.receipts[0] ?? null, anomaly: { flagged: w.flagged, severity: w.anomalySeverity, reason: w.anomalyReason } }))].sort((a, b) => +new Date(a.at) - +new Date(b.at));
    res.json({ success: true, data: { campaign: c, vault: { address: c.blockchainContractAddress, chainId: c.chainId }, totalDonated, totalReleased, remainingBalance: totalDonated - totalReleased, categories: c.categories, milestones: c.milestones, donations: c.donations, withdrawals: c.withdrawals, receipts: c.receipts, anomalyFlags: c.withdrawals.filter(w => w.flagged), auditTrail } });
}
catch (e) {
    next(e);
} });
