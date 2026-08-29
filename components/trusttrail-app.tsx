'use client'
import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  ChevronRight,
  FileCheck2,
  HandCoins,
  Landmark,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
  Zap,
} from 'lucide-react'
import {
  campaigns,
  budgets,
  demoTransaction,
  milestones,
  money,
  percent,
  transactions,
  type Campaign,
  type CategoryBudget,
} from '@/lib/trusttrail-data'

type View = 'home' | 'campaigns' | 'transparency' | 'dashboard' | 'ngo'
type ModalType = 'wallet' | 'donate' | 'reject'

function Logo() {
  return (
    <div className="flex items-center gap-2.5 font-semibold tracking-tight">
      <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <ShieldCheck size={18} />
      </span>
      <span className="text-[17px]">
        Trust<span className="text-primary">Trail</span>
      </span>
    </div>
  )
}

function Status({ children, amber = false }: { children: React.ReactNode; amber?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        amber ? 'bg-amber/10 text-amber' : 'bg-primary/10 text-primary'
      }`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  )
}

function Stat({
  label,
  value,
  icon: Icon,
  note,
}: {
  label: string
  value: string
  icon: React.ElementType
  note?: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="grid size-8 place-items-center rounded-lg bg-secondary text-primary">
          <Icon size={16} />
        </span>
      </div>
      <div className="font-mono text-2xl font-semibold tracking-tight">{value}</div>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </div>
  )
}

function Header({
  onNavigate,
  onWallet,
  onDemo,
  onHowItWorks,
}: {
  onNavigate: (v: View) => void
  onWallet: () => void
  onDemo: () => void
  onHowItWorks: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-brand-blue/20 bg-brand-blue text-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <button onClick={() => onNavigate('home')} aria-label="TrustTrail home">
          <Logo />
        </button>
        <nav className="hidden items-center gap-7 text-sm text-white/80 md:flex">
          <button onClick={() => onNavigate('campaigns')} className="hover:text-white">
            Explore
          </button>
          <button onClick={onHowItWorks} className="hover:text-white">
            How it works
          </button>
          <button onClick={() => onNavigate('transparency')} className="hover:text-white">
            Transparency
          </button>
          <button onClick={() => onNavigate('ngo')} className="hover:text-white">
            For NGOs
          </button>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <button
            className="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
            onClick={() => onNavigate('dashboard')}
          >
            Dashboard
          </button>
          <button
            onClick={onWallet}
            className="rounded-lg border border-white/35 px-3.5 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            <WalletCards className="mr-2 inline" size={15} />
            Connect wallet
          </button>
          <button
            onClick={onDemo}
            className="rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Zap className="mr-1.5 inline" size={14} />
            Launch demo
          </button>
        </div>
        <button className="rounded-lg p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Open navigation">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border bg-background p-4 text-foreground md:hidden">
          <button
            className="p-3 text-left"
            onClick={() => {
              onNavigate('campaigns')
              setOpen(false)
            }}
          >
            Explore campaigns
          </button>
          <button
            className="p-3 text-left"
            onClick={() => {
              onHowItWorks()
              setOpen(false)
            }}
          >
            How it works
          </button>
          <button
            className="p-3 text-left"
            onClick={() => {
              onNavigate('transparency')
              setOpen(false)
            }}
          >
            Transparency
          </button>
          <button
            className="p-3 text-left"
            onClick={() => {
              onNavigate('dashboard')
              setOpen(false)
            }}
          >
            My dashboard
          </button>
          <button
            className="m-2 rounded-lg bg-primary p-3 text-primary-foreground"
            onClick={() => {
              onDemo()
              setOpen(false)
            }}
          >
            Launch demo
          </button>
        </nav>
      )}
    </header>
  )
}

function CampaignCard({ campaign, onView }: { campaign: Campaign; onView: () => void }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <img src={campaign.image || '/placeholder.svg'} alt="" className="h-40 w-full object-cover" />
      <div className="p-5">
        <div className="mb-3 flex justify-between gap-3">
          <div>
            <h3 className="font-semibold">{campaign.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {campaign.ngo} · {campaign.location}
            </p>
          </div>
          <Status>{campaign.score}/100</Status>
        </div>
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-mono font-medium">{money(campaign.raised)}</span>
          <span className="text-muted-foreground">of {money(campaign.target)}</span>
        </div>
        <div className="h-2 rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${percent(campaign.raised, campaign.target || 1)}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {campaign.donors} donors · {campaign.milestones} milestones
        </p>
        <button
          onClick={onView}
          className="mt-5 flex w-full items-center justify-center gap-1 rounded-lg border border-border py-2.5 text-sm font-medium"
        >
          View transparency <ChevronRight size={15} />
        </button>
      </div>
    </article>
  )
}

function Home({ navigate }: { navigate: (v: View) => void }) {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-16 lg:px-8 lg:pt-24">
        <Status>Public by design</Status>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
          Trust every donation.
          <br />
          <span className="text-primary">Verify every rupee.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg text-muted-foreground">
          TrustTrail makes NGO donations publicly verifiable through milestone-based releases and transparent
          spending rules.
        </p>
        <button
          onClick={() => navigate('campaigns')}
          className="mt-8 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
        >
          Explore campaigns <ArrowRight className="ml-2 inline" size={16} />
        </button>
      </section>
      <section className="border-y border-border bg-secondary/45">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-5 py-5 lg:grid-cols-4 lg:px-8">
          <Stat label="Campaign records" value={String(campaigns.length)} icon={Landmark} />
          <Stat label="Public audit" value="Enabled" icon={FileCheck2} />
          <Stat label="Read path" value="Demo" icon={BarChart3} />
          <Stat label="Traceability" value="Public" icon={BadgeCheck} />
        </div>
      </section>
      <section id="how" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <p className="text-sm font-medium text-primary">How it works</p>
        <h2 className="mt-2 text-3xl font-semibold">Donate. Verify. Track.</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {[
            { title: 'Donate to a campaign', body: 'Funds enter a public escrow vault the moment you contribute.' },
            {
              title: 'NGOs submit milestones',
              body: 'Every release requires proof, which is hashed and publicly attached.',
            },
            {
              title: 'Anyone can verify',
              body: 'The full audit trail — donations, releases, and receipts — stays public.',
            },
          ].map((step) => (
            <div key={step.title} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Open campaigns</p>
            <h2 className="mt-2 text-3xl font-semibold">Give with visibility.</h2>
          </div>
          <button onClick={() => navigate('campaigns')} className="text-sm text-primary">
            View all campaigns
          </button>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {campaigns.slice(0, 3).map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} onView={() => navigate('transparency')} />
          ))}
        </div>
      </section>
    </main>
  )
}

function Campaigns({ navigate }: { navigate: (v: View) => void }) {
  const [q, setQ] = useState('')
  const filtered = useMemo(
    () =>
      campaigns.filter((campaign) =>
        `${campaign.title} ${campaign.ngo} ${campaign.category}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  )
  return (
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <p className="text-sm font-medium text-primary">Campaign explorer</p>
      <h1 className="mt-3 text-4xl font-semibold">Find a cause you can follow.</h1>
      <label className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-card px-3">
        <Search size={17} />
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search campaigns or NGOs"
          className="w-full bg-transparent py-3 text-sm outline-none"
        />
      </label>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} onView={() => navigate('transparency')} />
        ))}
      </div>
    </main>
  )
}

