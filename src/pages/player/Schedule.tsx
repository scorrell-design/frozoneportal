import { CalendarDays, MapPin, Sparkles, User } from 'lucide-react'
import { Card, Chip, PageHeader } from '../../components/ui'
import { CLASSES, TYLER, staffById } from '../../data/seed'
import type { ProgramClass } from '../../lib/types'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const fmtTime = (s: string) => {
  const [h, m] = s.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

const endOf = (start: string, durationMin: number) => {
  const [h, m] = start.split(':').map(Number)
  const total = h * 60 + m + durationMin
  return fmtTime(`${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`)
}

const TYPE_TONE: Record<ProgramClass['type'], 'frost' | 'gold' | 'grass' | 'ice'> = {
  class: 'ice',
  lesson: 'frost',
  camp: 'gold',
  rental: 'grass',
}

const TYPE_LABEL: Record<ProgramClass['type'], string> = {
  class: 'Class',
  lesson: 'Private lesson',
  camp: 'Camp',
  rental: 'Cage rental',
}

export default function PlayerSchedule() {
  const mine = CLASSES
    .filter((c) => c.enrolled.includes(TYLER.id))
    .sort((a, b) => a.day - b.day || a.start.localeCompare(b.start))
  const sessionDays = new Set(mine.map((c) => c.day))

  return (
    <div>
      <PageHeader
        eyebrow="Player portal · My schedule"
        title="Your week"
        sub={`${mine.length} sessions on the board — show up early, leave it all in the cage.`}
      />

      {/* Week strip */}
      <div className="rise mb-4 grid grid-cols-7 gap-1.5 sm:gap-2">
        {DAY_SHORT.map((d, i) => {
          const has = sessionDays.has(i)
          return (
            <div
              key={d}
              className={`flex flex-col items-center gap-1 rounded-lg border py-2.5 ${
                has ? 'border-frost-400/40 bg-frost-400/10' : 'border-ice-600/40 bg-ice-900'
              }`}
            >
              <span className={`eyebrow ${has ? 'text-frost-300' : 'text-ice-400'}`}>{d}</span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${has ? 'bg-frost-400' : 'bg-ice-700'}`}
                aria-hidden
              />
              <span className="sr-only">{has ? `Session ${DAYS[i]}` : `No session ${DAYS[i]}`}</span>
            </div>
          )
        })}
      </div>

      {/* Agenda */}
      <div className="space-y-3">
        {DAYS.map((day, di) => {
          const sessions = mine.filter((c) => c.day === di)
          if (sessions.length === 0) return null
          return (
            <Card key={day} className="rise" pad={false}>
              <div className="border-b border-ice-600/30 px-4 py-2.5 sm:px-5">
                <p className="eyebrow text-frost-300">{day}</p>
              </div>
              <div className="divide-y divide-ice-600/30">
                {sessions.map((c) => {
                  const coach = staffById(c.coachId)
                  const isPrivate = c.type === 'lesson'
                  return (
                    <div
                      key={c.id}
                      className={`flex items-center gap-3.5 px-4 py-3.5 transition-colors sm:px-5 ${
                        isPrivate ? 'bg-frost-400/5' : 'hover:bg-ice-700/30'
                      }`}
                    >
                      <span
                        className={`flex h-12 w-16 shrink-0 flex-col items-center justify-center rounded-lg border ${
                          isPrivate
                            ? 'border-frost-400/50 bg-ice-900'
                            : 'border-ice-600/50 bg-ice-900'
                        }`}
                      >
                        <span className="display tabular text-sm font-bold text-ice-100">{fmtTime(c.start).replace(/ [AP]M/, '')}</span>
                        <span className="eyebrow text-ice-400">{fmtTime(c.start).slice(-2)}</span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-ice-50">{c.name}</p>
                          <Chip tone={TYPE_TONE[c.type]} icon={isPrivate ? <Sparkles size={11} aria-hidden /> : undefined}>
                            {TYPE_LABEL[c.type]}
                          </Chip>
                        </div>
                        <p className="tabular mt-1 text-xs text-ice-400">
                          {fmtTime(c.start)} – {endOf(c.start, c.durationMin)} · {c.durationMin} min
                        </p>
                        {isPrivate && (
                          <p className="mt-1 text-xs text-frost-300">
                            One-on-one with Coach Marcus — your timing work goes live arm.
                          </p>
                        )}
                      </div>
                      <div className="hidden shrink-0 flex-col items-end gap-1 text-xs text-ice-300 sm:flex">
                        <span className="flex items-center gap-1"><MapPin size={12} aria-hidden />{c.cage}</span>
                        <span className="flex items-center gap-1"><User size={12} aria-hidden />{coach?.name}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )
        })}
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-ice-400">
        <CalendarDays size={14} aria-hidden />
        Rock Ready re-test: July 1, 4:00 PM, Cage 1 — it's on the board.
      </p>
    </div>
  )
}
