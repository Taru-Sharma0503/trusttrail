import { createHash } from 'node:crypto';
import { env } from '../config/env.js';
export async function storeProof(file) { const contentHash = createHash('sha256').update(file.buffer).digest('hex'); if (!env.IPFS_API_URL)
    return { contentHash, cid: `local-sha256-${contentHash}` }; const form = new FormData(); form.set('file', new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }), file.originalname); const response = await fetch(`${env.IPFS_API_URL.replace(/\/$/, '')}/api/v0/add`, { method: 'POST', body: form }); if (!response.ok)
    throw new Error(`IPFS upload failed: ${response.status}`); const raw = await response.text(); const data = JSON.parse(raw.trim().split('\n').at(-1) ?? '{}'); if (!data.Hash)
    throw new Error('IPFS upload returned no CID'); return { contentHash, cid: data.Hash }; }
