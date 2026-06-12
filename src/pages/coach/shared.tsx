import { Chip } from '../../components/ui'
import { CLASSES, COACH_ID, playerById } from '../../data/seed'
import type { Player } from '../../lib/types'

/* ---------- Calendar labels ---------- */
export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const DAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const EVAL_LABELS = ['Q3 24', 'Q4 24', 'Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26']

/* ---------- Marcus's slice of the seed ---------- */
export const MY_CLASSES = CLASSES.filter((c) => c.coachId === COACH_ID)

export const MY_PLAYERS: Player[] = (() => {
  const ids = new Set<string>()
  MY_CLASSES.forEach((c) => c.enrolled.forEach((id) => ids.add(id)))
  const list = [...ids].map(playerById).filter((p): p is Player => Boolean(p))
  list.sort((a, b) => (a.id === 'p-tyler' ? -1 : b.id === 'p-tyler' ? 1 : a.name.localeCompare(b.name)))
  return list
})()

/* ---------- Formatting ---------- */
export const fmtTime = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  const hh = h % 12 === 0 ? 12 : h % 12
  return `${hh}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

export const endOf = (start: string, durationMin: number) => {
  const [h, m] = start.split(':').map(Number)
  const total = h * 60 + m + durationMin
  return fmtTime(`${Math.floor(total / 60)}:${total % 60}`)
}

export const fmtDur = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

export const gradeFor = (s: number) =>
  s >= 90 ? 'A' : s >= 80 ? 'A-' : s >= 72 ? 'B+' : s >= 64 ? 'B' : s >= 55 ? 'B-' : s >= 45 ? 'C+' : 'C'

/* ---------- Eligibility flags ---------- */
export interface FlagInfo {
  tone: 'clay' | 'gold'
  label: string
  title: string
}

export const flagsFor = (p: Player): FlagInfo[] => {
  const out: FlagInfo[] = []
  if (p.flags.unpaid) out.push({ tone: 'clay', label: 'Unpaid', title: 'Front desk: collect before session' })
  if (p.flags.gearMissing) out.push({ tone: 'gold', label: 'No cleats', title: `Missing gear: ${p.flags.gearMissing} — loaner bin by Cage 1` })
  if (p.flags.waiver) out.push({ tone: 'gold', label: 'Waiver missing', title: 'No waiver on file — cannot take live BP until signed' })
  return out
}

export function FlagChips({ player }: { player: Player }) {
  const fl = flagsFor(player)
  if (fl.length === 0) return null
  return (
    <>
      {fl.map((f) => (
        <span key={f.label} title={f.title}>
          <Chip tone={f.tone}>{f.label}</Chip>
        </span>
      ))}
    </>
  )
}
