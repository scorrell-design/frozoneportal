import { Link } from 'react-router-dom'
import { ArrowRight, Check, GraduationCap, Sparkles } from 'lucide-react'
import { Card, Chip, PageHeader, RockReadyRing } from '../../components/ui'
import { JOURNEY, TYLER } from '../../data/seed'
import type { JourneyStage } from '../../lib/types'

function StageMarker({ status }: { status: JourneyStage['status'] }) {
  if (status === 'done') {
    return (
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-grass-500/60 bg-grass-500/20 text-grass-400">
        <Check size={18} aria-hidden />
        <span className="sr-only">Completed</span>
      </span>
    )
  }
  if (status === 'current') {
    return (
      <span className="relative flex h-10 w-10 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-frost-400 shadow-[0_0_18px_rgba(56,189,248,0.55)]" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-frost-400" aria-hidden />
        <span className="sr-only">Current stage</span>
      </span>
    )
  }
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ice-600/60 bg-ice-900">
      <span className="h-2 w-2 rounded-full bg-ice-600" aria-hidden />
      <span className="sr-only">Upcoming</span>
    </span>
  )
}

export default function PlayerJourney() {
  return (
    <div>
      <PageHeader
        eyebrow="Player portal · My journey"
        title="Your whole story"
        sub="You picked up a glove at three. This is everywhere you've been — and everywhere this goes."
      />

      <div className="mx-auto max-w-3xl">
        <ol className="relative space-y-4 pl-0">
          {JOURNEY.map((stage, i) => {
            const isCurrent = stage.status === 'current'
            const isDone = stage.status === 'done'
            const isCollege = stage.id === 'j-5'
            const dim = stage.status === 'next' || stage.status === 'future'
            return (
              <li key={stage.id} className="rise relative flex gap-4" style={{ animationDelay: `${i * 90}ms` }}>
                {/* Rail */}
                <div className="flex flex-col items-center">
                  <StageMarker status={stage.status} />
                  {i < JOURNEY.length - 1 && (
                    <span
                      className={`w-px flex-1 ${isDone ? 'bg-grass-500/50' : isCurrent ? 'bg-gradient-to-b from-frost-400/70 to-ice-700' : 'bg-ice-700'}`}
                      aria-hidden
                    />
                  )}
                </div>

                {/* Stage card */}
                <div className={`min-w-0 flex-1 pb-4 ${dim ? 'opacity-60' : ''}`}>
                  <Card
                    className={
                      isCurrent
                        ? 'border-frost-400/60 shadow-[0_0_28px_rgba(56,189,248,0.18)]'
                        : isDone
                          ? 'border-grass-500/30'
                          : ''
                    }
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="display text-xl font-semibold uppercase tracking-wide text-ice-50">{stage.name}</h2>
                      <span className="tabular text-xs text-ice-400">Ages {stage.ages}</span>
                      {isCurrent && <Chip tone="frost" icon={<Sparkles size={11} aria-hidden />}>You are here</Chip>}
                      {isDone && <Chip tone="grass">Complete</Chip>}
                      {stage.status === 'next' && <Chip tone="ice">Up next</Chip>}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ice-200">{stage.highlight}</p>

                    {isCurrent && (
                      <div className="mt-4 flex flex-wrap items-center gap-5 rounded-[10px] border border-ice-600/40 bg-ice-900/70 p-4">
                        <RockReadyRing score={TYLER.composite} size={110} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-grass-400">+13 composite since you started this stage</p>
                          <p className="mt-1.5 text-sm leading-relaxed text-ice-300">
                            Every eval, every session note, every quality rep is building the record
                            that carries you to the next stage. Nobody else has this — it's yours.
                          </p>
                          <Link
                            to="/player/development"
                            className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-frost-300 hover:text-frost-200"
                          >
                            See your full development <ArrowRight size={12} aria-hidden />
                          </Link>
                        </div>
                      </div>
                    )}

                    {isCollege && (
                      <div className="mt-4 rounded-[10px] border border-gold-400/30 bg-gold-400/5 p-4">
                        <p className="flex items-center gap-2 text-sm font-semibold text-gold-300">
                          <GraduationCap size={16} aria-hidden /> The recruiting database is waiting
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-ice-300">
                          When you're 16, your verified Frozone record matches you to D1/D2/D3 programs —
                          real numbers from real evals, matched to schools that fit your game and your
                          grades. You'll know where you stand before anyone charges you to find out.
                        </p>
                      </div>
                    )}
                  </Card>
                </div>
              </li>
            )
          })}
        </ol>

        <Card className="rise mt-2 border-frost-400/30 text-center" >
          <p className="display text-xl font-semibold uppercase tracking-wide text-ice-50">
            Eight years in. Six more to College Bound.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ice-300">
            The kids who get there aren't the ones who swung the most — they're the ones who
            made every rep count, every season, since they were small. Keep going, Tyler.
          </p>
        </Card>
      </div>
    </div>
  )
}
