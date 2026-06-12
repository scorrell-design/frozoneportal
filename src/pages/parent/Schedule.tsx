import { useState } from 'react'
import { CalendarDays, Clock, MapPin, Plus } from 'lucide-react'
import { Button, Card, CardTitle, Chip, Modal, PageHeader, toast } from '../../components/ui'
import { CLASSES, PRODUCTS, TYLER, staffById } from '../../data/seed'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const fmtTime = (s: string) => {
  const [h, m] = s.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}
const addMin = (s: string, mins: number) => {
  const [h, m] = s.split(':').map(Number)
  const t = h * 60 + m + mins
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}
const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

interface AgendaItem {
  key: string
  name: string
  day: number
  start: string
  durationMin: number
  cage: string
  coach: string
  price: number
  isNew: boolean
}

interface Bookable {
  id: string
  name: string
  detail: string
  price: number
  durationMin: number
  fixedDay?: number
  fixedStart?: string
  cage: string
  coach: string
}

const SLOTS = ['09:00', '10:30', '13:00', '15:30', '17:00', '18:30']
const RENTAL_MINUTES: Record<string, number> = { 'pr-11': 30, 'pr-12': 60 }
const OPEN_CLASS_IDS = ['c-eliteinfield', 'c-collegeprep']

const BOOKABLES: Bookable[] = [
  ...PRODUCTS.filter((p) => p.id in RENTAL_MINUTES).map((p) => ({
    id: p.id,
    name: p.name,
    detail: 'Any open cage · bring your own group',
    price: p.price,
    durationMin: RENTAL_MINUTES[p.id],
    cage: 'Cage 4',
    coach: 'Open cage',
  })),
  ...CLASSES.filter((c) => OPEN_CLASS_IDS.includes(c.id) && c.enrolled.length < c.capacity).map((c) => ({
    id: c.id,
    name: c.name,
    detail: `${DAYS[c.day]} ${fmtTime(c.start)} · ${c.capacity - c.enrolled.length} spots left`,
    price: c.price,
    durationMin: c.durationMin,
    fixedDay: c.day,
    fixedStart: c.start,
    cage: c.cage,
    coach: staffById(c.coachId)?.name ?? 'Staff',
  })),
]

export default function SchedulePage() {
  const [booked, setBooked] = useState<AgendaItem[]>([])
  const [booking, setBooking] = useState<Bookable | null>(null)
  const [day, setDay] = useState('0')
  const [slot, setSlot] = useState(SLOTS[0])

  const enrolled: AgendaItem[] = CLASSES.filter((c) => c.enrolled.includes(TYLER.id)).map((c) => ({
    key: c.id,
    name: c.name,
    day: c.day,
    start: c.start,
    durationMin: c.durationMin,
    cage: c.cage,
    coach: staffById(c.coachId)?.name ?? 'Staff',
    price: c.price,
    isNew: false,
  }))
  const agenda = [...enrolled, ...booked]

  const openBooking = (b: Bookable) => {
    setDay(String(b.fixedDay ?? 0))
    setSlot(b.fixedStart ?? SLOTS[0])
    setBooking(b)
  }

  const confirm = () => {
    if (!booking) return
    setBooked((xs) => [
      ...xs,
      {
        key: `bk-${Date.now()}`,
        name: booking.name,
        day: Number(day),
        start: slot,
        durationMin: booking.durationMin,
        cage: booking.cage,
        coach: booking.coach,
        price: booking.price,
        isNew: true,
      },
    ])
    setBooking(null)
    toast('Booked — added to your schedule')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Parent portal · Tyler Whitman"
        title="Schedule"
        sub="Tyler's week at Dawsonville, plus open cage time and classes you can book in two taps."
      />

      {/* Week agenda */}
      <Card className="rise" pad={false}>
        <div className="border-b border-ice-600/30 p-4 pb-3 sm:p-5 sm:pb-3">
          <CardTitle action={<span className="tabular text-xs text-ice-400">{agenda.length} sessions this week</span>}>
            This week
          </CardTitle>
        </div>
        <div className="divide-y divide-ice-600/30">
          {DAYS.map((label, d) => {
            const items = agenda.filter((a) => a.day === d).sort((a, b) => a.start.localeCompare(b.start))
            return (
              <div key={label} className="grid gap-2 px-4 py-3 sm:grid-cols-[110px_1fr] sm:px-5">
                <p className="eyebrow pt-1 text-ice-400">{label}</p>
                {items.length === 0 ? (
                  <p className="text-sm text-ice-400">Rest day — nothing scheduled.</p>
                ) : (
                  <ul className="space-y-2">
                    {items.map((a) => (
                      <li key={a.key} className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-ice-600/40 bg-ice-900/60 px-3 py-2.5 transition-colors hover:border-frost-400/40">
                        <CalendarDays size={15} className="shrink-0 text-frost-400" aria-hidden />
                        <span className="text-sm font-semibold text-ice-100">{a.name}</span>
                        {a.isNew && <Chip tone="frost">New</Chip>}
                        <span className="tabular flex items-center gap-1 text-xs text-ice-300">
                          <Clock size={12} aria-hidden />{fmtTime(a.start)} – {fmtTime(addMin(a.start, a.durationMin))}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-ice-300"><MapPin size={12} aria-hidden />{a.cage}</span>
                        <span className="text-xs text-ice-400">{a.coach}</span>
                        <span className="tabular ml-auto text-xs font-semibold text-ice-200">{a.price === 0 ? 'Included' : money(a.price)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Book something */}
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <Plus size={17} className="text-frost-400" aria-hidden />
          <h2 className="display text-lg font-semibold text-ice-100">Book something</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BOOKABLES.map((b) => (
            <Card key={b.id} className="rise flex flex-col transition-colors hover:border-frost-400/40">
              <p className="display text-base font-semibold text-ice-50">{b.name}</p>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-ice-400">{b.detail}</p>
              <p className="mt-2 text-xs text-ice-300">{b.coach} · {b.durationMin} min</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="tabular text-lg font-bold text-ice-50">{b.price === 0 ? 'Free' : money(b.price)}</span>
                <Button onClick={() => openBooking(b)}>Book</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Booking modal */}
      <Modal open={booking !== null} onClose={() => setBooking(null)} title={`Book — ${booking?.name ?? ''}`}>
        {booking && (
          <div className="space-y-4">
            <p className="text-sm text-ice-300">
              {booking.durationMin} min · {booking.coach} · {booking.price === 0 ? 'no charge' : `${money(booking.price)}, billed to your stored balance`}
            </p>
            <div>
              <label htmlFor="bk-day" className="eyebrow mb-1 block text-ice-400">Day</label>
              <select
                id="bk-day"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                disabled={booking.fixedDay !== undefined}
                className="w-full rounded-md border border-ice-600/60 bg-ice-900 px-3 py-2 text-sm text-ice-100 disabled:opacity-60"
              >
                {DAYS.map((d, i) => <option key={d} value={String(i)}>{d}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="bk-slot" className="eyebrow mb-1 block text-ice-400">Time slot</label>
              <select
                id="bk-slot"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                disabled={booking.fixedStart !== undefined}
                className="w-full rounded-md border border-ice-600/60 bg-ice-900 px-3 py-2 text-sm text-ice-100 disabled:opacity-60"
              >
                {(booking.fixedStart ? [booking.fixedStart] : SLOTS).map((s) => <option key={s} value={s}>{fmtTime(s)}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setBooking(null)}>Cancel</Button>
              <Button onClick={confirm}>Confirm booking</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
