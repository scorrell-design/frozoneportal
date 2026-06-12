import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ChevronRight, DollarSign, Search, Users } from 'lucide-react'
import { Avatar, Card, Chip, EmptyState, PageHeader, StatCard } from '../../components/ui'
import { FAMILIES, TIERS, playerById, tierById } from '../../data/seed'
import type { Family, TierId } from '../../lib/types'

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const STATUS_META: Record<Family['status'], { label: string; tone: 'grass' | 'clay' | 'ice' }> = {
  active: { label: 'Active', tone: 'grass' },
  past_due: { label: 'Past due', tone: 'clay' },
  paused: { label: 'Paused', tone: 'ice' },
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
        active
          ? 'border-frost-400/60 bg-frost-400/15 text-frost-300'
          : 'border-ice-600/60 text-ice-300 hover:bg-ice-700/60 hover:text-ice-100'
      }`}
    >
      {children}
    </button>
  )
}

function MemberRow({ fam }: { fam: Family }) {
  const players = fam.playerIds.map((id) => playerById(id)).filter((p) => p !== undefined)
  const tier = tierById(fam.tier)
  const status = STATUS_META[fam.status]
  return (
    <Link
      to={`/owner/members/${fam.id}`}
      className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-ice-700/40"
    >
      <Avatar name={fam.parentName} hue={players[0]?.hue ?? 205} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ice-100">{fam.parentName}</p>
        <p className="truncate text-xs text-ice-400">
          {players.map((p) => p.name).join(', ')} · joined {fam.joined}
        </p>
      </div>
      <span className="hidden sm:block">
        <Chip tone={tier?.color ?? 'ice'}>{tier?.name}</Chip>
      </span>
      <Chip tone={status.tone}>{status.label}</Chip>
      <span className="tabular hidden w-20 shrink-0 text-right text-sm text-ice-200 md:block">{money(fam.storedBalance)}</span>
      <span className="tabular hidden w-20 shrink-0 text-right text-sm font-semibold text-gold-300 lg:block">
        {fam.rewardPoints.toLocaleString()}
      </span>
      <ChevronRight size={15} className="shrink-0 text-ice-500" aria-hidden />
    </Link>
  )
}

export default function MembersPage() {
  const [query, setQuery] = useState('')
  const [tierFilter, setTierFilter] = useState<TierId | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<Family['status'] | 'all'>('all')

  const totalMembers = TIERS.reduce((s, t) => s + t.members, 0)
  const mrr = TIERS.reduce((s, t) => s + t.price * t.members, 0)
  const pastDueCount = FAMILIES.filter((f) => f.status === 'past_due').length

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FAMILIES.filter((f) => {
      if (tierFilter !== 'all' && f.tier !== tierFilter) return false
      if (statusFilter !== 'all' && f.status !== statusFilter) return false
      if (!q) return true
      if (f.parentName.toLowerCase().includes(q)) return true
      return f.playerIds.some((id) => playerById(id)?.name.toLowerCase().includes(q))
    })
  }, [query, tierFilter, statusFilter])

  return (
    <div>
      <PageHeader
        eyebrow="Frozen Ropes Dawsonville"
        title="Member directory"
        sub="Every family in the building — tier, standing, balance, and points at a glance."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rise">
          <StatCard label="Total members" value={totalMembers} icon={<Users size={18} aria-hidden />} />
        </div>
        <div className="rise" style={{ animationDelay: '50ms' }}>
          <StatCard label="Monthly recurring revenue" value={mrr} format={usd} icon={<DollarSign size={18} aria-hidden />} />
        </div>
        <div className="rise" style={{ animationDelay: '100ms' }}>
          <StatCard label="Past-due families" value={pastDueCount} icon={<AlertCircle size={18} aria-hidden />} />
        </div>
      </div>

      <Card className="rise mt-4" >
        <div className="flex flex-col gap-3">
          <label className="relative block">
            <span className="sr-only">Search by parent or player name</span>
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ice-400" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by parent or player name…"
              className="w-full rounded-lg border border-ice-600/60 bg-ice-900 py-2 pl-9 pr-3 text-sm text-ice-100 placeholder:text-ice-500 focus:border-frost-400/60"
            />
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="eyebrow mr-1 text-ice-400">Tier</span>
            <FilterPill active={tierFilter === 'all'} onClick={() => setTierFilter('all')}>All tiers</FilterPill>
            {TIERS.map((t) => (
              <FilterPill key={t.id} active={tierFilter === t.id} onClick={() => setTierFilter(t.id)}>
                {t.name}
              </FilterPill>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="eyebrow mr-1 text-ice-400">Status</span>
            <FilterPill active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>All statuses</FilterPill>
            {(Object.keys(STATUS_META) as Family['status'][]).map((s) => (
              <FilterPill key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
                {STATUS_META[s].label}
              </FilterPill>
            ))}
          </div>
        </div>
      </Card>

      <Card className="rise mt-4" pad={false} >
        <div className="flex items-center justify-between gap-3 border-b border-ice-600/30 px-3 py-2.5">
          <p className="eyebrow text-ice-400">
            {results.length} {results.length === 1 ? 'family' : 'families'}
          </p>
          <div className="hidden items-center gap-3 md:flex">
            <span className="eyebrow w-20 text-right text-ice-500">Balance</span>
            <span className="eyebrow hidden w-20 text-right text-ice-500 lg:block">Points</span>
            <span className="w-[15px]" aria-hidden />
          </div>
        </div>
        {results.length > 0 ? (
          <div className="divide-y divide-ice-600/20">
            {results.map((f) => <MemberRow key={f.id} fam={f} />)}
          </div>
        ) : (
          <div className="p-4">
            <EmptyState
              title="No members match"
              hint="Try a different name, or clear the tier and status filters to see the full directory."
            />
          </div>
        )}
      </Card>
    </div>
  )
}