function BudgetCard({ item }: { item: CategoryBudget }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex justify-between">
        <span className="font-medium">{item.name}</span>
        <LockKeyhole size={15} className="text-primary" />
      </div>
      <div className="mt-4 flex justify-between text-xs text-muted-foreground">
        <span>Spent {money(item.spent)}</span>
        <span>Allocated {money(item.allocated)}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-secondary">
        <div
          className="h-full rounded-full"
          style={{ width: `${percent(item.spent, item.allocated || 1)}%`, background: item.color }}
        />
      </div>
    </div>
  )
}

function Transparency({ onDonate, onReject }: { onDonate: () => void; onReject: () => void }) {
  const campaign = campaigns[0]
  const raised = campaign.raised
  const released = 420000
  const balance = raised - released
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Status>Publicly verifiable</Status>
            <span className="font-mono text-xs text-muted-foreground">Campaign ID · {campaign.id}</span>
          </div>
          <h1 className="mt-4 text-4xl font-semibold">{campaign.title}</h1>
          <p className="mt-2 text-muted-foreground">
            by {campaign.ngo} · {campaign.location}
          </p>
        </div>
        <button
          onClick={onDonate}
          className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
        >
          Donate to this campaign
        </button>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total raised" value={money(raised)} icon={HandCoins} />
        <Stat label="Total released" value={money(released)} icon={BarChart3} />
        <Stat label="Remaining escrow" value={money(balance)} icon={LockKeyhole} />
        <Stat label="Milestones" value={String(milestones.length)} icon={BadgeCheck} />
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-medium text-primary">Category budgets</p>
          <div className="mt-4 grid gap-3">
            {budgets.map((budget) => (
              <BudgetCard key={budget.name} item={budget} />
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-medium text-primary">Milestone timeline</p>
          <div className="mt-5 space-y-4">
            {milestones.map((milestone) => (
              <div key={milestone.title} className="border-l-2 border-primary pl-4">
                <div className="flex justify-between gap-3">
                  <b>{milestone.title}</b>
                  <span className="font-mono text-sm">{money(milestone.amount)}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {milestone.detail} {milestone.date && `· ${milestone.date}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="p-5">
          <p className="text-sm font-medium text-primary">Immutable record</p>
          <h2 className="text-xl font-semibold">Public audit trail</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="border-y border-border bg-secondary/50 text-xs text-muted-foreground">
              <tr>
                {['Date', 'Type', 'Category', 'Amount', 'Status', 'Hash'].map((label) => (
                  <th key={label} className="px-5 py-3">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.hash} className="border-b border-border">
                  <td className="px-5 py-4">{transaction.date}</td>
                  <td className="px-5 py-4">{transaction.type}</td>
                  <td className="px-5 py-4">{transaction.category}</td>
                  <td className="px-5 py-4 font-mono">{money(transaction.amount)}</td>
                  <td className="px-5 py-4">
                    <Status>{transaction.status}</Status>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-primary">{transaction.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <button onClick={onReject} className="mt-5 text-sm text-muted-foreground underline">
        See a simulated rejected withdrawal
      </button>
    </main>
  )
}

function Dashboard({ ngo = false, onReject }: { ngo?: boolean; onReject: () => void }) {
  const stats = ngo
    ? ([
        ['Total funds', '₹12.8L', Landmark],
        ['In escrow', '₹4.2L', LockKeyhole],
        ['Released', '₹8.6L', BadgeCheck],
        ['Active campaigns', '6', BarChart3],
      ] as const)
    : ([
        ['Total donated', '₹18,500', HandCoins],
        ['Active campaigns', '4', Landmark],
        ['Impact delivered', '3 milestones', BadgeCheck],
        ['Receipts verified', '100%', FileCheck2],
      ] as const)

  const rows = ngo ? campaigns : [campaigns[0], campaigns[1]]

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-primary">{ngo ? 'NGO workspace' : 'Donor dashboard'}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            {ngo ? 'Good morning, HealthBridge.' : 'Your impact, in view.'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {ngo
              ? 'Manage campaigns, releases, and public accountability.'
              : 'Follow every donation from your wallet to the people it helps.'}
          </p>
        </div>
        <button onClick={onReject} className="hidden rounded-lg border border-border px-3 py-2 text-sm font-medium sm:block">
          {ngo ? 'Create campaign' : 'Download receipts'}
        </button>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value, Icon]) => (
          <Stat key={label} label={label} value={value} icon={Icon} />
        ))}
      </div>
      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between p-5 md:p-7">
          <div>
            <p className="text-sm font-medium text-primary">
              {ngo ? 'Campaign management' : 'Donation history'}
            </p>
            <h2 className="mt-1 text-xl font-semibold">{ngo ? 'Your campaigns' : 'My donations'}</h2>
          </div>
          <MoreHorizontal size={20} className="text-muted-foreground" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="border-y border-border bg-secondary/50 text-xs text-muted-foreground">
              <tr>
                {(ngo
                  ? ['Campaign', 'Raised', 'Escrow', 'Spent', 'Milestones', 'Status']
                  : ['Campaign', 'Amount', 'Date', 'Status', 'Transaction']
                ).map((x) => (
                  <th key={x} className="px-5 py-3 font-medium">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-4">
                    <div className="font-medium">{c.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{ngo ? c.ngo : 'Campaign vault'}</div>
                  </td>
                  <td className="px-5 py-4 font-mono">{money(c.raised)}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {ngo ? money(Math.max(0, c.raised - 320000)) : 'Aug 02, 2026'}
                  </td>
                  <td className="px-5 py-4">{ngo ? money(420000) : <Status>Verified</Status>}</td>
                  <td className="px-5 py-4">
                    {ngo ? `${c.milestones} milestones` : <span className="font-mono text-xs text-primary">0x4b7...2e10</span>}
                  </td>
                  {ngo && (
                    <td className="px-5 py-4">
                      <Status>Active</Status>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex gap-3">
          <Sparkles className="mt-0.5 shrink-0 text-primary" size={19} />
          <div>
            <h3 className="font-semibold">
              {ngo ? 'One action needs your attention' : 'Your latest donation is moving'}
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {ngo
                ? 'Respond to the medium-severity medical supplies anomaly before the next release review.'
                : 'Your ₹5,000 donation entered the escrow vault and is linked to Milestone 2.'}
            </p>
            <button onClick={onReject} className="mt-3 text-sm font-medium text-primary">
              {ngo ? 'Review anomaly' : 'Track your money'} <ArrowRight className="ml-1 inline" size={14} />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

function Modal({
  type,
  close,
  onSuccess,
}: {
  type: ModalType
  close: () => void
  onSuccess?: () => void
}) {
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('5000')
  const isReject = type === 'reject'

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              {isReject ? 'Smart contract response' : type === 'wallet' ? 'Connect a wallet' : step === 4 ? 'Verified donation' : 'Support this campaign'}
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              {isReject
                ? 'Transaction rejected'
                : type === 'wallet'
                  ? 'Choose your access'
                  : step === 4
                    ? 'Donation Verified'
                    : `Step ${step} of 3`}
            </h2>
          </div>
          <button onClick={close} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary" aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {isReject ? (
          <>
            <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-5">
              <div className="flex items-center gap-2 font-semibold text-destructive">
                <AlertTriangle size={18} /> Category spending limit exceeded
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Allowed</p>
                  <p className="mt-1 font-mono text-lg">₹1,00,000</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Requested</p>
                  <p className="mt-1 font-mono text-lg">₹1,50,000</p>
                </div>
              </div>
              <div className="mt-4 border-t border-destructive/20 pt-4 text-sm">
                <span className="text-muted-foreground">Exceeded by </span>
                <b>₹50,000</b>
              </div>
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-xl bg-secondary p-4">
              <LockKeyhole className="mt-0.5 text-primary" size={17} />
              <p className="text-sm leading-6">
                <b>Blocked by Smart Contract.</b>
                <br />
                <span className="text-muted-foreground">Medical Supplies has an immutable ₹1,00,000 maximum.</span>
              </p>
            </div>
            <button onClick={close} className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground">
              Understood
            </button>
          </>
        ) : type === 'wallet' ? (
          <div className="mt-6 space-y-2">
            {['Demo Wallet', 'MetaMask', 'WalletConnect'].map((x, i) => (
              <button
                key={x}
                onClick={close}
                className="flex w-full items-center justify-between rounded-xl border border-border p-4 text-left hover:bg-secondary"
              >
                <span className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
                    <WalletCards size={17} />
                  </span>
                  <span>
                    <b className="block text-sm">{x}</b>
                    <small className="text-xs text-muted-foreground">
                      {i === 0 ? 'Recommended for this demo' : 'Connect securely'}
                    </small>
                  </span>
                </span>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        ) : step === 4 ? (
          <div className="mt-6 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
              <Check size={30} />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Your donation has entered the campaign&apos;s smart-contract vault.
            </p>
            <p className="mt-4 rounded-lg bg-secondary p-3 font-mono text-xs text-primary">
              Demo Transaction · 0xa71...d204
            </p>
            <button onClick={close} className="mt-5 w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground">
              Track your donation
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <label className="text-sm font-medium">Choose amount</label>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {['500', '1000', '2500', '5000'].map((x) => (
                <button
                  key={x}
                  onClick={() => setAmount(x)}
                  className={`rounded-lg border py-2.5 text-sm ${
                    amount === x ? 'border-primary bg-primary/10 text-primary' : 'border-border'
                  }`}
                >
                  ₹{Number(x).toLocaleString('en-IN')}
                </button>
              ))}
            </div>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-3 w-full rounded-lg border border-border bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
              aria-label="Custom donation amount"
            />
            <div className="mt-6 rounded-xl bg-secondary p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destination</span>
                <b>Campaign escrow vault</b>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <b>UPI / Card / Wallet</b>
              </div>
            </div>
            <button
              onClick={async () => {
                await demoTransaction('donation')
                if (step === 3) {
                  onSuccess?.()
                  setStep(4)
                } else {
                  setStep(step + 1)
                }
              }}
              className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground"
            >
              {step === 3 ? `Confirm ₹${Number(amount).toLocaleString('en-IN')}` : 'Continue'}{' '}
              <ArrowRight className="ml-1 inline" size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TrustTrailApp() {
  const [view, setView] = useState<View>('home')
  const [modal, setModal] = useState<ModalType | null>(null)
  const [mobileDemo, setMobileDemo] = useState(false)
  const [pendingScroll, setPendingScroll] = useState<string | null>(null)

  const navigate = (v: View) => {
    setView(v)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const launch = () => {
    setMobileDemo(true)
    setView('transparency')
  }

  const goToHowItWorks = () => {
    if (view === 'home') {
      document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      setPendingScroll('how')
      setView('home')
    }
  }

  useEffect(() => {
    if (pendingScroll && view === 'home') {
      const id = requestAnimationFrame(() => {
        document.getElementById(pendingScroll)?.scrollIntoView({ behavior: 'smooth' })
        setPendingScroll(null)
      })
      return () => cancelAnimationFrame(id)
    }
  }, [view, pendingScroll])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onNavigate={navigate} onWallet={() => setModal('wallet')} onDemo={launch} onHowItWorks={goToHowItWorks} />
      {view === 'home' && <Home navigate={navigate} />}
      {view === 'campaigns' && <Campaigns navigate={navigate} />}
      {view === 'transparency' && <Transparency onDonate={() => setModal('donate')} onReject={() => setModal('reject')} />}
      {view === 'dashboard' && <Dashboard onReject={() => setModal('reject')} />}
      {view === 'ngo' && <Dashboard ngo onReject={() => setModal('reject')} />}
      {modal && <Modal type={modal} close={() => setModal(null)} />}
      {mobileDemo && (
        <div className="fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full border border-primary/20 bg-card px-4 py-2.5 text-xs shadow-lg">
          <span className="size-2 animate-pulse rounded-full bg-primary" /> Demo mode active
          <button onClick={() => setMobileDemo(false)} className="text-muted-foreground">
            <X size={14} />
          </button>
        </div>
      )}
      <footer className="border-t border-border px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <Logo />
          <span>Infrastructure for accountable giving · Demo experience</span>
          <span>All blockchain activity shown is simulated.</span>
        </div>
      </footer>
    </div>
  )
}