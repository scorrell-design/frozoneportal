import { Link } from 'react-router-dom'
import {
  AlertTriangle, ArrowRight, BarChart3, CalendarClock, Gauge, LibraryBig,
  PackageOpen, Star, Store, TrendingUp, Users,
} from 'lucide-react'
import { Card, CardTitle, Chip, PageHeader, StatCard } from '../../components/ui'
import { TrendChart } from '../../components/charts'
import { BLUEPRINT, CLASSES, FAMILIES, MONTHS, PRODUCTS, staffById, tierById } from '../../data/seed'
import type { ProgramClass } from '../../lib/types'

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

const clock = (mins: number) => {
  const hh = Math.floor(mins / 60)
  const mm = mins % 60
  const ampm = hh >= 12 ? 'PM' : 'AM'
  const h12 = ((hh + 11) % 12) + 1
  return `${h12}:${String(mm).padStart(2, '0')} ${ampm}`
}

function ScheduleRow({ cls }: { cls: ProgramClass }) {
  const coach = staffById(cls.coachId)
  const [h, m] = cls.start.split(':').map(Number)
  const startMin = h * 60 + m
  const pct = Math.round((cls.enrolled.length / cls.capacity) * 100)
  return (
    <Link
      to="/owner/calendar"
      className="flex items-center gap-3 rounded-lg border border-transparent px-2 py-2.5 transition-colors hover:border-ice-600/50 hover:bg-ice-700/40"
    >
      <div className="w-[84px] shrink-0">
        <p className="tabular text-xs font-semibold text-frost-300">{clock(startMin)}</p>
        <p className="text-[11px] text-ice-400">{cls.durationMin} min</p>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ice-100">{cls.name}</p>
        <p className="truncate text-xs text-ice-400">{cls.cage} · {coach?.name ?? 'Staff'}</p>
      </div>
      <span className={`tabular shrink-0 text-xs font-semibold ${pct >= 100 ? 'text-clay-300' : pct >= 80 ? 'text-gold-300' : 'text-grass-400'}`}>
        {cls.enrolled.length}/{cls.capacity}
      </span>
    </Link>
  )
}

