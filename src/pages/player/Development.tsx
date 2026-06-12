import { AlertTriangle, MessageSquare, TrendingUp } from 'lucide-react'
import { Card, CardTitle, Chip, PageHeader } from '../../components/ui'
import { PercentileRow, SkillRadar, Sparkline, TrendChart } from '../../components/charts'
import { SESSION_NOTES, TYLER, staffById } from '../../data/seed'

const QUARTERS = ['Q3 24', 'Q4 24', 'Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26']

export default function PlayerDevelopment() {
  const compositeData = QUARTERS.map((q, i) => ({ x: q, Composite: TYLER.compositeTrend[i] }))
  const coachName = staffById(SESSION_NOTES[0].coachId)?.name ?? 'Coach Marcus'

  return (
    <div>
      <PageHeader
        eyebrow="Player portal · My development"
        title="Your game, measured"
        sub="Every Rock Ready eval since you started — the shape of your game and where it's heading."
      />

      <div className="grid gap-3 lg:grid-cols-2">
        {/* Radar */}
        <Card className="rise">
          <CardTitle action={<Chip tone="frost">Q2 2026 eval</Chip>}>The shape of your game</CardTitle>
          <SkillRadar indexes={TYLER.indexes} height={280} />
          <p className="mt-1 text-xs text-ice-500">
            Recorded in person by {coachName}. Next re-test July 1, Cage 1.
          </p>
        </Card>

        {/* Percentile rows */}
        <Card className="rise" >
          <CardTitle action={<span className="text-xs text-ice-400">vs. 12U nationally</span>}>Rock Ready indexes</CardTitle>
          <div className="space-y-0.5">
            {TYLER.indexes.map((ix) => (
              <PercentileRow key={ix.key} label={ix.label} score={ix.score} grade={ix.grade} />
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {/* Composite trend */}
        <Card className="rise lg:col-span-2">
          <CardTitle action={<Chip tone="grass" icon={<TrendingUp size={12} aria-hidden />}>+13 in two years</Chip>}>
            Composite over time
          </CardTitle>
          <TrendChart data={compositeData} height={230} yDomain={[50, 90]} />
          <p className="mt-1 text-xs text-ice-500">
            Eight quarterly evals. The dip in Q1 25 was the growth spurt — you came back stronger.
          </p>
        </Card>

        {/* The gap callout */}
        <Card className="rise border-gold-400/40">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gold-400/40 bg-gold-400/10 text-gold-300">
              <AlertTriangle size={17} aria-hidden />
            </span>
            <div>
              <p className="eyebrow text-gold-300">Your gap</p>
              <p className="display mt-1 text-xl font-semibold uppercase tracking-wide text-ice-50">Grip Index 64</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ice-200">
            Grip Index 64 is your gap — rice bucket nightly, re-test July 1.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-ice-400">
            Coach Marcus says this is the one index holding back your composite. Move it
            8 points and your whole board changes.
          </p>
        </Card>
      </div>

      {/* Per-index sparklines */}
      <Card className="rise mt-3">
        <CardTitle action={<span className="text-xs text-ice-400">Last 8 evals</span>}>Index trends</CardTitle>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {TYLER.indexes.map((ix) => {
            const delta = ix.trend[ix.trend.length - 1] - ix.trend[0]
            return (
              <div key={ix.key} className="rounded-[10px] border border-ice-600/40 bg-ice-850 p-3 transition-colors hover:border-frost-400/50">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-medium text-ice-300">{ix.label}</p>
                  <span className="display text-sm font-bold text-ice-100">{ix.grade}</span>
                </div>
                <div className="mt-2 flex items-end justify-between gap-2">
                  <span className="display tabular text-2xl font-semibold text-ice-50">{ix.score}</span>
                  <Sparkline data={ix.trend} width={84} height={26} stroke={delta >= 0 ? 'var(--color-grass-400)' : 'var(--color-clay-400)'} />
                </div>
                <p className={`tabular mt-1 text-[11px] font-medium ${delta >= 0 ? 'text-grass-400' : 'text-clay-300'}`}>
                  {delta >= 0 ? '+' : ''}{delta} over 8 evals
                </p>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Coach comments */}
      <Card className="rise mt-3">
        <CardTitle action={<span className="text-xs text-ice-400">From {coachName}</span>}>What your coach is seeing</CardTitle>
        <div className="space-y-3">
          {SESSION_NOTES.map((n) => (
            <div key={n.id} className="rounded-[10px] border border-ice-600/40 bg-ice-850 p-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <MessageSquare size={14} className="text-frost-400" aria-hidden />
                <p className="text-sm font-semibold text-frost-300">{n.focus}</p>
                <span className="ml-auto text-xs text-ice-500">{n.date}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ice-200">{n.workedOn}</p>
              <p className="mt-2.5 border-l-2 border-frost-400/50 pl-3 text-sm italic text-ice-300">“{n.nextFocus}”</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
