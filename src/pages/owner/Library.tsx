import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList, Dumbbell, Eye, FileText, Flame, GraduationCap, History,
  Megaphone, Route, Search, Table2, Video,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardTitle, Chip, EmptyState, PageHeader } from '../../components/ui'
import { PILLARS, RESOURCES } from '../../data/seed'
import type { Pillar, Resource, ResourceType } from '../../lib/types'

const TYPE_ICONS: Record<ResourceType, LucideIcon> = {
  video: Video,
  pdf: FileText,
  spreadsheet: Table2,
  drill: Dumbbell,
  lecture: GraduationCap,
}

const PILLAR_ICONS: Record<Pillar, LucideIcon> = {
  instruction: GraduationCap,
  operations: ClipboardList,
  programs: Route,
  marketing: Megaphone,
}

const MONTH_ORDER: Record<string, number> = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6 }
const updatedKey = (u: string) => {
  const [mo, d] = u.split(' ')
  return (MONTH_ORDER[mo] ?? 0) * 100 + Number(d)
}

function ResourceCard({ r, delay }: { r: Resource; delay: number }) {
  const Icon = TYPE_ICONS[r.type]
  return (
    <Link to={`/owner/library/resource/${r.id}`} className="rise group block" style={{ animationDelay: `${delay}ms` }}>
      <Card className="h-full transition-colors group-hover:border-frost-400/40">
        <div className="flex items-start justify-between gap-2">
          <Icon size={18} className="text-frost-400" aria-hidden />
          {r.status === 'draft' && <Chip tone="gold">Draft</Chip>}
        </div>
        <p className="display mt-2 text-base font-semibold leading-tight text-ice-50">{r.title}</p>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ice-300">{r.description}</p>
        <p className="tabular mt-3 flex items-center gap-3 text-[11px] text-ice-400">
          <span className="capitalize">{r.type}</span>
          <span>{r.meta}</span>
          <span className="ml-auto inline-flex items-center gap-1"><Eye size={11} aria-hidden />{r.views.toLocaleString('en-US')}</span>
        </p>
      </Card>
    </Link>
  )
}

export default function LibraryPage() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return RESOURCES.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [query])

  const mostUsed = useMemo(() => [...RESOURCES].sort((a, b) => b.views - a.views).slice(0, 4), [])
  const recent = useMemo(() => [...RESOURCES].sort((a, b) => updatedKey(b.updated) - updatedKey(a.updated)).slice(0, 5), [])

  const searching = query.trim().length > 0

  return (
    <div>
      <PageHeader
        eyebrow="Frozen Ropes Dawsonville"
        title="The Frozone Library"
        sub="Thirty-five years of Frozen Ropes know-how — drills, playbooks, curricula, and the Blueprint — searchable in seconds."
      />

      <div className="relative mb-6 max-w-xl rise">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ice-400" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the library — try “grip”, “referral”, or “camp”"
          aria-label="Search library resources"
          className="w-full rounded-lg border border-ice-600/60 bg-ice-900 py-2.5 pl-10 pr-4 text-sm text-ice-100 placeholder:text-ice-400 focus:border-frost-400/60"
        />
      </div>

      {searching ? (
        results.length > 0 ? (
          <>
            <p className="tabular mb-3 text-xs text-ice-400">{results.length} {results.length === 1 ? 'resource' : 'resources'} for “{query.trim()}”</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {results.map((r, i) => <ResourceCard key={r.id} r={r} delay={i * 40} />)}
            </div>
          </>
        ) : (
          <EmptyState
            title="Nothing in the net"
            hint={`No resources match “${query.trim()}”. Try broader terms — hitting, blueprint, camps, referrals.`}
          />
        )
      ) : (
        <>
          {/* Four pillars */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {PILLARS.map((p, i) => {
              const Icon = PILLAR_ICONS[p.id]
              const count = RESOURCES.filter((r) => r.pillar === p.id).length
              return (
                <Link key={p.id} to={`/owner/library/${p.id}`} className="rise group block" style={{ animationDelay: `${i * 50}ms` }}>
                  <Card className="h-full transition-colors group-hover:border-frost-400/40">
                    <div className="flex items-start justify-between">
                      <Icon size={22} className="text-frost-400" aria-hidden />
                      <Chip tone="frost">{count} items</Chip>
                    </div>
                    <p className="display mt-3 text-xl font-semibold text-ice-50">{p.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ice-300">{p.tagline}</p>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Most used */}
          <div className="mt-8">
            <h2 className="display mb-3 flex items-center gap-2 text-lg font-semibold text-ice-100">
              <Flame size={16} className="text-gold-400" aria-hidden /> Most used this month
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {mostUsed.map((r, i) => <ResourceCard key={r.id} r={r} delay={200 + i * 40} />)}
            </div>
          </div>

          {/* Recently updated */}
          <div className="mt-8 rise" style={{ animationDelay: '350ms' }}>
            <Card>
              <CardTitle>
                <span className="inline-flex items-center gap-2"><History size={16} className="text-frost-400" aria-hidden /> Recently updated</span>
              </CardTitle>
              <div className="divide-y divide-ice-700/60">
                {recent.map((r) => {
                  const Icon = TYPE_ICONS[r.type]
                  const pillar = PILLARS.find((p) => p.id === r.pillar)
                  return (
                    <Link key={r.id} to={`/owner/library/resource/${r.id}`} className="flex items-center gap-3 px-1 py-2.5 transition-colors hover:bg-ice-700/30">
                      <Icon size={15} className="shrink-0 text-ice-400" aria-hidden />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-ice-100">{r.title}</span>
                      <span className="hidden text-xs text-ice-400 sm:block">{pillar?.name}</span>
                      <span className="tabular shrink-0 text-xs text-frost-300">{r.updated}</span>
                    </Link>
                  )
                })}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
