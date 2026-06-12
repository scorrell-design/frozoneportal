import { useMemo, useState } from 'react'
import { BadgeCheck, Compass, Star } from 'lucide-react'
import { Button, Card, Chip, PageHeader, toast } from '../../components/ui'
import { COLLEGES, TYLER } from '../../data/seed'
import type { College } from '../../lib/types'

const DIVISIONS = ['All', 'D1', 'D2', 'D3'] as const
const REGIONS = ['All', ...Array.from(new Set(COLLEGES.map((c) => c.region)))]
const SORTS = [
  { id: 'fit', label: 'Best fit' },
  { id: 'tuition', label: 'Tuition (low → high)' },
  { id: 'academics', label: 'Academics' },
] as const

const tuition = (n: number) => `$${n.toLocaleString()}`

const fitClass = (fit: number) =>
  fit >= 85 ? 'text-grass-400' : fit >= 70 ? 'text-frost-300' : 'text-ice-300'

const divisionTone = (d: College['division']): 'frost' | 'gold' | 'ice' => (d === 'D1' ? 'frost' : d === 'D2' ? 'gold' : 'ice')

function MiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[68px_1fr_auto] items-center gap-2" role="img" aria-label={`${label}: ${value} out of 100`}>
      <span className="text-[11px] text-ice-400">{label}</span>
      <div className="h-1.5 rounded-full bg-ice-700">
        <div className="h-full rounded-full bg-frost-400/70" style={{ width: `${value}%`, transition: 'width 600ms ease-out' }} />
      </div>
      <span className="tabular w-6 text-right text-[11px] font-semibold text-ice-200">{value}</span>
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
        active ? 'border-frost-400 bg-frost-400 text-ice-950' : 'border-ice-600/60 text-ice-300 hover:bg-ice-700/60 hover:text-ice-100'
      }`}
    >
      {children}
    </button>
  )
}

export default function RecruitingPage() {
  const [division, setDivision] = useState<(typeof DIVISIONS)[number]>('All')
  const [region, setRegion] = useState('All')
  const [sort, setSort] = useState<(typeof SORTS)[number]['id']>('fit')
  const [shortlist, setShortlist] = useState<string[]>([])

  const colleges = useMemo(() => {
    const filtered = COLLEGES.filter(
      (c) => (division === 'All' || c.division === division) && (region === 'All' || c.region === region),
    )
    return [...filtered].sort((a, b) =>
      sort === 'fit' ? b.fit - a.fit : sort === 'tuition' ? a.tuition - b.tuition : b.academics - a.academics,
    )
  }, [division, region, sort])

  const toggle = (c: College) => {
    const on = shortlist.includes(c.id)
    setShortlist((xs) => (on ? xs.filter((id) => id !== c.id) : [...xs, c.id]))
    toast(on ? `${c.name} removed from the shortlist` : `${c.name} added to the shortlist`)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Parent portal · College Bound"
        title="College Bound"
        sub="Know where Tyler stands before you ever pay for a showcase — academic and athletic fit, on real data."
      />

      {/* Intro */}
      <Card className="rise mb-3 border-frost-400/30 bg-frost-400/5">
        <div className="flex items-start gap-3">
          <Compass size={20} className="mt-0.5 shrink-0 text-frost-400" aria-hidden />
          <div>
            <p className="display text-base font-semibold uppercase tracking-wide text-ice-50">Tyler is {TYLER.age} — and that's the point</p>
            <p className="mt-1 text-sm leading-relaxed text-ice-300">
              This is early, on purpose. Families who start the academic profile early get the best fits — grades,
              test prep, and the right target list matter years before any coach watches a video. College Bound is
              the anti-showcase: instead of paying event-by-event to be seen, you watch verified data tell you
              exactly where Tyler fits, and the list sharpens every quarter as he grows.
            </p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="rise mb-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="eyebrow mr-1 text-ice-400">Division</span>
            {DIVISIONS.map((d) => (
              <FilterChip key={d} active={division === d} onClick={() => setDivision(d)}>{d}</FilterChip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="eyebrow mr-1 text-ice-400">Region</span>
            {REGIONS.map((r) => (
              <FilterChip key={r} active={region === r} onClick={() => setRegion(r)}>{r}</FilterChip>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <label htmlFor="cb-sort" className="eyebrow text-ice-400">Sort</label>
            <select
              id="cb-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as (typeof SORTS)[number]['id'])}
              className="rounded-md border border-ice-600/60 bg-ice-900 px-3 py-1.5 text-sm text-ice-100"
            >
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* College cards */}
      <p className="tabular mb-2 text-xs text-ice-500">{colleges.length} programs match</p>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {colleges.map((c) => {
          const starred = shortlist.includes(c.id)
          return (
            <Card key={c.id} className="rise transition-colors hover:border-frost-400/40">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="display truncate text-base font-semibold uppercase tracking-wide text-ice-50">{c.name}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <Chip tone={divisionTone(c.division)}>{c.division}</Chip>
                    <span className="text-xs text-ice-400">{c.state}</span>
                    <span className="tabular text-xs text-ice-400">· {c.enrollment.toLocaleString()} students</span>
                    <span className="tabular text-xs text-ice-400">· {tuition(c.tuition)}/yr</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <button
                    onClick={() => toggle(c)}
                    aria-pressed={starred}
                    aria-label={starred ? `Remove ${c.name} from shortlist` : `Add ${c.name} to shortlist`}
                    className={`rounded p-1 transition-colors ${starred ? 'text-gold-400' : 'text-ice-500 hover:text-ice-200'}`}
                  >
                    <Star size={18} fill={starred ? 'currentColor' : 'none'} aria-hidden />
                  </button>
                  <p className={`display tabular text-3xl font-bold leading-none ${fitClass(c.fit)}`}>{c.fit}</p>
                  <p className="eyebrow text-ice-500">Fit</p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 border-t border-ice-600/30 pt-3">
                <MiniBar label="Academics" value={c.academics} />
                <MiniBar label="Baseball" value={c.baseball} />
              </div>
            </Card>
          )
        })}
      </div>

      {/* How fit works */}
      <Card className="rise mt-3">
        <div className="flex items-start gap-3">
          <BadgeCheck size={20} className="mt-0.5 shrink-0 text-frost-400" aria-hidden />
          <p className="text-sm leading-relaxed text-ice-300">
            <span className="font-semibold text-ice-100">How the fit score works.</span> It blends Tyler's verified
            Rock Ready data — recorded in person by his coaches — with each school's academic profile, roster needs,
            and cost. It updates automatically as Tyler grows, so the list you see at 16 is built on four years of
            real evidence, not one weekend in front of a radar gun.
          </p>
        </div>
      </Card>

      {/* Shortlist strip */}
      {shortlist.length > 0 && (
        <div className="sticky bottom-4 z-30 mt-4">
          <Card className="rise border-gold-400/40 shadow-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <Star size={17} className="text-gold-400" fill="currentColor" aria-hidden />
              <span className="text-sm font-semibold text-ice-100">
                {shortlist.length} {shortlist.length === 1 ? 'school' : 'schools'} shortlisted
              </span>
              <span className="hidden text-xs text-ice-400 sm:inline">Saved to Tyler's College Bound profile.</span>
              <Button
                variant="gold"
                className="ml-auto"
                onClick={() => toast('Shortlist sent to the College Bound desk — they will reach out with next steps.')}
              >
                Send to College Bound desk
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
