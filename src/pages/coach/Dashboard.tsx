import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlarmClock, ArrowRight, ChevronRight, Flag, Send, TrendingDown, Users, Video } from 'lucide-react'
import { Button, Card, CardTitle, Chip, PageHeader, StatCard, toast } from '../../components/ui'
import { Sparkline } from '../../components/charts'
import { COACH_ID, PLAYERS, SESSION_NOTES, VIDEOS, playerById, staffById } from '../../data/seed'
import { DAY_LABELS, MY_CLASSES, MY_PLAYERS, endOf, flagsFor, fmtTime } from './shared'
import type { Player } from '../../lib/types'

const lastDelta = (p: Player) => {
  const t = p.compositeTrend
  return t[t.length - 1] - t[t.length - 2]
}

export default function CoachDashboard() {
  const [clockedIn, setClockedIn] = useState(staffById(COACH_ID)?.clockedIn ?? false)

  const sessions = useMemo(() => [...MY_CLASSES].sort((a, b) => a.start.localeCompare(b.start)), [])
  const reviewQueue = useMemo(() => VIDEOS.filter((v) => v.status === 'review'), [])

  // Players whose latest composite dipped vs. the previous eval (fallback: smallest movers)
  const dippers = useMemo(() => {
    const dipped = PLAYERS.filter((p) => p.compositeTrend.length >= 2 && lastDelta(p) < 0)
    const pool = dipped.length >= 2 ? dipped : [...PLAYERS].sort((a, b) => lastDelta(a) - lastDelta(b))
    return pool.slice(0, 2)
  }, [])

  const toggleClock = () => {
    const next = !clockedIn
    setClockedIn(next)
    toast(next ? 'Clocked in — shift runs 2:00–8:00 PM' : 'Clocked out — hours synced to the timeclock')
  }

  const flagCount = (enrolled: string[]) =>
    enrolled.reduce((n, id) => {
      const p = playerById(id)
      return n + (p && flagsFor(p).length > 0 ? 1 : 0)
    }, 0)

  return (
    <div>
      <PageHeader
        eyebrow="Coach portal · Dawsonville"
        title="Good afternoon, Marcus"
        sub={`Friday, June 12 — ${sessions.length} sessions on the board, ${reviewQueue.length} clips waiting on your eyes.`}
        action={
          <Link to="/coach/schedule">
            <Button variant="ghost">Full schedule <ArrowRight size={15} /></Button>
          </Link>
        }
      />

      {/* Quick stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rise" style={{ animationDelay: '0ms' }}>
          <StatCard label="Players coached" value={MY_PLAYERS.length} icon={<Users size={18} />} />
        </div>
        <div className="rise" style={{ animationDelay: '50ms' }}>
          <StatCard label="Notes sent this week" value={SESSION_NOTES.length} icon={<Send size={18} />} />
        </div>
        <div className="rise" style={{ animationDelay: '100ms' }}>
          <StatCard label="Video review queue" value={reviewQueue.length} icon={<Video size={18} />} />
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {/* Today's sessions */}
        <Card className="rise lg:col-span-2">
          <CardTitle
            action={<Link to="/coach/schedule" className="text-xs font-semibold text-frost-300 hover:text-frost-200">Week view →</Link>}
          >
            Your sessions
          </CardTitle>
          <div className="space-y-2">
            {sessions.map((c, i) => {
              const flags = flagCount(c.enrolled)
              return (
                <Link
                  key={c.id}
                  to={`/coach/classes/${c.id}`}
                  className="rise group flex items-center gap-3 rounded-[10px] border border-ice-600/40 bg-ice-850 px-3.5 py-3 transition-colors hover:border-frost-400/60"
                  style={{ animationDelay: `${120 + i * 50}ms` }}
                >
                  <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-ice-600/50 bg-ice-900">
                    <span className="eyebrow text-frost-300">{DAY_LABELS[c.day]}</span>
                    <span className="display tabular text-sm font-bold text-ice-100">{fmtTime(c.start).replace(/ [AP]M/, '')}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-semibold text-ice-50">{c.name}</span>
                      {c.type === 'lesson' && <Chip tone="frost">Private</Chip>}
                    </span>
                    <span className="mt-0.5 block text-xs text-ice-400">
                      {fmtTime(c.start)} – {endOf(c.start, c.durationMin)} · {c.cage}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2.5">
                    {flags > 0 && (
                      <Chip tone="clay" icon={<Flag size={11} aria-hidden />}>{flags} {flags === 1 ? 'flag' : 'flags'}</Chip>
                    )}
                    <span className="tabular hidden text-sm font-semibold text-ice-200 sm:block">
                      {c.enrolled.length} <span className="text-ice-500">/ {c.capacity}</span>
                    </span>
                    <ChevronRight size={16} className="text-ice-500 transition-colors group-hover:text-frost-300" aria-hidden />
                  </span>
                </Link>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-ice-500">Tap a session to run attendance — flags surface before the kids hit the cage.</p>
        </Card>

        <div className="space-y-3">
          {/* Clock-in */}
          <Card className="rise">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="eyebrow text-ice-400">Timeclock</p>
                <p className="display mt-1 text-2xl font-semibold uppercase tracking-wide text-ice-50">
                  {clockedIn ? 'On the clock' : 'Off the clock'}
                </p>
                <p className="mt-1 text-xs text-ice-400">Today's shift · 2:00 – 8:00 PM</p>
              </div>
              <span
                className={`mt-1 inline-flex h-2.5 w-2.5 rounded-full ${clockedIn ? 'bg-grass-400 shadow-[0_0_8px_rgba(74,222,128,0.7)]' : 'bg-ice-500'}`}
                aria-hidden
              />
            </div>
            <Button onClick={toggleClock} variant={clockedIn ? 'ghost' : 'primary'} className="mt-4 w-full">
              <AlarmClock size={15} aria-hidden /> {clockedIn ? 'Clock out' : 'Clock in'}
            </Button>
          </Card>

          {/* Needs your eyes */}
          <Card className="rise">
            <CardTitle>Needs your eyes</CardTitle>
            <div className="space-y-2">
              {reviewQueue.map((v) => (
                <Link
                  key={v.id}
                  to="/coach/video"
                  className="flex items-center gap-2.5 rounded-lg border border-ice-600/40 bg-ice-850 px-3 py-2.5 transition-colors hover:border-gold-400/50"
                >
                  <Video size={16} className="shrink-0 text-gold-300" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ice-100">{v.title}</span>
                    <span className="block text-[11px] text-ice-400">{playerById(v.playerId)?.name} · {v.date}</span>
                  </span>
                  <Chip tone="gold">Review</Chip>
                </Link>
              ))}
              {dippers.map((p) => (
                <Link
                  key={p.id}
                  to={`/coach/players/${p.id}`}
                  className="flex items-center gap-2.5 rounded-lg border border-ice-600/40 bg-ice-850 px-3 py-2.5 transition-colors hover:border-clay-400/50"
                >
                  <TrendingDown size={16} className="shrink-0 text-clay-300" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ice-100">{p.name}</span>
                    <span className="tabular block text-[11px] text-ice-400">
                      Composite {p.compositeTrend[p.compositeTrend.length - 2]} → {p.compositeTrend[p.compositeTrend.length - 1]} since last eval
                    </span>
                  </span>
                  <Sparkline data={p.compositeTrend} width={56} height={20} stroke="var(--color-clay-400)" />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
