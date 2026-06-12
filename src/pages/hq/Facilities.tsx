import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, Building2, Percent, Rocket, TrendingUp, Users } from 'lucide-react'
import { Card, CardTitle, Chip, PageHeader, StatCard } from '../../components/ui'
import { FACILITIES } from '../../data/seed'

type SortKey = 'revenueYtd' | 'members' | 'utilization' | 'rockReadyRate'

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'revenueYtd', label: 'Revenue' },
  { key: 'members', label: 'Members' },
  { key: 'utilization', label: 'Utilization' },
  { key: 'rockReadyRate', label: 'Rock Ready %' },
]

function UtilizationBar({ value }: { value: number }) {
  const color = value >= 75 ? 'bg-grass-400' : value >= 60 ? 'bg-gold-400' : 'bg-clay-400'
  return (
    <div className="flex items-center gap-2" role="img" aria-label={`Utilization ${value} percent`}>
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ice-700">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="tabular text-xs font-medium text-ice-200">{value}%</span>
    </div>
  )
}

export default function FacilitiesPage() {
  const [sortKey, setSortKey] = useState<SortKey>('revenueYtd')

  const revenueYtd = FACILITIES.reduce((s, f) => s + f.revenueYtd, 0)
  const members = FACILITIES.reduce((s, f) => s + f.members, 0)
  const avgUtil = FACILITIES.reduce((s, f) => s + f.utilization, 0) / FACILITIES.length
  const openCount = FACILITIES.filter((f) => f.status === 'open').length
  const launching = FACILITIES.filter((f) => f.status === 'launching')

  const rows = useMemo(
    () => [...FACILITIES].sort((a, b) => b[sortKey] - a[sortKey]),
    [sortKey],
  )

  return (
    <div>
      <PageHeader
        eyebrow="Frozen Ropes USA · Network HQ"
        title="The Network"
        sub="Every facility in the system — who runs it, how full it is, and how much it's producing."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Network revenue YTD" value={revenueYtd} format={(n) => `$${(n / 1_000_000).toFixed(2)}M`} delta={6} icon={<TrendingUp size={18} aria-hidden />} />
        <StatCard label="Total members" value={members} format={(n) => Math.round(n).toLocaleString()} delta={3} icon={<Users size={18} aria-hidden />} />
        <StatCard label="Avg utilization" value={avgUtil} format={(n) => `${Math.round(n)}%`} delta={2} icon={<Percent size={18} aria-hidden />} />
        <StatCard label="Facilities" value={FACILITIES.length} format={(n) => String(Math.round(n))} icon={<Building2 size={18} aria-hidden />} />
      </div>

      <Card className="rise mt-4" >
        <CardTitle
          action={
            <div className="flex flex-wrap items-center gap-1">
              <span className="mr-1 hidden text-[11px] uppercase tracking-wider text-ice-400 sm:inline">Sort by</span>
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSortKey(s.key)}
                  aria-pressed={sortKey === s.key}
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                    sortKey === s.key ? 'bg-frost-400 text-white' : 'text-ice-300 hover:bg-ice-700/70 hover:text-ice-100'
                  }`}
                >
                  {sortKey === s.key && <ArrowDown size={11} aria-hidden />}
                  {s.label}
                </button>
              ))}
            </div>
          }
        >
          All facilities
        </CardTitle>
        <p className="-mt-2 mb-3 text-xs text-ice-400">
          {openCount} open · {launching.length} launching ({launching.map((f) => f.city).join(', ')}) · license fee ~$100k per market
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-ice-600/40 text-[11px] uppercase tracking-wider text-ice-400">
                <th className="py-2 pr-3 font-semibold">Facility</th>
                <th className="py-2 pr-3 font-semibold">Owner</th>
                <th className="py-2 pr-3 font-semibold">Since</th>
                <th className="py-2 pr-3 text-right font-semibold" aria-sort={sortKey === 'members' ? 'descending' : undefined}>Members</th>
                <th className="py-2 pr-3 text-right font-semibold" aria-sort={sortKey === 'revenueYtd' ? 'descending' : undefined}>Revenue YTD</th>
                <th className="py-2 pr-3 font-semibold" aria-sort={sortKey === 'utilization' ? 'descending' : undefined}>Utilization</th>
                <th className="py-2 pr-3 text-right font-semibold" aria-sort={sortKey === 'rockReadyRate' ? 'descending' : undefined}>Rock Ready</th>
                <th className="py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((f) => (
                <tr key={f.id} className="border-b border-ice-700/40 transition-colors last:border-0 hover:bg-ice-700/30">
                  <td className="py-2.5 pr-3">
                    <Link to={`/hq/facilities/${f.id}`} className="font-semibold text-ice-100 hover:text-frost-300">
                      {f.name}
                    </Link>
                    <span className="block text-[11px] text-ice-400">{f.city}, {f.state}</span>
                  </td>
                  <td className="py-2.5 pr-3 text-ice-200">{f.owner}</td>
                  <td className="tabular py-2.5 pr-3 text-ice-400">{f.since}</td>
                  <td className="tabular py-2.5 pr-3 text-right text-ice-100">{f.members.toLocaleString()}</td>
                  <td className="tabular py-2.5 pr-3 text-right font-semibold text-ice-50">${Math.round(f.revenueYtd / 1000)}k</td>
                  <td className="py-2.5 pr-3"><UtilizationBar value={f.utilization} /></td>
                  <td className="tabular py-2.5 pr-3 text-right text-ice-100">{f.rockReadyRate}%</td>
                  <td className="py-2.5">
                    {f.status === 'open'
                      ? <Chip tone="grass">Open</Chip>
                      : <Chip tone="gold" icon={<Rocket size={11} aria-hidden />}>Launching</Chip>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
