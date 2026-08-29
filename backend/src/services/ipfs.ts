import { createHash } from 'node:crypto';
import { env } from '../config/env.js';
export type StoredFile = { cid: string; contentHash: string };
export async function storeProof(file: Express.Multer.File): Promise<StoredFile> { const contentHash = createHash('sha256').update(file.buffer).digest('hex'); if (!env.IPFS_API_URL) return { contentHash, cid: `local-sha256-${contentHash}` }; const response = await fetch(`${env.IPFS_API_URL.replace(/\/$/, '')}/api/v0/add`, { method: 'POST', body: new Blob([file.buffer], { type: file.mimetype }) }); if (!response.ok) throw new Error(`IPFS upload failed: ${response.status}`); const data = await response.json() as { Hash?: string }; if (!data.Hash) throw new Error('IPFS upload returned no CID'); return { contentHash, cid: data.Hash }; }
