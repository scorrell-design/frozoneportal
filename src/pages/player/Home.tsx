import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Check, Flame, MapPin, Star, Target, Video } from 'lucide-react'
import { Button, Card, CardTitle, Chip, PageHeader, RockReadyRing, toast } from '../../components/ui'
import { CLASSES, SESSION_NOTES, TYLER, drillById, staffById } from '../../data/seed'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const fmtTime = (s: string) => {
  const [h, m] = s.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

const QUICK_LINKS = [
  { to: '/player/videos', label: 'My videos', sub: 'Coach-approved clips', icon: Video },
  { to: '/player/reps', label: 'Quality reps', sub: 'Log tonight’s work', icon: Target },
  { to: '/player/rewards', label: 'Rewards', sub: 'Diamond Dollars', icon: Star },
]

export default function PlayerHome() {
  const latest = SESSION_NOTES[0]
  const nextSession = CLASSES
    .filter((c) => c.enrolled.includes(TYLER.id))
    .sort((a, b) => a.day - b.day || a.start.localeCompare(b.start))[0]
  const coach = staffById(nextSession.coachId)
  const homework = latest.homework.map((id) => drillById(id)).filter((d) => d !== undefined)
  const [done, setDone] = useState<Set<string>>(new Set())

  const markDone = (id: string, title: string) => {
    setDone((prev) => new Set(prev).add(id))
    toast(`${title} marked done — Coach Marcus will see it.`)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Player portal · 12U Prospect"
        title="Let's go, Tyler"
        sub="Your swing is trending up. Here's the plan — make every rep count."
      />

      <div className="grid gap-3 lg:grid-cols-3">
        {/* Rock Ready hero */}
        <Card className="rise lg:col-span-2">
          <div className="flex flex-wrap items-center gap-5 sm:gap-8">
            <RockReadyRing score={TYLER.composite} size={150} />
            <div className="min-w-0 flex-1">
              <p className="eyebrow text-ice-400">Rock Ready composite</p>
              <p className="mt-1 text-sm font-semibold text-grass-400">+4 since March</p>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ice-300">
                Your Strength Index leads the whole 12U board. Grip is the one thing
                between you and the next jump — rice bucket tonight.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Chip tone="gold" icon={<Flame size={12} aria-hidden />}>11-day practice streak</Chip>
                <Chip tone="frost">#{TYLER.jersey} · {TYLER.position}</Chip>
              </div>
              <Link
                to="/player/development"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-frost-300 hover:text-frost-200"
              >
                See your full development <ArrowRight size={12} aria-hidden />
              </Link>
            </div>
          </div>
        </Card>

        {/* Next session */}
        <Card className="rise" >
          <CardTitle action={<Link to="/player/schedule" className="text-xs font-semibold text-frost-300 hover:text-frost-200">Full week</Link>}>
            Next session
          </CardTitle>
          <div className="rounded-[10px] border border-frost-400/30 bg-ice-900/70 p-3.5">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="shrink-0 text-frost-400" aria-hidden />
              <p className="truncate text-sm font-semibold text-ice-50">{nextSession.name}</p>
            </div>
            <p className="tabular mt-1.5 text-xs text-ice-300">
              {DAYS[nextSession.day]} · {fmtTime(nextSession.start)} · {nextSession.durationMin} min
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-ice-400">
              <span className="flex items-center gap-1"><MapPin size={12} aria-hidden />{nextSession.cage}</span>
              <span>·</span>
              <span>Coach {coach?.name.split(' ')[0]}</span>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ice-400">
            Bring the gray bat — Friday you go live arm with the early trigger.
          </p>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {/* Homework */}
        <Card className="rise lg:col-span-2">
          <CardTitle action={<Link to="/player/drills" className="text-xs font-semibold text-frost-300 hover:text-frost-200">All drills</Link>}>
            Your homework
          </CardTitle>
          <div className="space-y-2">
            {homework.map((d) => {
              const isDone = done.has(d.id)
              return (
                <div
                  key={d.id}
                  className={`flex items-center gap-3 rounded-[10px] border p-3 transition-colors ${
                    isDone ? 'border-grass-500/40 bg-grass-500/5' : 'border-ice-600/40 bg-ice-850 hover:border-frost-400/50'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                      isDone ? 'border-grass-500/60 bg-grass-500/20 text-grass-400' : 'border-ice-600/60 bg-ice-900 text-ice-500'
                    }`}
                    aria-hidden
                  >
                    <Check size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-semibold ${isDone ? 'text-grass-400' : 'text-ice-100'}`}>{d.title}</p>
                    <p className="mt-0.5 text-xs text-ice-400">{d.duration} · {d.equipment}</p>
                  </div>
                  {isDone ? (
                    <Chip tone="grass">Done</Chip>
                  ) : (
                    <Button variant="ghost" onClick={() => markDone(d.id, d.title)}>Mark done</Button>
                  )}
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-ice-400">Assigned by Coach Marcus after Tuesday's session. Quality beats volume.</p>
        </Card>

        {/* Latest coach note */}
        <Card className="rise">
          <CardTitle action={<span className="text-xs text-ice-400">{latest.date}</span>}>From Coach Marcus</CardTitle>
          <p className="text-sm font-semibold text-frost-300">{latest.focus}</p>
          <p className="mt-2 border-l-2 border-frost-400/50 pl-3 text-sm italic leading-relaxed text-ice-300">
            “{latest.nextFocus}”
          </p>
          <Link to="/player/development" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-frost-300 hover:text-frost-200">
            Read the full note <ArrowRight size={12} aria-hidden />
          </Link>
        </Card>
      </div>

      {/* Quick links */}
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {QUICK_LINKS.map(({ to, label, sub, icon: Icon }, i) => (
          <Link
            key={to}
            to={to}
            className="rise group flex items-center gap-3 rounded-[10px] border border-ice-600/40 bg-ice-800 p-4 transition-colors hover:border-frost-400/60"
            style={{ animationDelay: `${150 + i * 50}ms` }}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-ice-600/50 bg-ice-900 text-frost-400">
              <Icon size={18} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="display block text-sm font-semibold text-ice-50">{label}</span>
              <span className="block text-xs text-ice-400">{sub}</span>
            </span>
            <ArrowRight size={15} className="text-ice-500 transition-colors group-hover:text-frost-300" aria-hidden />
          </Link>
        ))}
      </div>
    </div>
  )
}
