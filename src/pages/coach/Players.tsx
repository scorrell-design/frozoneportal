import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpDown, ChevronRight, Search, TrendingUp, Users } from 'lucide-react'
import { Avatar, Button, Card, Chip, EmptyState, PageHeader, StatCard } from '../../components/ui'
import { Sparkline } from '../../components/charts'
import { FlagChips, MY_PLAYERS, gradeFor } from './shared'
import type { TierId } from '../../lib/types'

const TIER_TONE: Record<TierId, 'ice' | 'frost' | 'gold' | 'clay'> = {
  rookie: 'ice',
  prospect: 'frost',
  allstar: 'gold',
  franchise: 'clay',
}
const TIER_NAME: Record<TierId, string> = {
  rookie: 'Rookie',
  prospect: 'Prospect',
  allstar: 'All-Star',
  franchise: 'Franchise',
}

type SortKey = 'composite' | 'name' | 'age'
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'composite', label: 'Composite' },
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
]

const AGE_ORDER = ['6U', '9U', '12U', '15U', '17U']

export default function CoachPlayers() {
  const [q, setQ] = useState('')
  const [group, setGroup] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('composite')

  const groups = useMemo(() => AGE_ORDER.filter((g) => MY_PLAYERS.some((p) => p.ageGroup === g)), [])

  const list = useMemo(() => {
    const ql = q.trim().toLowerCase()
    const filtered = MY_PLAYERS.filter(
      (p) => (!ql || p.name.toLowerCase().includes(ql)) && (!group || p.ageGroup === group),
    )
    return [...filtered].sort((a, b) =>
      sort === 'name' ? a.name.localeCompare(b.name) : sort === 'age' ? a.age - b.age : b.composite - a.composite,
    )
  }, [q, group, sort])

  const avgComposite = Math.round(MY_PLAYERS.reduce((s, p) => s + p.composite, 0) / MY_PLAYERS.length)
  const trendingUp = MY_PLAYERS.filter((p) => p.compositeTrend[p.compositeTrend.length - 1] > p.compositeTrend[0]).length

  return (
    <div>
      <PageHeader
        eyebrow="Coach portal · Dawsonville"
        title="My players"
        sub="Every athlete on your rosters — Rock Ready trends, tiers, and the flags that matter at the door."
      />

      {/* Roster pulse */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rise" style={{ animationDelay: '0ms' }}>
          <StatCard label="Roster size" value={MY_PLAYERS.length} icon={<Users size={18} />} />
        </div>
        <div className="rise" style={{ animationDelay: '50ms' }}>
          <StatCard label="Avg composite" value={avgComposite} icon={<ArrowUpDown size={18} />} />
        </div>
        <div className="rise" style={{ animationDelay: '100ms' }}>
          <StatCard
            label="Trending up"
            value={trendingUp}
            format={(n) => `${Math.round(n)} of ${MY_PLAYERS.length}`}
            icon={<TrendingUp size={18} />}
          />
        </div>
      </div>

      {/* Search / filter / sort bar */}
      <Card pad={false} className="rise mt-3 flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3" >
        <label className="relative min-w-[200px] flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ice-400" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search players…"
            aria-label="Search players by name"
            className="w-full rounded-md border border-ice-600/60 bg-ice-900 py-2 pl-9 pr-3 text-sm text-ice-100 placeholder:text-ice-500 focus:border-frost-400 focus:outline-none"
          />
        </label>
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by age group">
          <button
            onClick={() => setGroup(null)}
            aria-pressed={group === null}
            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              group === null
                ? 'border-frost-400 bg-frost-400/15 text-frost-300'
                : 'border-ice-600/60 text-ice-300 hover:border-ice-500 hover:text-ice-100'
            }`}
          >
            All ages
          </button>
          {groups.map((g) => (
            <button
              key={g}
              onClick={() => setGroup(group === g ? null : g)}
              aria-pressed={group === g}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                group === g
                  ? 'border-frost-400 bg-frost-400/15 text-frost-300'
                  : 'border-ice-600/60 text-ice-300 hover:border-ice-500 hover:text-ice-100'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5" role="group" aria-label="Sort players">
          <span className="eyebrow text-ice-400">Sort</span>
          <div className="flex overflow-hidden rounded-md border border-ice-600/60">
            {SORTS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                aria-pressed={sort === s.key}
                className={`border-r border-ice-600/60 px-3 py-1.5 text-xs font-semibold transition-colors last:border-r-0 ${
                  sort === s.key ? 'bg-frost-400 text-white' : 'bg-ice-900 text-ice-300 hover:bg-ice-700/70 hover:text-ice-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Roster rows */}
      {list.length === 0 ? (
        <div className="rise mt-3">
          <EmptyState
            title="No players match"
            hint="Try a different name, or clear the age-group filter."
            action={
              <Button variant="ghost" onClick={() => { setQ(''); setGroup(null) }}>
                Clear search & filters
              </Button>
            }
          />
        </div>
      ) : (
        <Card pad={false} className="rise mt-3">
          <ul className="divide-y divide-ice-700/60">
            {list.map((p, i) => (
              <li key={p.id} className="rise" style={{ animationDelay: `${120 + i * 30}ms` }}>
                <Link
                  to={`/coach/players/${p.id}`}
                  className="group flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 transition-colors hover:bg-ice-700/30"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3" style={{ minWidth: 200 }}>
                    <Avatar name={p.name} hue={p.hue} size={40} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ice-50 group-hover:text-frost-200">
                        {p.name} <span className="tabular font-normal text-ice-400">#{p.jersey}</span>
                      </p>
                      <p className="text-[11px] text-ice-400">{p.ageGroup} · {p.position} · age {p.age}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Chip tone={TIER_TONE[p.tier]}>{TIER_NAME[p.tier]}</Chip>
                    <FlagChips player={p} />
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <p className="display tabular text-xl font-bold text-ice-50">
                        {p.composite}
                        <span className="ml-1.5 text-sm font-semibold text-frost-300">{gradeFor(p.composite)}</span>
                      </p>
                      <p className="eyebrow text-ice-400">Composite</p>
                    </div>
                    <Sparkline
                      data={p.compositeTrend}
                      width={72}
                      height={24}
                      stroke={
                        p.compositeTrend[p.compositeTrend.length - 1] >= p.compositeTrend[0]
                          ? 'var(--color-grass-400)'
                          : 'var(--color-clay-400)'
                      }
                    />
                    <ChevronRight size={16} className="text-ice-500 transition-colors group-hover:text-frost-300" aria-hidden />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <p className="mt-3 text-xs text-ice-400">
        Composite is the Rock Ready blend of all seven indexes — tap any player for the full development picture.
      </p>
    </div>
  )
}
