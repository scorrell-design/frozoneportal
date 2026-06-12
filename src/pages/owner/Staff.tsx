import { useState } from 'react'
import { Clock, DollarSign, LogIn, LogOut, UserCheck } from 'lucide-react'
import { Avatar, Button, Card, CardTitle, Chip, PageHeader, StatCard, toast } from '../../components/ui'
import { STAFF } from '../../data/seed'

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

export default function StaffPage() {
  const [clockedIn, setClockedIn] = useState<Record<string, boolean>>(
    () => Object.fromEntries(STAFF.map((s) => [s.id, s.clockedIn])),
  )

  const clockedInCount = STAFF.filter((s) => clockedIn[s.id]).length
  const totalHours = STAFF.reduce((s, m) => s + m.hoursWeek, 0)
  const payroll = STAFF.reduce((s, m) => s + m.rate * m.hoursWeek, 0)
  const maxHours = Math.max(...STAFF.map((s) => s.hoursWeek))

  const toggle = (id: string, name: string) => {
    const goingIn = !clockedIn[id]
    setClockedIn((c) => ({ ...c, [id]: goingIn }))
    toast(`${name} clocked ${goingIn ? 'in' : 'out'} — ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Frozen Ropes Dawsonville"
        title="Staff & timeclock"
        sub="Who's in the building, who's on the schedule, and what the week costs."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rise">
          <StatCard label="Clocked in now" value={clockedInCount} format={(n) => `${Math.round(n)} of ${STAFF.length}`} icon={<UserCheck size={18} aria-hidden />} />
        </div>
        <div className="rise" style={{ animationDelay: '50ms' }}>
          <StatCard label="Hours this week" value={totalHours} format={(n) => `${n.toFixed(1)} h`} icon={<Clock size={18} aria-hidden />} />
        </div>
        <div className="rise" style={{ animationDelay: '100ms' }}>
          <StatCard label="Payroll to date" value={payroll} format={usd} icon={<DollarSign size={18} aria-hidden />} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Roster */}
        <Card className="rise" pad={false} >
          <div className="px-4 pt-4 sm:px-5 sm:pt-5">
            <CardTitle>Roster</CardTitle>
          </div>
          <div className="divide-y divide-ice-600/20">
            {STAFF.map((s) => {
              const isIn = clockedIn[s.id]
              return (
                <div key={s.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
                  <Avatar name={s.name} hue={s.hue} size={38} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ice-100">{s.name}</p>
                    <p className="text-xs text-ice-400">{s.role}</p>
                  </div>
                  <span className="tabular hidden w-16 text-right text-sm text-ice-200 sm:block">
                    {s.rate > 0 ? `$${s.rate}/hr` : 'Owner'}
                  </span>
                  <span className="tabular hidden w-14 text-right text-sm text-ice-200 md:block">{s.hoursWeek} h</span>
                  <Chip tone={isIn ? 'grass' : 'ice'}>{isIn ? 'Clocked in' : 'Out'}</Chip>
                  <Button variant={isIn ? 'ghost' : 'primary'} onClick={() => toggle(s.id, s.name)}>
                    {isIn ? <LogOut size={14} aria-hidden /> : <LogIn size={14} aria-hidden />}
                    {isIn ? 'Clock out' : 'Clock in'}
                  </Button>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Hours comparison */}
        <Card className="rise">
          <CardTitle action={<span className="tabular text-xs text-ice-400">{totalHours.toFixed(1)} h total</span>}>
            Hours this week
          </CardTitle>
          <div className="space-y-3">
            {[...STAFF].sort((a, b) => b.hoursWeek - a.hoursWeek).map((s) => (
              <div key={s.id}>
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <span className="truncate text-xs font-medium text-ice-200">{s.name}</span>
                  <span className="tabular text-xs font-semibold text-ice-100">{s.hoursWeek} h</span>
                </div>
                <div className="h-2 rounded-full bg-ice-700" role="img" aria-label={`${s.name}: ${s.hoursWeek} hours this week`}>
                  <div
                    className="h-2 rounded-full bg-frost-400/80"
                    style={{ width: `${(s.hoursWeek / maxHours) * 100}%`, transition: 'width 700ms cubic-bezier(0.22,1,0.36,1)' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ice-400">
            Hours reset Monday. Instructor hours track against scheduled programs; front desk covers open-to-close coverage.
          </p>
        </Card>
      </div>
    </div>
  )
}
