import type { Campaign, CategoryBudget, Milestone } from '@/lib/trusttrail-data'

type ApiResponse<T> = { success: true; data: T }

export type ApiCampaign = {
  id: string; name: string; description?: string | null; targetAmount: string | number
  status: string; ngo?: { name: string }; _count?: { donations?: number; withdrawals?: number }
  categories?: unknown[]; milestones?: unknown[]
}

export type TransparencyData = {
  campaign: ApiCampaign
  totalDonated: string | number
  totalReleased: string | number
  remainingBalance: string | number
  categories: Array<{ name: string; allocationCap: string | number; spentAmount: string | number }>
  milestones: Array<{ title: string; targetAmount: string | number; status: string; description?: string | null; completedAt?: string | null; proofHash?: string | null }>
  auditTrail: Array<{ type: string; at: string; transactionHash: string; amount: string | number; status: string; category?: string; recipient?: string }>
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')
const images = [
  'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80',
]
const number = (value: string | number | null | undefined) => Number(value ?? 0)

export function campaignToCard(campaign: ApiCampaign, index = 0): Campaign {
  return { id: campaign.id, title: campaign.name, ngo: campaign.ngo?.name ?? 'Verified NGO', location: 'India', category: 'Community', raised: 0, target: number(campaign.targetAmount), donors: campaign._count?.donations ?? 0, milestones: campaign.milestones?.length ?? 0, currentMilestone: 'Public campaign record', score: 100, image: images[index % images.length] }
}

async function request<T>(path: string): Promise<T> {
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not configured')
  const response = await fetch(`${apiUrl}${path}`)
  if (!response.ok) throw new Error(`API request failed (${response.status})`)
  const body = await response.json() as ApiResponse<T>
  if (!body.success) throw new Error('API returned an unsuccessful response')
  return body.data
}

export const getCampaigns = () => request<ApiCampaign[]>('/api/campaigns')
export const getCampaign = (id: string) => request<ApiCampaign>(`/api/campaigns/${id}`)
export const getTransparency = (id: string) => request<TransparencyData>(`/api/public/campaigns/${id}/transparency`)
export function transparencyToBudgets(data: TransparencyData): CategoryBudget[] { return data.categories.map((item, index) => ({ name: item.name, allocated: number(item.allocationCap), spent: number(item.spentAmount), color: ['#2E8B57', '#F4B942', '#168F8B'][index % 3] })) }
export function transparencyToMilestones(data: TransparencyData): Milestone[] { return data.milestones.map((item) => ({ title: item.title, amount: number(item.targetAmount), status: item.status === 'RELEASED' ? 'completed' : item.status === 'SUBMITTED' || item.status === 'APPROVED' ? 'progress' : 'pending', detail: item.description ?? item.status, date: item.completedAt ? new Date(item.completedAt).toLocaleDateString('en-IN') : undefined, hash: item.proofHash ?? undefined })) }
