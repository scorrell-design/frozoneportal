import { BadgeCheck, ClipboardList, TrendingUp } from 'lucide-react'
import { Avatar, Card, CardTitle, Chip, PageHeader, RockReadyRing } from '../../components/ui'
import { PercentileRow, TrendChart } from '../../components/charts'
import { SESSION_NOTES, TYLER, drillById, staffById } from '../../data/seed'

const QUARTERS = ['Q3 24', 'Q4 24', 'Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26']

export default function ProgressPage() {
  const trendData = TYLER.compositeTrend.map((v, i) => ({ x: QUARTERS[i], Composite: v }))

  return (
    <div>
      <PageHeader
        eyebrow="Parent portal · Tyler Whitman"
        title="Progress"
        sub="Where Tyler stands, where he's headed, and exactly what the coaches are working on — in plain English."
      />

      <div className="grid gap-3 lg:grid-cols-3">
        {/* Header card */}
        <Card className="rise">
          <div className="flex items-center gap-3">
            <Avatar name={TYLER.name} hue={TYLER.hue} size={44} />
            <div className="min-w-0">
              <p className="display truncate text-xl font-semibold text-ice-50">{TYLER.name}</p>
              <p className="text-xs text-ice-400">#{TYLER.jersey} · {TYLER.ageGroup} · {TYLER.position} · {TYLER.program}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center text-center">
            <RockReadyRing score={TYLER.composite} />
            <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-grass-400">
              <TrendingUp size={15} aria-hidden /> +4 since March
            </p>
            <p className="mt-1.5 max-w-[240px] text-xs leading-relaxed text-ice-400">
              Composite of all seven Rock Ready indexes, re-tested quarterly. Next eval July 1.
            </p>
          </div>
        </Card>

        {/* Indexes */}
        <Card className="rise lg:col-span-2">
          <CardTitle action={<Chip tone="frost">Q2 2026 eval</Chip>}>Rock Ready indexes</CardTitle>
          <div className="divide-y divide-ice-600/20">
            {TYLER.indexes.map((ix) => (
              <PercentileRow key={ix.key} label={ix.label} score={ix.score} grade={ix.grade} />
            ))}
          </div>
          <p className="mt-3 border-t border-ice-600/30 pt-3 text-xs leading-relaxed text-ice-400">
            Each number is a percentile vs. 12U players across the Frozen Ropes network — 81 means Tyler tests
            better than 81% of kids his age. Grades translate the same score into report-card language.
          </p>
        </Card>
      </div>

      {/* Composite trend */}
      <Card className="rise mt-3">
        <CardTitle action={<span className="tabular text-xs text-ice-400">8 quarterly evals</span>}>Composite over time</CardTitle>
        <TrendChart data={trendData} yDomain={[50, 90]} />
        <p className="mt-2 text-xs leading-relaxed text-ice-400">
          From 61 to 74 in two years — steady, not spiky. The dip in Q1 25 was a growth spurt; the coaches expected
          it and it came right back.
        </p>
      </Card>

      {/* Session notes */}
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <ClipboardList size={17} className="text-frost-400" aria-hidden />
          <h2 className="display text-lg font-semibold text-ice-100">Session notes from the cage</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {SESSION_NOTES.map((note, i) => (
            <Card key={note.id} className="rise flex flex-col" >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-frost-300">{note.focus}</p>
                <span className="tabular shrink-0 text-xs text-ice-400">{note.date}</span>
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ice-200">{note.workedOn}</p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="eyebrow text-ice-400">Homework</span>
                {note.homework.map((id) => (
                  <Chip key={id} tone="gold">{drillById(id)?.title}</Chip>
                ))}
              </div>
              <p className="mt-3 border-l-2 border-frost-400/50 pl-3 text-sm italic text-ice-300">“{note.nextFocus}”</p>
              <p className="mt-3 text-xs text-ice-400">
                {staffById(note.coachId)?.name}{i === 0 ? ' · most recent' : ''}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Trust callout */}
      <Card className="rise mt-3 border-frost-400/30 bg-frost-400/5">
        <div className="flex items-start gap-3">
          <BadgeCheck size={20} className="mt-0.5 shrink-0 text-frost-400" aria-hidden />
          <div>
            <p className="display text-base font-semibold text-ice-50">Numbers a parent can trust</p>
            <p className="mt-1 text-sm leading-relaxed text-ice-300">
              Every score on this page was recorded in person by Coach Marcus during a scheduled eval — no
              self-reported numbers, no app guesses. If a number moves, it's because Tyler moved it.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