export default function DashboardPage() {
  const today = CLASSES.filter((c) => c.day === 4).sort((a, b) => a.start.localeCompare(b.start))
  const nextUp = CLASSES.filter((c) => c.day === 5).sort((a, b) => a.start.localeCompare(b.start))

  const pastDue = FAMILIES.filter((f) => f.status === 'past_due')
  const lowStock = PRODUCTS.filter((p) => p.stock < 10)

  const revenueLines = BLUEPRINT.filter((l) => l.group === 'revenue')
  const revTrend = MONTHS.map((m, i) => ({
    x: m,
    revenue: Math.round(revenueLines.reduce((sum, l) => sum + l.actual[i], 0) / 1000),
  }))
  const revMax = Math.ceil(Math.max(...revTrend.map((d) => d.revenue)) / 10) * 10

  const expiring = [
    { name: 'The Calhoun family', tier: 'All-Star', renews: 'Jun 18' },
    { name: 'The Vega family', tier: 'Prospect', renews: 'Jun 24' },
    { name: 'The Nakamura family', tier: 'Rookie', renews: 'Jun 30' },
  ]

  const stats = [
    { key: 'util', label: 'Cage utilization', value: 58, format: (n: number) => `${Math.round(n)}%`, delta: 6, icon: <Gauge size={18} aria-hidden /> },
    { key: 'mem', label: 'Active members', value: 124, format: (n: number) => String(Math.round(n)), delta: 12, deltaLabel: '', icon: <Users size={18} aria-hidden /> },
    { key: 'rev', label: 'Revenue MTD', value: 19400, format: usd, delta: 9, icon: <TrendingUp size={18} aria-hidden /> },
    { key: 'rr', label: 'Rock Ready participation', value: 64, format: (n: number) => `${Math.round(n)}%`, delta: 5, icon: <Star size={18} aria-hidden /> },
  ]

  const quickLinks = [
    { to: '/owner/library', icon: LibraryBig, label: 'The Library', sub: '35 years of curriculum, searchable' },
    { to: '/owner/blueprint', icon: BarChart3, label: 'The Blueprint', sub: 'P&L vs. network benchmarks' },
    { to: '/owner/pos', icon: Store, label: 'Point of Sale', sub: 'Register, transactions, inventory' },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Frozen Ropes Dawsonville"
        title="Run the day"
        sub="Friday, June 12 — month five of the launch. Here's the state of the building, Dana."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.key} className="rise" style={{ animationDelay: `${i * 50}ms` }}>
            <StatCard label={s.label} value={s.value} format={s.format} delta={s.delta} deltaLabel={s.deltaLabel} icon={s.icon} />
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Today at the facility */}
        <div className="rise" style={{ animationDelay: '100ms' }}>
          <Card>
            <CardTitle action={<Link to="/owner/calendar" className="text-xs font-semibold text-frost-300 hover:text-frost-200">Full calendar →</Link>}>
              Today at the facility
            </CardTitle>
            {today.length > 0 ? (
              <div className="space-y-0.5">
                {today.map((c) => <ScheduleRow key={c.id} cls={c} />)}
              </div>
            ) : (
              <p className="text-sm text-ice-400">No programs on the board today.</p>
            )}
            <p className="eyebrow mt-4 mb-1 flex items-center gap-1.5 text-ice-400">
              <CalendarClock size={13} aria-hidden /> Next up — Saturday
            </p>
            <div className="space-y-0.5">
              {nextUp.map((c) => <ScheduleRow key={c.id} cls={c} />)}
            </div>
          </Card>
        </div>

        {/* Alerts */}
        <div className="rise" style={{ animationDelay: '150ms' }}>
          <Card>
            <CardTitle action={<Chip tone="clay" icon={<AlertTriangle size={11} aria-hidden />}>{pastDue.length + lowStock.length + expiring.length} open</Chip>}>
              Needs your attention
            </CardTitle>

            <p className="eyebrow mb-1.5 text-clay-300">Past-due families</p>
            <div className="space-y-0.5">
              {pastDue.slice(0, 4).map((f) => (
                <Link key={f.id} to={`/owner/members/${f.id}`} className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-ice-700/40">
                  <span className="font-medium text-ice-100">{f.parentName}</span>
                  <span className="tabular text-xs text-clay-300">{usd(tierById(f.tier)?.price ?? 0)} due</span>
                </Link>
              ))}
              {pastDue.length > 4 && (
                <Link to="/owner/members" className="block px-2 py-1 text-xs font-semibold text-frost-300 hover:text-frost-200">
                  +{pastDue.length - 4} more in the directory →
                </Link>
              )}
            </div>

            <p className="eyebrow mt-4 mb-1.5 text-gold-300">Low stock</p>
            <div className="space-y-0.5">
              {lowStock.map((p) => (
                <Link key={p.id} to="/owner/pos" className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-ice-700/40">
                  <span className="flex items-center gap-2 font-medium text-ice-100"><PackageOpen size={14} className="text-ice-400" aria-hidden />{p.name}</span>
                  <span className="tabular text-xs text-gold-300">{p.stock} left</span>
                </Link>
              ))}
            </div>

            <p className="eyebrow mt-4 mb-1.5 text-frost-300">Memberships renewing</p>
            <div className="space-y-0.5">
              {expiring.map((e) => (
                <Link key={e.name} to="/owner/members" className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-ice-700/40">
                  <span className="font-medium text-ice-100">{e.name}</span>
                  <span className="text-xs text-ice-400">{e.tier} · {e.renews}</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Revenue trend */}
        <div className="rise" style={{ animationDelay: '200ms' }}>
          <Card>
            <CardTitle action={<Link to="/owner/blueprint" className="text-xs font-semibold text-frost-300 hover:text-frost-200">The Blueprint →</Link>}>
              Revenue trend
            </CardTitle>
            <p className="-mt-2 mb-3 text-xs text-ice-400">All revenue lines, Jan–Jun · $ thousands</p>
            <TrendChart data={revTrend} height={220} yDomain={[0, revMax]} unit="k" />
          </Card>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {quickLinks.map((q, i) => (
          <Link key={q.to} to={q.to} className="rise group" style={{ animationDelay: `${250 + i * 50}ms` }}>
            <Card className="flex items-center gap-4 transition-colors group-hover:border-frost-400/40">
              <q.icon size={22} className="shrink-0 text-frost-400" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="display text-base font-semibold uppercase tracking-wide text-ice-50">{q.label}</p>
                <p className="truncate text-xs text-ice-400">{q.sub}</p>
              </div>
              <ArrowRight size={16} className="shrink-0 text-ice-500 transition-colors group-hover:text-frost-300" aria-hidden />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
