import { Link } from 'react-router-dom'
import { ArrowRight, Building2, FileText, Percent, Rocket, Target, TrendingUp, Users } from 'lucide-react'
import { Card, CardTitle, Chip, PageHeader, StatCard } from '../../components/ui'
import { FACILITIES, PROSPECTS, RESOURCES } from '../../data/seed'
import type { Prospect } from '../../lib/types'

const STAGE_META: { id: Prospect['stage']; label: string; tone: 'ice' | 'frost' | 'gold' | 'grass' }[] = [
  { id: 'lead', label: 'Lead', tone: 'ice' },
  { id: 'toured', label: 'Toured', tone: 'frost' },
  { id: 'sneak-peek', label: 'Sneak Peek', tone: 'gold' },
  { id: 'committed', label: 'Committed', tone: 'grass' },
]

const PILLAR_LABEL: Record<string, string> = {
  instruction: 'Instruction',
  operations: 'Operations',
  programs: 'Programs',
  marketing: 'Marketing',
}

function Meter({ value, tone = 'frost' }: { value: number; tone?: 'frost' | 'gold' }) {
  return (
    <div className="flex items-center gap-2" role="img" aria-label={`${value} percent`}>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-ice-700">
        <div
          className={`h-full rounded-full ${tone === 'gold' ? 'bg-gold-400' : 'bg-frost-400'}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="tabular text-xs font-medium text-ice-200">{value}%</span>
    </div>
  )
}

export default function DashboardPage() {
  const revenueYtd = FACILITIES.reduce((s, f) => s + f.revenueYtd, 0)
  const members = FACILITIES.reduce((s, f) => s + f.members, 0)
  const avgUtil = FACILITIES.reduce((s, f) => s + f.utilization, 0) / FACILITIES.length
  const avgRockReady = FACILITIES.reduce((s, f) => s + f.rockReadyRate, 0) / FACILITIES.length

  const leaderboard = [...FACILITIES].sort((a, b) => b.revenueYtd - a.revenueYtd)
  const topResources = [...RESOURCES].sort((a, b) => b.views - a.views).slice(0, 3)
  const stageCounts = STAGE_META.map((s) => ({ ...s, count: PROSPECTS.filter((p) => p.stage === s.id).length }))

  return (
    <div>
      <PageHeader
        eyebrow="Frozen Ropes USA · Network HQ"
        title="Network Dashboard"
        sub="Nine facilities, one scoreboard. Revenue, membership, and Rock Ready adoption across the whole system."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Network revenue YTD" value={revenueYtd} format={(n) => `$${(n / 1_000_000).toFixed(2)}M`} delta={6} icon={<TrendingUp size={18} />} />
        <StatCard label="Total members" value={members} format={(n) => Math.round(n).toLocaleString()} delta={3} icon={<Users size={18} />} />
        <StatCard label="Avg utilization" value={avgUtil} format={(n) => `${Math.round(n)}%`} delta={2} icon={<Percent size={18} />} />
        <StatCard label="Avg Rock Ready participation" value={avgRockReady} format={(n) => `${Math.round(n)}%`} delta={4} icon={<Target size={18} />} />
      </div>

      <div className="mt-4 grid items-start gap-4 xl:grid-cols-3">
        {/* Leaderboard */}
        <Card className="rise xl:col-span-2">
          <CardTitle
            action={
              <Link to="/hq/facilities" className="flex items-center gap-1 text-xs font-semibold text-frost-300 hover:text-frost-200">
                All facilities <ArrowRight size={13} aria-hidden />
              </Link>
            }
          >
            Facility leaderboard
          </CardTitle>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-ice-600/40 text-[11px] uppercase tracking-wider text-ice-400">
                  <th className="py-2 pr-3 font-semibold">Facility</th>
                  <th className="py-2 pr-3 font-semibold">Since</th>
                  <th className="py-2 pr-3 text-right font-semibold">Members</th>
                  <th className="py-2 pr-3 text-right font-semibold">Revenue YTD</th>
                  <th className="py-2 pr-3 font-semibold">Utilization</th>
                  <th className="py-2 pr-3 font-semibold">Rock Ready</th>
                  <th className="py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((f) => (
                  <tr key={f.id} className="border-b border-ice-700/40 last:border-0">
                    <td className="py-2.5 pr-3">
                      <Link to={`/hq/facilities/${f.id}`} className="font-semibold text-ice-100 hover:text-frost-300">
                        {f.name}
                      </Link>
                    </td>
                    <td className="tabular py-2.5 pr-3 text-ice-400">{f.since}</td>
                    <td className="tabular py-2.5 pr-3 text-right text-ice-100">{f.members.toLocaleString()}</td>
                    <td className="tabular py-2.5 pr-3 text-right font-semibold text-ice-50">${f.revenueYtd.toLocaleString()}</td>
                    <td className="py-2.5 pr-3"><Meter value={f.utilization} /></td>
                    <td className="py-2.5 pr-3"><Meter value={f.rockReadyRate} tone="gold" /></td>
                    <td className="py-2.5">
                      {f.status === 'open' ? <Chip tone="grass">Open</Chip> : <Chip tone="gold" icon={<Rocket size={11} aria-hidden />}>Launching</Chip>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right rail */}
        <div className="space-y-4">
          <Card className="rise border-gold-400/30" >
            <div className="flex items-start justify-between">
              <p className="eyebrow text-gold-300">Launch tracking · Dawsonville, GA</p>
              <Rocket size={16} className="text-gold-300" aria-hidden />
            </div>
            <p className="display tabular mt-2 text-3xl font-semibold text-ice-50">124 members in 120 days</p>
            <p className="mt-1 text-sm font-semibold text-grass-400">18% ahead of Blueprint</p>
            <p className="mt-2 text-xs leading-relaxed text-ice-400">
              Dana & Paul Whitfield came in from outside the industry — the Grand Opening Playbook did the heavy lifting.
            </p>
            <Link to="/hq/facilities/fac-dawsonville" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-frost-300 hover:text-frost-200">
              Open facility detail <ArrowRight size={13} aria-hidden />
            </Link>
          </Card>

          <Card className="rise" >
            <CardTitle
              action={
                <Link to="/hq/pipeline" className="flex items-center gap-1 text-xs font-semibold text-frost-300 hover:text-frost-200">
                  Pipeline <ArrowRight size={13} aria-hidden />
                </Link>
              }
            >
              License pipeline
            </CardTitle>
            <div className="space-y-2">
              {stageCounts.map((s) => (
                <Link key={s.id} to="/hq/pipeline" className="flex items-center justify-between rounded-lg border border-ice-600/30 bg-ice-900/60 px-3 py-2 transition-colors hover:border-frost-400/40">
                  <span className="flex items-center gap-2 text-sm text-ice-200">
                    <Building2 size={14} className="text-ice-400" aria-hidden /> {s.label}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="tabular text-sm font-semibold text-ice-50">{s.count}</span>
                    <Chip tone={s.tone}>{s.count === 1 ? 'prospect' : 'prospects'}</Chip>
                  </span>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="rise" >
            <CardTitle
              action={
                <Link to="/hq/content" className="flex items-center gap-1 text-xs font-semibold text-frost-300 hover:text-frost-200">
                  Content CMS <ArrowRight size={13} aria-hidden />
                </Link>
              }
            >
              Content pulse
            </CardTitle>
            <div className="space-y-2">
              {topResources.map((r, i) => (
                <Link key={r.id} to="/hq/content" className="flex items-center justify-between gap-3 rounded-lg border border-ice-600/30 bg-ice-900/60 px-3 py-2 transition-colors hover:border-frost-400/40">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="display tabular w-4 shrink-0 text-sm font-bold text-ice-500">{i + 1}</span>
                    <FileText size={14} className="shrink-0 text-frost-400" aria-hidden />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ice-100">{r.title}</span>
                      <span className="block text-[11px] text-ice-400">{PILLAR_LABEL[r.pillar]}</span>
                    </span>
                  </span>
                  <span className="tabular shrink-0 text-xs font-semibold text-ice-200">{r.views.toLocaleString()} views</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
