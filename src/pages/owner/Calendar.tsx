import { useState } from 'react'
import { ClipboardCheck, MapPin, User } from 'lucide-react'
import { Avatar, Chip, Modal, PageHeader, Tabs } from '../../components/ui'
import { CAGES, CLASSES, playerById, staffById } from '../../data/seed'
import type { ProgramClass } from '../../lib/types'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DATES = [8, 9, 10, 11, 12, 13, 14] // week of Jun 8–14
const TODAY = 4 // Friday Jun 12

const fmtTime = (s: string) => {
  const [h, m] = s.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

const endTime = (start: string, durationMin: number) => {
  const [h, m] = start.split(':').map(Number)
  const total = h * 60 + m + durationMin
  return fmtTime(`${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`)
}

const TYPE_META: Record<ProgramClass['type'], { label: string; bar: string }> = {
  class: { label: 'Class', bar: 'bg-frost-400' },
  lesson: { label: 'Lesson', bar: 'bg-gold-400' },
  camp: { label: 'Camp', bar: 'bg-grass-500' },
  rental: { label: 'Rental', bar: 'bg-ice-400' },
}

function ClassBlock({ cls, onOpen }: { cls: ProgramClass; onOpen: (c: ProgramClass) => void }) {
  const coach = staffById(cls.coachId)
  const pct = Math.min(100, Math.round((cls.enrolled.length / cls.capacity) * 100))
  return (
    <button
      onClick={() => onOpen(cls)}
      aria-label={`${cls.name}, ${fmtTime(cls.start)} to ${endTime(cls.start, cls.durationMin)}, ${cls.enrolled.length} of ${cls.capacity} enrolled — open roster`}
      className="group w-full rounded-lg border border-ice-600/40 bg-ice-900/70 p-2.5 text-left transition-colors hover:border-frost-400/50 hover:bg-ice-700/50"
    >
      <div className="flex items-start gap-2">
        <span className={`mt-0.5 h-8 w-1 shrink-0 rounded-full ${TYPE_META[cls.type].bar}`} aria-hidden />
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-ice-100 group-hover:text-frost-200">{cls.name}</p>
          <p className="tabular mt-0.5 text-[11px] text-ice-400">{fmtTime(cls.start)}–{endTime(cls.start, cls.durationMin)}</p>
          <p className="truncate text-[11px] text-ice-400">{coach?.name ?? 'Staff'}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <div className="h-1 flex-1 rounded-full bg-ice-700" role="img" aria-label={`${pct}% full`}>
          <div className={`h-1 rounded-full ${pct >= 100 ? 'bg-clay-400' : pct >= 80 ? 'bg-gold-400' : 'bg-grass-500'}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="tabular text-[10px] font-semibold text-ice-300">{cls.enrolled.length}/{cls.capacity}</span>
      </div>
    </button>
  )
}

function WeekView({ onOpen }: { onOpen: (c: ProgramClass) => void }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[1000px] grid-cols-7 gap-2">
        {DAYS.map((day, i) => {
          const classes = CLASSES.filter((c) => c.day === i).sort((a, b) => a.start.localeCompare(b.start))
          const isToday = i === TODAY
          return (
            <div key={day} className={`rounded-lg border p-2 ${isToday ? 'border-frost-400/50 bg-frost-400/5' : 'border-ice-600/30 bg-ice-900/40'}`}>
              <div className="mb-2 flex items-center justify-between px-0.5">
                <p className={`eyebrow ${isToday ? 'text-frost-300' : 'text-ice-400'}`}>{day} {DATES[i]}</p>
                {isToday && <Chip tone="frost">Today</Chip>}
              </div>
              {classes.length > 0 ? (
                <div className="space-y-2">
                  {classes.map((c) => <ClassBlock key={c.id} cls={c} onOpen={onOpen} />)}
                </div>
              ) : (
                <p className="px-0.5 py-3 text-center text-[11px] text-ice-400">Open day</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CageGrid({ onOpen }: { onOpen: (c: ProgramClass) => void }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="min-w-[1000px]">
        <div className="grid grid-cols-[110px_repeat(7,1fr)] gap-1.5">
          <span className="eyebrow px-1 py-1.5 text-ice-400">Resource</span>
          {DAYS.map((day, i) => (
            <div key={day} className={`flex items-center justify-center gap-1.5 rounded px-1 py-1.5 ${i === TODAY ? 'bg-frost-400/10' : ''}`}>
              {i === TODAY && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-frost-400" aria-hidden />}
              <span className={`eyebrow ${i === TODAY ? 'text-frost-300' : 'text-ice-400'}`}>
                {day} {DATES[i]}{i === TODAY ? ' · now' : ''}
              </span>
            </div>
          ))}
          {CAGES.map((cage) => (
            <div key={cage} className="contents">
              <div className="flex items-center gap-1.5 rounded-md border border-ice-600/30 bg-ice-900/60 px-2 py-2">
                <MapPin size={12} className="shrink-0 text-frost-400" aria-hidden />
                <span className="truncate text-xs font-semibold text-ice-100">{cage}</span>
              </div>
              {DAYS.map((day, i) => {
                const booked = CLASSES.filter((c) => c.cage === cage && c.day === i).sort((a, b) => a.start.localeCompare(b.start))
                const isToday = i === TODAY
                return (
                  <div
                    key={`${cage}-${day}`}
                    className={`min-h-[52px] rounded-md border p-1 ${
                      isToday ? 'border-frost-400/40 bg-frost-400/5' : 'border-ice-600/25 bg-ice-900/30'
                    }`}
                  >
                    {booked.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => onOpen(c)}
                        aria-label={`${c.name} in ${cage}, ${fmtTime(c.start)} — open roster`}
                        className="mb-1 block w-full rounded border border-ice-600/40 bg-ice-800 px-1.5 py-1 text-left transition-colors last:mb-0 hover:border-frost-400/50 hover:bg-ice-700/60"
                      >
                        <p className="truncate text-[10px] font-semibold text-ice-100">{c.name}</p>
                        <p className="tabular text-[10px] text-ice-400">{fmtTime(c.start)} · {c.durationMin}m</p>
                      </button>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const [tab, setTab] = useState('week')
  const [selected, setSelected] = useState<ProgramClass | null>(null)
  const coach = selected ? staffById(selected.coachId) : undefined

  return (
    <div>
      <PageHeader
        eyebrow="Programs & cages · week of Jun 8–14"
        title="The board"
        sub="Every program and every cage, one week at a time. Click any block for the roster."
      />

      <div className="rise">
        <Tabs
          tabs={[
            { id: 'week', label: 'Week program calendar' },
            { id: 'cages', label: 'Cage grid' },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      <div className="rise mb-3 flex flex-wrap items-center gap-3" style={{ animationDelay: '50ms' }}>
        {(Object.keys(TYPE_META) as ProgramClass['type'][]).map((t) => (
          <span key={t} className="flex items-center gap-1.5 text-xs text-ice-300">
            <span className={`h-2.5 w-1 rounded-full ${TYPE_META[t].bar}`} aria-hidden />
            {TYPE_META[t].label}
          </span>
        ))}
      </div>

      <div className="rise" style={{ animationDelay: '100ms' }}>
        {tab === 'week' ? <WeekView onOpen={setSelected} /> : <CageGrid onOpen={setSelected} />}
      </div>

      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.name ?? 'Class'} wide>
        {selected && (
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Chip tone="frost">{DAYS[selected.day]} · {fmtTime(selected.start)}–{endTime(selected.start, selected.durationMin)}</Chip>
              <Chip tone="ice" icon={<MapPin size={11} aria-hidden />}>{selected.cage}</Chip>
              <Chip tone="ice" icon={<User size={11} aria-hidden />}>{coach?.name ?? 'Staff'}</Chip>
              <Chip tone={selected.enrolled.length >= selected.capacity ? 'clay' : 'grass'}>
                {selected.enrolled.length}/{selected.capacity} enrolled
              </Chip>
            </div>
            <p className="eyebrow mb-2 text-ice-400">Roster preview</p>
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {selected.enrolled.map((pid) => {
                const player = playerById(pid)
                if (!player) return null
                return (
                  <li key={pid} className="flex items-center gap-2.5 rounded-md border border-ice-600/30 bg-ice-900/60 px-2.5 py-2">
                    <Avatar name={player.name} hue={player.hue} size={28} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ice-100">{player.name}</p>
                      <p className="text-[11px] text-ice-400">{player.ageGroup} · {player.position}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
            <p className="mt-4 flex items-start gap-2 rounded-md border border-ice-600/30 bg-ice-900/60 px-3 py-2.5 text-xs leading-relaxed text-ice-300">
              <ClipboardCheck size={14} className="mt-0.5 shrink-0 text-frost-400" aria-hidden />
              Attendance is taken by {coach?.name ?? 'the coach'} from the coach roster view at session time — present, late, and absent marks flow straight to parents.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
