import { JsonRpcProvider } from 'ethers';
import { env } from '../config/env.js';
export type ChainEvent = { contractAddress: string; eventName: string; transactionHash: string; logIndex: number; blockNumber: number; payload: Record<string, unknown> };
export const provider = env.RPC_URL ? new JsonRpcProvider(env.RPC_URL, env.CHAIN_ID) : undefined;
export async function rpcHealth() { if (!provider) return { configured: false, connected: false }; try { const network = await provider.getNetwork(); return { configured: true, connected: Number(network.chainId) === env.CHAIN_ID }; } catch { return { configured: true, connected: false }; } }
/** Contract-specific event decoding belongs here after the final audited ABI is supplied. */
export async function readEvents(_fromBlock: number, _toBlock: number): Promise<ChainEvent[]> { if (!provider || !env.VAULT_FACTORY_ADDRESS) return []; return []; }
