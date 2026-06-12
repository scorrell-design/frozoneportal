import { useState, type FormEvent, type ReactNode } from 'react'
import { Activity, AlertTriangle, Apple, BedDouble, HeartPulse, ShieldCheck } from 'lucide-react'
import { Button, Card, CardTitle, PageHeader, toast, useCountUp } from '../../components/ui'
import { Sparkline, TrendChart } from '../../components/charts'
import { WELLNESS } from '../../data/seed'

const inputCls =
  'w-full rounded-md border border-ice-600/60 bg-ice-900 px-3 py-2 text-sm text-ice-100 placeholder:text-ice-500'

function Stat({ label, value, format, valueClass = 'text-ice-50', note, icon }: {
  label: string
  value: number
  format: (n: number) => string
  valueClass?: string
  note: ReactNode
  icon: ReactNode
}) {
  const v = useCountUp(value)
  return (
    <Card className="rise">
      <div className="flex items-start justify-between">
        <p className="eyebrow text-ice-400">{label}</p>
        <span className="text-frost-400">{icon}</span>
      </div>
      <p className={`display tabular mt-2 text-4xl font-semibold ${valueClass}`}>{format(v)}</p>
      <p className="mt-1 text-xs text-ice-400">{note}</p>
    </Card>
  )
}

