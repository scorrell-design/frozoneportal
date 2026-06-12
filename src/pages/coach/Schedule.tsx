import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react'
import { Card, Chip, PageHeader } from '../../components/ui'
import { DAY_FULL, MY_CLASSES, MY_PLAYERS, endOf, fmtTime } from './shared'
import type { ProgramClass } from '../../lib/types'

const WEEK_DAYS = [0, 1, 2, 3, 4, 5] // Mon–Sat

function SessionCard({ c, delay }: { c: ProgramClass; delay: number }) {
  const pct = Math.round((c.enrolled.length / c.capacity) * 100)
  return (
    <Link
      to={`/coach/classes/${c.id}`}
      className="rise block rounded-[10px] border border-ice-600/40 bg-ice-850 p-3.5 transition-colors hover:border-frost-400/60"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-snug text-ice-50">{c.name}</p>
        {c.type === 'lesson' && <Chip tone="frost">Private</Chip>}
      </div>
      <p className="tabular mt-1.5 flex items-center gap-1.5 text-xs text-ice-300">
        <Clock size={12} aria-hidden /> {fmtTime(c.start)} – {endOf(c.start, c.durationMin)}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-ice-400">
        <MapPin size={12} aria-hidden /> {c.cage}
      </p>
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-ice-400">
          <span className="flex items-center gap-1"><Users size={11} aria-hidden /> Enrolled</span>
          <span className="tabular font-semibold text-ice-200">{c.enrolled.length} / {c.capacity}</span>
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-ice-700" role="img" aria-label={`${c.enrolled.length} of ${c.capacity} spots filled`}>
          <div
            className={`h-full rounded-full ${pct >= 90 ? 'bg-gold-400' : 'bg-frost-400'}`}
            style={{ width: `${pct}%`, transition: 'width 600ms cubic-bezier(0.22,1,0.36,1)' }}
          />
        </div>
      </div>
    </Link>
  )
}

export default function CoachSchedule() {
  const byDay = useMemo(() => {
    const map = new Map<number, ProgramClass[]>()
    WEEK_DAYS.forEach((d) => map.set(d, MY_CLASSES.filter((c) => c.day === d).sort((a, b) => a.start.localeCompare(b.start))))
    return map
  }, [])

  const weeklyHours = MY_CLASSES.reduce((s, c) => s + c.durationMin, 0) / 60
  const coachingDays = WEEK_DAYS.filter((d) => (byDay.get(d) ?? []).length > 0).length

  return (
    <div>
      <PageHeader
        eyebrow="Coach portal · Dawsonville"
        title="My schedule"
        sub="Week of June 8 — tap any session to run the roster."
      />

      {/* Weekly summary line */}
      <Card pad={false} className="rise mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <p className="flex items-center gap-2 text-sm text-ice-200">
          <CalendarDays size={15} className="text-frost-400" aria-hidden />
          <span className="tabular font-semibold text-ice-50">{weeklyHours.toFixed(1)} coaching hours</span> this week
        </p>
        <p className="tabular text-sm text-ice-300">{MY_CLASSES.length} sessions · {coachingDays} days on the floor · {MY_PLAYERS.length} players across rosters</p>
      </Card>

      {/* Mon–Sat columns; stacks as day sections on mobile */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {WEEK_DAYS.map((d, col) => {
          const sessions = byDay.get(d) ?? []
          return (
            <section key={d} aria-label={DAY_FULL[d]} className="rise" style={{ animationDelay: `${col * 40}ms` }}>
              <header className="mb-2 flex items-baseline justify-between px-1">
                <h2 className="display text-sm font-semibold uppercase tracking-wider text-ice-100">{DAY_FULL[d]}</h2>
                <span className="tabular text-[11px] text-ice-400">
                  {sessions.length === 0 ? 'Open' : `${sessions.length} ${sessions.length === 1 ? 'session' : 'sessions'}`}
                </span>
              </header>
              <div className="space-y-2">
                {sessions.length === 0 ? (
                  <div className="rounded-[10px] border border-dashed border-ice-600/50 px-3 py-6 text-center text-xs text-ice-500">
                    No sessions — open for makeups and privates
                  </div>
                ) : (
                  sessions.map((c, i) => <SessionCard key={c.id} c={c} delay={col * 40 + i * 50} />)
                )}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
