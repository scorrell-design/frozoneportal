import { useMemo, useState } from 'react'
import { Flame, Lightbulb, Plus, Target } from 'lucide-react'
import { Button, Card, CardTitle, PageHeader, StatCard, toast } from '../../components/ui'
import { REP_LOGS, TYLER } from '../../data/seed'
import type { RepLog } from '../../lib/types'

const FOCUSES = ['Stride box', 'Rice bucket', 'Tee work', 'Wall drill', 'Long toss']

// Seed entries like "Tee — station 7" roll up under "Tee work" for insights
const focusGroup = (focus: string) => (focus.startsWith('Tee') ? 'Tee work' : focus)

function QualitySegments({ quality, size = 'sm' }: { quality: number; size?: 'sm' | 'lg' }) {
  const dims = size === 'lg' ? 'h-2.5 w-7' : 'h-2 w-5'
  return (
    <span className="flex items-center gap-1" role="img" aria-label={`Quality ${quality} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`${dims} rounded-full ${n <= quality ? 'bg-frost-400 shadow-[0_0_6px_rgba(56,189,248,0.4)]' : 'bg-ice-700'}`}
        />
      ))}
    </span>
  )
}

export default function PlayerReps() {
  const [logs, setLogs] = useState<RepLog[]>(REP_LOGS)
  const [focus, setFocus] = useState(FOCUSES[0])
  const [reps, setReps] = useState(20)
  const [quality, setQuality] = useState(0)

  const logIt = () => {
    if (quality === 0) {
      toast('Rate the quality first — that number is the whole point.')
      return
    }
    setLogs((xs) => [{ id: `rl-local-${Date.now()}`, date: 'Jun 12', focus, reps, quality }, ...xs])
    setQuality(0)
    toast('Logged — quality beats volume.')
  }

  const { weekReps, avgQuality, focusAverages } = useMemo(() => {
    // This week = Mon Jun 8 onward
    const week = logs.filter((l) => {
      const [mo, day] = l.date.split(' ')
      return mo === 'Jun' && Number(day) >= 8
    })
    const totals = new Map<string, { sum: number; n: number }>()
    for (const l of logs) {
      const g = focusGroup(l.focus)
      const t = totals.get(g) ?? { sum: 0, n: 0 }
      totals.set(g, { sum: t.sum + l.quality, n: t.n + 1 })
    }
    return {
      weekReps: week.reduce((s, l) => s + l.reps, 0),
      avgQuality: logs.reduce((s, l) => s + l.quality, 0) / logs.length,
      focusAverages: [...totals.entries()]
        .map(([g, t]) => ({ group: g, avg: t.sum / t.n, sessions: t.n }))
        .sort((a, b) => a.avg - b.avg),
    }
  }, [logs])

  const sagging = focusAverages.filter((f) => f.avg < 3)

  return (
    <div>
      <PageHeader
        eyebrow="Player portal · Quality reps"
        title="Make them count"
        sub="Anyone can swing 100 times. Log how good the reps were — that's what Coach Marcus actually reads."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rise" style={{ animationDelay: '0ms' }}>
          <StatCard label="Practice streak" value={TYLER.streakDays} format={(n) => `${Math.round(n)} days`} icon={<Flame size={18} />} />
        </div>
        <div className="rise" style={{ animationDelay: '50ms' }}>
          <StatCard label="Reps this week" value={weekReps} icon={<Target size={18} />} />
        </div>
        <div className="rise" style={{ animationDelay: '100ms' }}>
          <StatCard label="Avg quality" value={avgQuality} format={(n) => `${n.toFixed(1)} / 5`} icon={<Plus size={18} />} />
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {/* Logger */}
        <Card className="rise border-frost-400/30">
          <CardTitle>Log tonight's work</CardTitle>
          <label className="block">
            <span className="eyebrow text-ice-400">Focus</span>
            <select
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-ice-600/60 bg-ice-900 px-3 py-2 text-sm text-ice-100 focus:border-frost-400"
            >
              {FOCUSES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </label>
          <label className="mt-3 block">
            <span className="eyebrow text-ice-400">Reps</span>
            <input
              type="number"
              min={1}
              max={200}
              value={reps}
              onChange={(e) => setReps(Math.max(1, Number(e.target.value)))}
              className="tabular mt-1.5 w-full rounded-md border border-ice-600/60 bg-ice-900 px-3 py-2 text-sm text-ice-100 focus:border-frost-400"
            />
          </label>
          <div className="mt-3">
            <span className="eyebrow text-ice-400">Quality — be honest</span>
            <div className="mt-1.5 grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setQuality(n)}
                  aria-label={`Quality ${n} of 5`}
                  aria-pressed={quality === n}
                  className={`display rounded-md border py-2 text-sm font-bold transition-colors ${
                    quality >= n
                      ? 'border-frost-400/60 bg-frost-400/20 text-frost-300'
                      : 'border-ice-600/60 bg-ice-900 text-ice-500 hover:border-frost-400/40 hover:text-ice-300'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-ice-500">1 = going through the motions · 5 = every rep with intent</p>
          </div>
          <Button onClick={logIt} className="mt-4 w-full">Log it</Button>
        </Card>

        {/* History */}
        <Card className="rise lg:col-span-2">
          <CardTitle action={<span className="tabular text-xs text-ice-400">{logs.length} sessions</span>}>Rep history</CardTitle>
          <div className="space-y-2">
            {logs.map((l, i) => (
              <div
                key={l.id}
                className="rise flex items-center gap-3 rounded-[10px] border border-ice-600/40 bg-ice-850 px-3.5 py-2.5 transition-colors hover:border-frost-400/40"
                style={{ animationDelay: `${i * 35}ms` }}
              >
                <span className="tabular w-14 shrink-0 text-xs font-medium text-ice-400">{l.date}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ice-100">{l.focus}</span>
                <span className="tabular shrink-0 text-xs text-ice-300">{l.reps} reps</span>
                <QualitySegments quality={l.quality} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Insight */}
      <Card className="rise mt-3">
        <CardTitle action={<span className="text-xs text-ice-400">Avg quality per focus</span>}>What the numbers say</CardTitle>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {focusAverages.map((f) => (
            <div
              key={f.group}
              className={`rounded-[10px] border p-3 ${f.avg < 3 ? 'border-clay-500/40 bg-clay-500/5' : 'border-ice-600/40 bg-ice-850'}`}
            >
              <p className="truncate text-xs font-medium text-ice-300">{f.group}</p>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <span className={`display tabular text-2xl font-semibold ${f.avg < 3 ? 'text-clay-300' : 'text-ice-50'}`}>
                  {f.avg.toFixed(1)}
                </span>
                <QualitySegments quality={Math.round(f.avg)} />
              </div>
              <p className="tabular mt-1 text-[11px] text-ice-500">{f.sessions} {f.sessions === 1 ? 'session' : 'sessions'}</p>
            </div>
          ))}
        </div>
        {sagging.map((f) => (
          <div key={f.group} className="mt-3 flex items-start gap-3 rounded-[10px] border border-clay-500/40 bg-clay-500/10 p-3.5">
            <Lightbulb size={17} className="mt-0.5 shrink-0 text-clay-300" aria-hidden />
            <p className="text-sm leading-relaxed text-ice-100">
              <span className="font-semibold text-clay-300">Coach's read:</span> Quality is sagging on{' '}
              {f.group} — drop to 20 reps and make them count.
            </p>
          </div>
        ))}
      </Card>
    </div>
  )
}
