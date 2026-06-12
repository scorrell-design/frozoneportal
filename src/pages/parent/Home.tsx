import { Link } from 'react-router-dom'
import { Activity, ArrowRight, BedDouble, CalendarDays, CreditCard, MapPin, MessageSquare, Star, Wallet } from 'lucide-react'
import { Avatar, Button, Card, CardTitle, Chip, PageHeader, RockReadyRing } from '../../components/ui'
import { CLASSES, SESSION_NOTES, TYLER, WELLNESS, WHITMAN, drillById, staffById } from '../../data/seed'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const fmtTime = (s: string) => {
  const [h, m] = s.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}
const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function HomePage() {
  const latest = SESSION_NOTES[0]
  const upcoming = CLASSES
    .filter((c) => c.enrolled.includes(TYLER.id))
    .sort((a, b) => a.day - b.day || a.start.localeCompare(b.start))
  const week = WELLNESS[WELLNESS.length - 1]

  return (
    <div>
      <PageHeader
        eyebrow="Parent portal · Whitman family"
        title="Whitman family"
        sub="Tyler's development, his week, and the bill — one honest view."
      />

      <div className="grid gap-3 lg:grid-cols-3">
        {/* Tyler summary */}
        <Card className="rise">
          <div className="flex items-center gap-3">
            <Avatar name={TYLER.name} hue={TYLER.hue} size={44} />
            <div className="min-w-0">
              <p className="display truncate text-xl font-semibold uppercase tracking-wide text-ice-50">{TYLER.name}</p>
              <p className="text-xs text-ice-400">#{TYLER.jersey} · {TYLER.ageGroup} · {TYLER.position}</p>
            </div>
            <span className="ml-auto"><Chip tone="frost">Prospect</Chip></span>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <RockReadyRing score={TYLER.composite} size={118} />
            <div>
              <p className="text-sm font-semibold text-grass-400">+4 since March</p>
              <p className="mt-1 text-xs leading-relaxed text-ice-400">
                Quarterly eval, recorded in person by Coach Marcus. Next re-test July 1.
              </p>
              <Link to="/parent/progress" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-frost-300 hover:text-frost-200">
                Full progress <ArrowRight size={12} aria-hidden />
              </Link>
            </div>
          </div>
        </Card>

        {/* Latest from Coach Marcus */}
        <Card className="rise lg:col-span-2" >
          <CardTitle action={<span className="text-xs text-ice-400">{latest.date}</span>}>Latest from Coach Marcus</CardTitle>
          <p className="text-sm font-semibold text-frost-300">{latest.focus}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ice-200">{latest.workedOn}</p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="eyebrow text-ice-400">Homework</span>
            {latest.homework.map((id) => (
              <Chip key={id} tone="gold">{drillById(id)?.title}</Chip>
            ))}
          </div>
          <p className="mt-3 border-l-2 border-frost-400/50 pl-3 text-sm italic text-ice-300">“{latest.nextFocus}”</p>
          <div className="mt-4">
            <Link to="/parent/messages">
              <Button variant="ghost"><MessageSquare size={15} aria-hidden /> Reply to Marcus</Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {/* Next up */}
        <Card className="rise" >
          <CardTitle action={<Link to="/parent/schedule" className="text-xs font-semibold text-frost-300 hover:text-frost-200">Full schedule</Link>}>
            Next up
          </CardTitle>
          <ul className="space-y-2.5">
            {upcoming.map((c) => (
              <li key={c.id} className="flex items-start gap-2.5 rounded-lg border border-ice-600/40 bg-ice-900/60 p-2.5">
                <CalendarDays size={16} className="mt-0.5 shrink-0 text-frost-400" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ice-100">{c.name}</p>
                  <p className="tabular mt-0.5 text-xs text-ice-400">
                    {DAYS[c.day]} · {fmtTime(c.start)} · {c.durationMin} min
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs text-ice-300"><MapPin size={12} aria-hidden />{c.cage}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-xs text-ice-500">All sessions led by {staffById(latest.coachId)?.name}.</p>
        </Card>

        {/* Account strip */}
        <Card className="rise" pad={false}>
          <div className="p-4 pb-2 sm:p-5 sm:pb-2"><CardTitle>Account</CardTitle></div>
          <div className="divide-y divide-ice-600/30">
            <Link to="/parent/billing" className="flex items-center gap-3 px-4 py-3 hover:bg-ice-700/40 sm:px-5">
              <Wallet size={17} className="text-frost-400" aria-hidden />
              <span className="text-sm text-ice-200">Stored balance</span>
              <span className="tabular ml-auto text-sm font-bold text-ice-50">{money(WHITMAN.storedBalance)}</span>
              <ArrowRight size={13} className="text-ice-500" aria-hidden />
            </Link>
            <Link to="/parent/shop" className="flex items-center gap-3 px-4 py-3 hover:bg-ice-700/40 sm:px-5">
              <Star size={17} className="text-gold-400" aria-hidden />
              <span className="text-sm text-ice-200">Reward points</span>
              <span className="tabular ml-auto text-sm font-bold text-gold-300">{WHITMAN.rewardPoints.toLocaleString()}</span>
              <ArrowRight size={13} className="text-ice-500" aria-hidden />
            </Link>
            <Link to="/parent/billing" className="flex items-center gap-3 px-4 py-3 hover:bg-ice-700/40 sm:px-5">
              <CreditCard size={17} className="text-frost-400" aria-hidden />
              <span className="text-sm text-ice-200">Prospect · $149/mo</span>
              <span className="ml-auto"><Chip tone="grass">Paid Jun 1</Chip></span>
              <ArrowRight size={13} className="text-ice-500" aria-hidden />
            </Link>
          </div>
        </Card>

        {/* Wellness at a glance */}
        <Card className="rise">
          <CardTitle action={<Link to="/parent/wellness" className="text-xs font-semibold text-frost-300 hover:text-frost-200">Details</Link>}>
            This week's wellness
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Chip tone="grass" icon={<BedDouble size={12} aria-hidden />}>Sleep {week.sleepHrs}h</Chip>
            <Chip tone="grass" icon={<Activity size={12} aria-hidden />}>Workload {week.throwingLoad}/{week.loadLimit}</Chip>
            <Chip tone="ice">Soreness {week.soreness}/5</Chip>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ice-400">
            Tyler is under his weekly throwing cap with sleep trending up. Marcus reviews this before every session.
          </p>
          <Link to="/parent/wellness" className="mt-3 inline-block">
            <Button variant="ghost">Log this week</Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
