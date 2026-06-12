import { useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { CheckCheck, Clock, Flag, Save, UserCheck, Users } from 'lucide-react'
import { Breadcrumbs, Button, Card, PageHeader, StatCard, toast } from '../../components/ui'
import { classById, playerById, staffById } from '../../data/seed'
import { DAY_FULL, FlagChips, endOf, flagsFor, fmtTime } from './shared'
import { Avatar } from '../../components/ui'
import type { Player } from '../../lib/types'

type Mark = 'present' | 'late' | 'absent'

const SEGMENTS: { value: Mark; label: string; selected: string }[] = [
  { value: 'present', label: 'Present', selected: 'bg-grass-500 border-grass-500 text-ice-950' },
  { value: 'late', label: 'Late', selected: 'bg-gold-400 border-gold-400 text-ice-950' },
  { value: 'absent', label: 'Absent', selected: 'bg-clay-500 border-clay-500 text-white' },
]

export default function ClassRoster() {
  const { id } = useParams()
  const cls = id ? classById(id) : undefined
  const [marks, setMarks] = useState<Record<string, Mark | undefined>>({})

  const roster = useMemo(
    () => (cls ? cls.enrolled.map(playerById).filter((p): p is Player => Boolean(p)) : []),
    [cls],
  )

  if (!cls) return <Navigate to="/coach" replace />

  const coach = staffById(cls.coachId)
  const markedCount = roster.filter((p) => marks[p.id]).length
  const absentCount = roster.filter((p) => marks[p.id] === 'absent').length
  const flaggedCount = roster.filter((p) => flagsFor(p).length > 0).length
  const unpaidCount = roster.filter((p) => p.flags.unpaid).length

  const setMark = (playerId: string, value: Mark) =>
    setMarks((m) => ({ ...m, [playerId]: m[playerId] === value ? undefined : value }))

  const markAllPresent = () => {
    setMarks(Object.fromEntries(roster.map((p) => [p.id, 'present' as Mark])))
    toast(`All ${roster.length} marked present — adjust any stragglers`)
  }

  const save = () => {
    toast(
      unpaidCount > 0
        ? `Attendance saved — front desk notified of ${unpaidCount} unpaid`
        : 'Attendance saved — roster synced to front desk',
    )
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Today', to: '/coach' }, { label: cls.name }]} />
      <PageHeader
        eyebrow="Coach portal · Dawsonville"
        title={cls.name}
        sub={`${DAY_FULL[cls.day]} · ${fmtTime(cls.start)} – ${endOf(cls.start, cls.durationMin)} · ${cls.cage} · Coach ${coach?.name ?? 'TBD'}`}
      />

      {/* Capacity + no-show summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rise" style={{ animationDelay: '0ms' }}>
          <StatCard label="Enrolled" value={cls.enrolled.length} format={(n) => `${Math.round(n)} / ${cls.capacity}`} icon={<Users size={18} />} />
        </div>
        <div className="rise" style={{ animationDelay: '40ms' }}>
          <StatCard label="Marked" value={markedCount} format={(n) => `${Math.round(n)} of ${roster.length}`} icon={<UserCheck size={18} />} />
        </div>
        <div className="rise" style={{ animationDelay: '80ms' }}>
          <StatCard label="No-shows" value={absentCount} icon={<Clock size={18} />} />
        </div>
        <div className="rise" style={{ animationDelay: '120ms' }}>
          <StatCard label="Flags" value={flaggedCount} icon={<Flag size={18} />} />
        </div>
      </div>

      {/* Bulk actions bar */}
      <Card pad={false} className="rise mt-3 flex flex-wrap items-center justify-between gap-3 px-4 py-3" >
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" onClick={markAllPresent}>
            <CheckCheck size={15} aria-hidden /> Mark all present
          </Button>
          <p className="tabular text-sm text-ice-300" aria-live="polite">
            <span className="font-semibold text-ice-100">{markedCount}</span> of {roster.length} marked
          </p>
        </div>
        <Button onClick={save} disabled={markedCount === 0}>
          <Save size={15} aria-hidden /> Save attendance
        </Button>
      </Card>

      {/* Roster */}
      <Card pad={false} className="rise mt-3">
        <ul className="divide-y divide-ice-700/60">
          {roster.map((p, i) => {
            const current = marks[p.id]
            return (
              <li
                key={p.id}
                className="rise flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3"
                style={{ animationDelay: `${160 + i * 35}ms` }}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3" style={{ minWidth: 180 }}>
                  <Avatar name={p.name} hue={p.hue} size={38} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ice-50">
                      {p.name} <span className="tabular font-normal text-ice-400">#{p.jersey}</span>
                    </p>
                    <p className="text-[11px] text-ice-400">{p.ageGroup} · {p.position}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <FlagChips player={p} />
                </div>
                <div role="group" aria-label={`Attendance for ${p.name}`} className="flex shrink-0 overflow-hidden rounded-md border border-ice-600/60">
                  {SEGMENTS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setMark(p.id, s.value)}
                      aria-pressed={current === s.value}
                      className={`min-h-[36px] border-r border-ice-600/60 px-3 text-xs font-semibold transition-colors last:border-r-0 ${
                        current === s.value ? s.selected : 'bg-ice-900 text-ice-300 hover:bg-ice-700/70 hover:text-ice-100'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
      </Card>
      <p className="mt-3 text-xs text-ice-500">
        Unpaid and eligibility flags come straight from billing and waivers — handle them at the door, not mid-session.
      </p>
    </div>
  )
}
