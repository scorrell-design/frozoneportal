import { Link, Navigate, useParams } from 'react-router-dom'
import {
  ArrowRight, Dumbbell, Eye, FileText, GraduationCap, Play, Table2, Video,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Breadcrumbs, Card, CardTitle, Chip, toast } from '../../components/ui'
import { PILLARS, RESOURCES, resourceById } from '../../data/seed'
import type { Resource, ResourceType } from '../../lib/types'

const TYPE_ICONS: Record<ResourceType, LucideIcon> = {
  video: Video,
  pdf: FileText,
  spreadsheet: Table2,
  drill: Dumbbell,
  lecture: GraduationCap,
}

function Preview({ r }: { r: Resource }) {
  if (r.type === 'video' || r.type === 'lecture') {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-ice-600/50 bg-[linear-gradient(135deg,#13304a_0%,#0a1420_55%,#070d16_100%)]">
        <div aria-hidden className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-frost-400/25" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <button
            onClick={() => toast('Streaming begins in the production build')}
            aria-label={`Play ${r.title}`}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-frost-400/50 bg-frost-400/15 text-frost-300 shadow-[0_0_28px_rgba(56,189,248,0.3)] transition-transform hover:scale-105"
          >
            <Play size={26} className="ml-1" aria-hidden />
          </button>
          <p className="tabular text-xs font-medium text-ice-300">{r.meta} · {r.type === 'lecture' ? 'Lecture recording' : 'Coaching film'}</p>
        </div>
      </div>
    )
  }
  if (r.type === 'spreadsheet') {
    return (
      <div className="overflow-hidden rounded-xl border border-ice-600/50 bg-ice-900">
        <div className="flex gap-1 border-b border-ice-600/40 bg-ice-850 px-3 pt-2.5" aria-hidden>
          {['Summary', 'Revenue', 'Expenses', 'Benchmarks'].map((tab, i) => (
            <span key={tab} className={`rounded-t-md px-3 py-1.5 text-[11px] font-semibold ${i === 0 ? 'bg-ice-900 text-frost-300' : 'text-ice-400'}`}>{tab}</span>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-px bg-ice-700/40 p-px" aria-hidden>
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className={`h-8 bg-ice-900 ${i < 5 ? 'bg-ice-850' : ''}`}>
              {i >= 5 && i % 5 !== 0 && <div className="mx-2 mt-3 h-1.5 rounded bg-ice-700/70" style={{ width: `${30 + ((i * 17) % 50)}%` }} />}
            </div>
          ))}
        </div>
        <p className="tabular border-t border-ice-600/40 px-3 py-2 text-[11px] text-ice-400">{r.meta} · live workbook preview</p>
      </div>
    )
  }
  // pdf + drill: stylized page mockup
  return (
    <div className="flex justify-center rounded-xl border border-ice-600/50 bg-ice-900 p-6 sm:p-10">
      <div className="w-full max-w-sm rounded-md border border-ice-600/50 bg-ice-850 p-5 shadow-xl" aria-hidden>
        <div className="h-3 w-3/4 rounded bg-ice-500/80" />
        <div className="mt-1.5 h-3 w-1/2 rounded bg-ice-600/80" />
        <div className="mt-5 space-y-2">
          {[92, 100, 86, 95, 70, 100, 64].map((w, i) => (
            <div key={i} className="h-1.5 rounded bg-ice-700" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="mt-5 h-20 rounded border border-dashed border-frost-400/30 bg-frost-400/5" />
        <div className="mt-4 space-y-2">
          {[100, 88, 94].map((w, i) => (
            <div key={i} className="h-1.5 rounded bg-ice-700" style={{ width: `${w}%` }} />
          ))}
        </div>
        <p className="tabular mt-4 text-center text-[10px] text-ice-500">Page 1 · {r.meta}</p>
      </div>
    </div>
  )
}

export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const r = resourceById(id ?? '')
  if (!r) return <Navigate to="/owner/library" replace />

  const pillar = PILLARS.find((p) => p.id === r.pillar)
  const Icon = TYPE_ICONS[r.type]
  const related = RESOURCES.filter(
    (x) => x.id !== r.id && (x.pillar === r.pillar || x.tags.some((t) => r.tags.includes(t))),
  ).slice(0, 3)

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Library', to: '/owner/library' },
          { label: pillar?.name ?? 'Pillar', to: `/owner/library/${r.pillar}` },
          { label: r.title },
        ]}
      />

      <div className="mb-6 rise">
        <p className="eyebrow flex items-center gap-2 text-frost-400"><Icon size={14} aria-hidden /> {pillar?.name} · {r.type}</p>
        <h1 className="display mt-1 text-3xl font-semibold uppercase tracking-wide text-ice-50 sm:text-4xl">{r.title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-ice-300">{r.description}</p>
      </div>

      {r.id === 'r-blueprint' && (
        <Link to="/owner/blueprint" className="rise group mb-5 flex items-center gap-3 rounded-xl border border-frost-400/40 bg-frost-400/10 p-4 transition-colors hover:bg-frost-400/15">
          <Table2 size={20} className="shrink-0 text-frost-300" aria-hidden />
          <div className="flex-1">
            <p className="text-sm font-semibold text-frost-200">This doc is now live software — open The Blueprint</p>
            <p className="text-xs text-ice-300">Your actuals tracked against these benchmarks, updated daily. No more spreadsheet archaeology.</p>
          </div>
          <ArrowRight size={16} className="shrink-0 text-frost-300 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rise lg:col-span-2" style={{ animationDelay: '60ms' }}>
          <Preview r={r} />
        </div>

        <div className="space-y-4">
          <div className="rise" style={{ animationDelay: '120ms' }}>
            <Card>
              <CardTitle>Details</CardTitle>
              <dl className="space-y-2.5 text-sm">
                {[
                  ['Pillar', pillar?.name ?? '—'],
                  ['Type', r.type.charAt(0).toUpperCase() + r.type.slice(1)],
                  ['Length', r.meta],
                  ['Updated', r.updated],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-3">
                    <dt className="text-ice-400">{k}</dt>
                    <dd className="font-medium text-ice-100">{v}</dd>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-ice-400">Views</dt>
                  <dd className="tabular flex items-center gap-1.5 font-medium text-ice-100"><Eye size={13} className="text-ice-400" aria-hidden />{r.views.toLocaleString('en-US')}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-ice-400">Status</dt>
                  <dd>{r.status === 'draft' ? <Chip tone="gold">Draft</Chip> : <Chip tone="grass">Published</Chip>}</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {r.tags.map((t) => <Chip key={t} tone="frost">{t}</Chip>)}
              </div>
            </Card>
          </div>

          <div className="rise" style={{ animationDelay: '180ms' }}>
            <Card>
              <CardTitle>Related resources</CardTitle>
              <div className="space-y-1">
                {related.map((x) => {
                  const XIcon = TYPE_ICONS[x.type]
                  return (
                    <Link key={x.id} to={`/owner/library/resource/${x.id}`} className="flex items-center gap-2.5 rounded-md px-2 py-2 transition-colors hover:bg-ice-700/40">
                      <XIcon size={15} className="shrink-0 text-frost-400" aria-hidden />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-ice-100">{x.title}</span>
                      <span className="tabular shrink-0 text-[11px] text-ice-400">{x.meta}</span>
                    </Link>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