export default function WellnessPage() {
  const week = WELLNESS[WELLNESS.length - 1]
  const loadPct = Math.round((week.throwingLoad / week.loadLimit) * 100)

  const [sleep, setSleep] = useState('8.5')
  const [meals, setMeals] = useState('4')
  const [soreness, setSoreness] = useState('2')
  const [throws, setThrows] = useState('230')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    toast("Logged — Coach Marcus sees this before Tyler's next session.")
  }

  return (
    <div>
      <PageHeader
        eyebrow="Parent portal · Tyler Whitman"
        title="Wellness & workload"
        sub="Sleep, eating, soreness, and a hard cap on weekly throws — so Tyler develops without getting overworked."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          label="Sleep this week"
          value={week.sleepHrs}
          format={(n) => `${n.toFixed(1)}h`}
          valueClass="text-grass-400"
          note="Avg per night · best week since May"
          icon={<BedDouble size={17} aria-hidden />}
        />
        <Stat
          label="Throwing load"
          value={week.throwingLoad}
          format={(n) => `${Math.round(n)} / ${week.loadLimit}`}
          note={`${loadPct}% of the weekly cap Marcus set`}
          icon={<Activity size={17} aria-hidden />}
        />
        <Stat
          label="Soreness"
          value={week.soreness}
          format={(n) => `${Math.round(n)} / 5`}
          note="Self-reported · low and normal"
          icon={<HeartPulse size={17} aria-hidden />}
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {/* Workload guard */}
        <Card className="rise">
          <CardTitle action={<span className="eyebrow text-ice-400">Cap: {week.loadLimit} throws/wk</span>}>
            Workload guard
          </CardTitle>
          <ul className="space-y-3">
            {WELLNESS.map((w) => {
              const pct = Math.round((w.throwingLoad / w.loadLimit) * 100)
              const bar = pct > 90 ? 'bg-clay-400' : pct >= 75 ? 'bg-gold-400' : 'bg-grass-400'
              const txt = pct > 90 ? 'text-clay-300' : pct >= 75 ? 'text-gold-300' : 'text-grass-400'
              return (
                <li key={w.week}>
                  <div className="grid grid-cols-[64px_1fr_auto] items-center gap-3">
                    <span className="tabular text-xs font-medium text-ice-300">Wk {w.week}</span>
                    <div
                      className="h-2.5 overflow-hidden rounded-full bg-ice-700"
                      role="img"
                      aria-label={`Week of ${w.week}: ${w.throwingLoad} of ${w.loadLimit} throws (${pct}% of cap)`}
                    >
                      <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%`, transition: 'width 700ms cubic-bezier(0.22,1,0.36,1)' }} />
                    </div>
                    <span className={`tabular text-xs font-semibold ${txt}`}>{w.throwingLoad} · {pct}%</span>
                  </div>
                  {pct > 90 && (
                    <p className="mt-1.5 flex items-center gap-1.5 pl-[76px] text-xs font-medium text-clay-300">
                      <AlertTriangle size={13} aria-hidden /> Approached the cap — Marcus trimmed Friday's bullpen
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
          <p className="mt-4 border-t border-ice-600/30 pt-3 text-xs leading-relaxed text-ice-400">
            Green is healthy, gold means watch it, and orange means the coaches step in. The cap is set for
            Tyler's age and adjusts as he grows — it is never a target to hit.
          </p>
        </Card>

        <div className="grid gap-3">
          {/* Sleep trend */}
          <Card className="rise">
            <CardTitle action={<span className="tabular text-xs text-grass-400">▲ 0.7h vs last week</span>}>Sleep trend</CardTitle>
            <TrendChart
              data={WELLNESS.map((w) => ({ x: w.week, Sleep: w.sleepHrs }))}
              height={170}
              yDomain={[6, 10]}
              unit="h"
            />
          </Card>

          {/* Nutrition */}
          <Card className="rise">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Apple size={17} className="text-grass-400" aria-hidden />
                <div>
                  <p className="eyebrow text-ice-400">Nutrition score</p>
                  <p className="display tabular text-2xl font-semibold text-ice-50">{week.meals}<span className="text-base text-ice-400"> / 100</span></p>
                </div>
              </div>
              <Sparkline data={WELLNESS.map((w) => w.meals)} width={120} height={34} stroke="var(--color-grass-400)" />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ice-400">
              Up 17 points since mid-May. Meal quality, logged weekly — not calorie counting.
            </p>
          </Card>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {/* Log form */}
        <Card className="rise">
          <CardTitle>Log this week</CardTitle>
          <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="wl-sleep" className="eyebrow mb-1 block text-ice-400">Sleep (hrs / night)</label>
              <input id="wl-sleep" type="number" step="0.1" min="4" max="12" value={sleep} onChange={(e) => setSleep(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label htmlFor="wl-meals" className="eyebrow mb-1 block text-ice-400">Meals quality</label>
              <select id="wl-meals" value={meals} onChange={(e) => setMeals(e.target.value)} className={inputCls}>
                {['1', '2', '3', '4', '5'].map((n) => <option key={n} value={n}>{n} / 5</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="wl-sore" className="eyebrow mb-1 block text-ice-400">Soreness</label>
              <select id="wl-sore" value={soreness} onChange={(e) => setSoreness(e.target.value)} className={inputCls}>
                {['1', '2', '3', '4', '5'].map((n) => <option key={n} value={n}>{n} / 5</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="wl-throws" className="eyebrow mb-1 block text-ice-400">Throws this week</label>
              <input id="wl-throws" type="number" min="0" max="400" value={throws} onChange={(e) => setThrows(e.target.value)} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Log week</Button>
            </div>
          </form>
        </Card>

        {/* Philosophy */}
        <Card className="rise border-grass-500/30 bg-grass-500/5">
          <div className="flex items-start gap-3">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-grass-400" aria-hidden />
            <div>
              <p className="display text-base font-semibold uppercase tracking-wide text-ice-50">Why we track this</p>
              <p className="mt-1 text-sm leading-relaxed text-ice-300">
                Quality reps over quantity reps. We track workload so 12-year-old arms stay 12-year-old arms.
                Nobody at Frozen Ropes gets praised for throwing more — they get praised for throwing well,
                sleeping enough, and showing up healthy.
              </p>
              <p className="mt-2 text-xs text-ice-400">
                Coach Marcus reviews this log before every one of Tyler's sessions and adjusts the plan — not the other way around.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
