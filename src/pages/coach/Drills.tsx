import { useState } from 'react'
import { Clock, Library, Package, Search, Sparkles, Users } from 'lucide-react'
import { Card, CardTitle, Chip, DemoTag, PageHeader, toast } from '../../components/ui'
import { DRILLS, DRILL_FINDER_PRESETS, drillById, resourceById } from '../../data/seed'
import type { Drill } from '../../lib/types'

type Preset = (typeof DRILL_FINDER_PRESETS)[number]

const tokens = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2)

/* Nearest-preset fuzzy match: shared meaningful words with the canned queries */
const matchPreset = (q: string): Preset | null => {
  const qt = new Set(tokens(q))
  let best: Preset | null = null
  let bestScore = 0
  for (const p of DRILL_FINDER_PRESETS) {
    const score = tokens(p.query).reduce((n, w) => n + (qt.has(w) ? 1 : 0), 0)
    if (score > bestScore) {
      bestScore = score
      best = p
    }
  }
  return bestScore >= 2 ? best : null
}

function DrillBody({ d }: { d: Drill }) {
  const resource = resourceById(d.resourceId)
  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        {d.focus.map((f) => (
          <Chip key={f} tone="frost">{f}</Chip>
        ))}
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-ice-200">{d.description}</p>
      <dl className="tabular mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ice-400">
        <div className="flex items-center gap-1.5">
          <Users size={12} className="text-ice-500" aria-hidden />
          <dt className="sr-only">Ages</dt>
          <dd>{d.ages}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-ice-500" aria-hidden />
          <dt className="sr-only">Duration</dt>
          <dd>{d.duration}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Package size={12} className="text-ice-500" aria-hidden />
          <dt className="sr-only">Equipment</dt>
          <dd>{d.equipment}</dd>
        </div>
      </dl>
      {resource && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-ice-700/60 pt-3">
          <Library size={13} className="shrink-0 text-ice-500" aria-hidden />
          <span className="min-w-0 flex-1 truncate text-xs text-ice-300">{resource.title}</span>
          <Chip tone="ice">In the Library</Chip>
        </div>
      )}
    </>
  )
}

export default function CoachDrills() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<Preset | null>(null)

  const run = (q: string) => {
    const exact = DRILL_FINDER_PRESETS.find((p) => p.query === q)
    const hit = exact ?? matchPreset(q)
    if (!hit) {
      toast('The demo finder is trained on three example questions — tap a suggestion to see it work.')
      return
    }
    setQuery(hit.query)
    setActive(hit)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Coach portal · Dawsonville"
        title="Drill library"
        sub="Every drill backed by the Instruction pillar — and a finder that searches all of it the way you'd ask a colleague."
      />

      {/* AI Drill Finder */}
      <Card className="rise border-frost-400/30 bg-frost-400/5">
        <CardTitle action={<DemoTag>Demo presets</DemoTag>}>
          <span className="flex items-center gap-2">
            <Sparkles size={17} className="text-frost-400" aria-hidden /> AI drill finder
          </span>
        </CardTitle>
        <p className="-mt-1 mb-3 text-sm text-ice-300">
          Describe the problem in plain words — the finder searches every drill and every video in the Library and
          ranks what fixes it.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (query.trim()) run(query)
          }}
          className="flex gap-2"
        >
          <label className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ice-400" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 9-year-old swinging late on fastballs"
              aria-label="Describe the problem to find drills"
              className="w-full rounded-md border border-ice-600/60 bg-ice-900 py-2.5 pl-9 pr-3 text-sm text-ice-100 placeholder:text-ice-500 focus:border-frost-400 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-md bg-frost-400 px-4 text-sm font-semibold text-ice-950 shadow-[0_0_18px_rgba(56,189,248,0.25)] transition-colors hover:bg-frost-300"
          >
            <Sparkles size={14} aria-hidden /> Find drills
          </button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="eyebrow text-ice-500">Try</span>
          {DRILL_FINDER_PRESETS.map((p) => (
            <button
              key={p.query}
              onClick={() => run(p.query)}
              aria-pressed={active?.query === p.query}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                active?.query === p.query
                  ? 'border-frost-400 bg-frost-400/15 text-frost-300'
                  : 'border-ice-600/60 text-ice-300 hover:border-frost-400/60 hover:text-frost-200'
              }`}
            >
              “{p.query}”
            </button>
          ))}
        </div>

        {active && (
          <div className="mt-4 border-t border-frost-400/20 pt-4">
            <p className="eyebrow rise text-frost-300">
              {active.matches.length} ranked {active.matches.length === 1 ? 'match' : 'matches'} for “{active.query}”
            </p>
            <div className="mt-2 grid gap-3 lg:grid-cols-3">
              {active.matches.map((m, i) => {
                const d = drillById(m.drillId)
                if (!d) return null
                const pct = Math.round(m.score * 100)
                return (
                  <div
                    key={m.drillId}
                    className="rise flex flex-col rounded-[10px] border border-ice-600/40 bg-ice-850 p-4"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="display text-base font-semibold uppercase tracking-wide text-ice-50">{d.title}</p>
                      <span className="tabular shrink-0 text-sm font-bold text-frost-300">{pct}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-ice-700" role="img" aria-label={`${pct} percent match`}>
                      <div
                        className="h-full rounded-full bg-frost-400"
                        style={{ width: `${pct}%`, transition: 'width 600ms cubic-bezier(0.22,1,0.36,1)' }}
                      />
                    </div>
                    <p className="mt-2.5 border-l-2 border-frost-400/50 pl-2.5 text-xs italic leading-relaxed text-ice-300">
                      {m.why}
                    </p>
                    <div className="mt-3">
                      <DrillBody d={d} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Full library grid */}
      <div className="rise mt-5 mb-2 flex items-baseline justify-between px-1">
        <h2 className="display text-sm font-semibold uppercase tracking-wider text-ice-100">All drills</h2>
        <span className="tabular text-[11px] text-ice-400">{DRILLS.length} in the Instruction pillar</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {DRILLS.map((d, i) => (
          <div key={d.id} className="rise" style={{ animationDelay: `${i * 50}ms` }}>
            <Card className="h-full transition-colors hover:border-frost-400/50">
              <p className="display mb-2 text-lg font-semibold uppercase tracking-wide text-ice-50">{d.title}</p>
              <DrillBody d={d} />
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
