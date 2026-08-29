export type Campaign = {
  id: string
  title: string
  ngo: string
  location: string
  category: string
  raised: number
  target: number
  donors: number
  milestones: number
  currentMilestone: string
  score: number
  image: string
}

export type CategoryBudget = { name: string; allocated: number; spent: number; color: string }
export type Milestone = { title: string; amount: number; status: 'completed' | 'progress' | 'pending'; detail: string; date?: string; hash?: string }

export const campaigns: Campaign[] = [
  { id: 'demo', title: 'Emergency Medical Support', ngo: 'HealthBridge Foundation', location: 'Delhi', category: 'Healthcare', raised: 740000, target: 1000000, donors: 842, milestones: 4, currentMilestone: 'Community medical camp', score: 98, image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80' },
  { id: 'learn', title: 'Every Child Deserves A Classroom', ngo: 'Saksham Learning Trust', location: 'Rajasthan', category: 'Education', raised: 485000, target: 650000, donors: 316, milestones: 3, currentMilestone: 'Build learning spaces', score: 96, image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80' },
  { id: 'relief', title: 'Monsoon Relief Kitchens', ngo: 'Open Hands Collective', location: 'Assam', category: 'Disaster Relief', raised: 920000, target: 1200000, donors: 1204, milestones: 5, currentMilestone: 'Distribute food kits', score: 99, image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80' },
]

export const budgets: CategoryBudget[] = [
  { name: 'Medical Supplies', allocated: 400000, spent: 240000, color: '#2E8B57' },
  { name: 'Food & Nutrition', allocated: 200000, spent: 120000, color: '#F4B942' },
  { name: 'Transportation', allocated: 100000, spent: 60000, color: '#168F8B' },
]

export const milestones: Milestone[] = [
  { title: 'Procure medical equipment', amount: 200000, status: 'completed', detail: 'Receipt verified', date: 'Aug 08, 2026', hash: '0x1f9...c84a' },
  { title: 'Distribute medical supplies', amount: 150000, status: 'completed', detail: 'Proof submitted', date: 'Aug 18, 2026', hash: '0x62a...b193' },
  { title: 'Community medical camp', amount: 120000, status: 'progress', detail: 'In progress', date: 'Due Sep 05, 2026' },
  { title: 'Final impact report', amount: 70000, status: 'pending', detail: 'Pending' },
]

export const transactions = [
  { date: 'Aug 28, 2026', type: 'Withdrawal', category: 'Medical Supplies', amount: 85000, recipient: 'HealthBridge Wallet', hash: '0x83f...9a21', status: 'Verified' },
  { date: 'Aug 18, 2026', type: 'Milestone release', category: 'Food & Nutrition', amount: 120000, recipient: 'HealthBridge Wallet', hash: '0x62a...b193', status: 'Verified' },
  { date: 'Aug 08, 2026', type: 'Milestone release', category: 'Medical Supplies', amount: 200000, recipient: 'HealthBridge Wallet', hash: '0x1f9...c84a', status: 'Verified' },
  { date: 'Aug 02, 2026', type: 'Donation', category: 'Escrow vault', amount: 5000, recipient: 'Demo donor', hash: '0x4b7...2e10', status: 'Verified' },
]

export const money = (n: number) => `₹${new Intl.NumberFormat('en-IN').format(n)}`
export const percent = (a: number, b: number) => Math.round((a / b) * 100)
export const demoTransaction = async (action: string) => ({ action, hash: '0x' + Math.random().toString(16).slice(2, 10) + '...demo', simulated: true })
