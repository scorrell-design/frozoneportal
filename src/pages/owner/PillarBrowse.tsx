import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowDownWideNarrow, Dumbbell, Eye, FileText, GraduationCap, Table2, Video } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Breadcrumbs, Card, Chip, EmptyState, PageHeader } from '../../components/ui'
import { PILLARS, RESOURCES } from '../../data/seed'
import type { ResourceType } from '../../lib/types'

const TYPE_ICONS: Record<ResourceType, LucideIcon> = {
  video: Video,
  pdf: FileText,
  spreadsheet: Table2,
  drill: Dumbbell,
  lecture: GraduationCap,
}

const TYPE_FILTERS: { id: ResourceType | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'video', label: 'Video' },
  { id: 'pdf', label: 'PDF' },
  { id: 'spreadsheet', label: 'Spreadsheet' },
  { id: 'drill', label: 'Drill' },
  { id: 'lecture', label: 'Lecture' },
]

const MONTH_ORDER: Record<string, number> = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6 }
const updatedKey = (u: string) => {
  const [mo, d] = u.split(' ')
  return (MONTH_ORDER[mo] ?? 0) * 100 + Number(d)
}

export default function PillarBrowsePage() {
  const { pillar } = useParams<{ pillar: string }>()
  const [typeFilter, setTypeFilter] = useState<ResourceType | 'all'>('all')
  const [sort, setSort] = useState<'views' | 'updated'>('views')

  const pillarDef = PILLARS.find((p) => p.id === pillar)

  const items = useMemo(() => {
    if (!pillarDef) return []
    const filtered = RESOURCES.filter(
      (r) => r.pillar === pillarDef.id && (typeFilter === 'all' || r.type === typeFilter),
    )
    return filtered.sort((a, b) =>
      sort === 'views' ? b.views - a.views : updatedKey(b.updated) - updatedKey(a.updated),
    )
  }, [pillarDef, typeFilter, sort])

  if (!pillarDef) return <Navigate to="/owner/library" replace />

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Library', to: '/owner/library' }, { label: pillarDef.name }]} />
      <PageHeader eyebrow="Frozen Ropes Dawsonville · Library" title={pillarDef.name} sub={pillarDef.tagline} />

      <div className="mb-5 flex flex-wrap items-center gap-2 rise">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by type">
          {TYPE_FILTERS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              aria-pressed={typeFilter === t.id}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                typeFilter === t.id
                  ? 'border-frost-400/50 bg-frost-400/15 text-frost-300'
                  : 'border-ice-600/60 text-ice-300 hover:bg-ice-700/60 hover:text-ice-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSort((s) => (s === 'views' ? 'updated' : 'views'))}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-ice-600/60 px-3 py-1.5 text-xs font-semibold text-ice-200 transition-colors hover:bg-ice-700/60 hover:text-ice-50"
        >
          <ArrowDownWideNarrow size={13} aria-hidden />
          Sort: {sort === 'views' ? 'Most viewed' : 'Recently updated'}
        </button>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((r, i) => {
            const Icon = TYPE_ICONS[r.type]
            return (
              <Link key={r.id} to={`/owner/library/resource/${r.id}`} className="rise group block" style={{ animationDelay: `${i * 40}ms` }}>
                <Card className="h-full transition-colors group-hover:border-frost-400/40">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold capitalize text-frost-300">
                      <Icon size={16} aria-hidden /> {r.type}
                    </span>
                    {r.status === 'draft' && <Chip tone="gold">Draft</Chip>}
                  </div>
                  <p className="display mt-2.5 text-lg font-semibold leading-tight text-ice-50">{r.title}</p>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ice-300">{r.description}</p>
                  <p className="tabular mt-3 flex items-center gap-3 text-[11px] text-ice-400">
                    <span>{r.meta}</span>
                    <span>Updated {r.updated}</span>
                    <span className="ml-auto inline-flex items-center gap-1"><Eye size={11} aria-hidden />{r.views.toLocaleString('en-US')}</span>
                  </p>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <EmptyState
          title="Nothing in the net"
          hint={`No ${typeFilter === 'all' ? '' : `${typeFilter} `}resources in ${pillarDef.name} yet. Try another type filter.`}
        />
      )}
    </div>
  )
}
