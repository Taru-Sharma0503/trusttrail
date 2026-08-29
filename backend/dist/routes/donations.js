import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../utils/errors.js';
export const donationRouter = Router();
const mask = (w) => `${w.slice(0, 6)}…${w.slice(-4)}`;
donationRouter.get('/:id/receipt', async (req, res, next) => { try {
    const d = await prisma.donation.findUnique({ where: { id: req.params.id }, include: { campaign: { include: { ngo: true } } } });
    if (!d)
        throw new ApiError(404, 'DONATION_NOT_FOUND', 'Donation not found');
    if (d.status !== 'CONFIRMED')
        throw new ApiError(409, 'DONATION_UNCONFIRMED', 'A receipt is available after blockchain confirmation');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="trusttrail-donation-${d.id}.pdf"`);
    const pdf = new PDFDocument({ margin: 54 });
    pdf.pipe(res);
    pdf.fontSize(24).fillColor('#0b5d4b').text('TrustTrail');
    pdf.fillColor('#111827').fontSize(16).text('Blockchain Donation Receipt', { align: 'right' });
    pdf.moveDown(2).fontSize(12).text(`Campaign: ${d.campaign.name}`).text(`NGO: ${d.campaign.ngo.name}`).text(`Donation amount: ${d.amount.toString()}`).text(`Donation date: ${d.timestamp.toISOString()}`).text(`Donor wallet: ${mask(d.donorWalletAddress)}`).text(`Network chain ID: ${d.campaign.chainId}`).text(`Transaction hash: ${d.transactionHash}`).text(`Campaign contract: ${d.campaign.blockchainContractAddress ?? 'Not configured'}`);
    pdf.moveDown(2).fontSize(9).fillColor('#4b5563').text('This is a blockchain transaction receipt and is not automatically a government-recognized tax certificate.');
    pdf.end();
}
catch (e) {
    next(e);
} });
