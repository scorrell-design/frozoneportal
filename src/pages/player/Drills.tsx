import { useState } from 'react'
import { Check, Clock, Dumbbell, Users } from 'lucide-react'
import { Button, Card, Chip, PageHeader, toast } from '../../components/ui'
import { DRILLS, SESSION_NOTES, drillById } from '../../data/seed'
import type { Drill } from '../../lib/types'

function DrillCard({ drill, assigned, done, onToggle, delay }: {
  drill: Drill
  assigned?: boolean
  done?: boolean
  onToggle?: () => void
  delay: number
}) {
  return (
    <Card
      className={`rise flex h-full flex-col transition-colors ${
        done ? 'border-grass-500/50' : assigned ? 'border-frost-400/30 hover:border-frost-400/60' : 'hover:border-frost-400/40'
      }`}
    >
      <div style={{ animationDelay: `${delay}ms` }}>
        <div className="flex items-start justify-between gap-2">
          <p className="display text-lg font-semibold uppercase tracking-wide text-ice-50">{drill.title}</p>
          {done && <Chip tone="grass" icon={<Check size={11} aria-hidden />}>Done</Chip>}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {drill.focus.map((f) => (
            <Chip key={f} tone="frost">{f}</Chip>
          ))}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ice-300">{drill.description}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ice-400">
          <span className="flex items-center gap-1.5"><Users size={13} aria-hidden />{drill.ages}</span>
          <span className="flex items-center gap-1.5"><Clock size={13} aria-hidden />{drill.duration}</span>
          <span className="flex items-center gap-1.5"><Dumbbell size={13} aria-hidden />{drill.equipment}</span>
        </div>
        {assigned && onToggle && (
          <div className="mt-4">
            <Button variant={done ? 'ghost' : 'primary'} onClick={onToggle} className="w-full">
              {done ? (
                <>Marked complete — undo</>
              ) : (
                <><Check size={15} aria-hidden /> Mark complete</>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

export default function PlayerDrills() {
  const homeworkIds = [...new Set(SESSION_NOTES.flatMap((n) => n.homework))]
  const homework = homeworkIds.map((id) => drillById(id)).filter((d) => d !== undefined)
  const explore = DRILLS.filter((d) => !homeworkIds.includes(d.id))
  const [done, setDone] = useState<Set<string>>(new Set())

  const toggle = (drill: Drill) => {
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(drill.id)) {
        next.delete(drill.id)
        toast(`${drill.title} moved back to your list.`)
      } else {
        next.add(drill.id)
        toast(`${drill.title} complete — log the reps too.`)
      }
      return next
    })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Player portal · My drills"
        title="Your drill work"
        sub="The homework Coach Marcus assigned, plus the rest of the Frozen Ropes drill library when you want more."
      />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="display text-lg font-semibold uppercase tracking-wide text-ice-100">Assigned by Coach Marcus</h2>
        <span className="tabular text-xs text-ice-400">{done.size} of {homework.length} complete</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {homework.map((d, i) => (
          <DrillCard
            key={d.id}
            drill={d}
            assigned
            done={done.has(d.id)}
            onToggle={() => toggle(d)}
            delay={i * 60}
          />
        ))}
      </div>
      <p className="mt-2.5 text-xs text-ice-500">
        From your last three session notes. Mark them done and Coach Marcus sees it before Friday.
      </p>

      <h2 className="display mb-3 mt-8 text-lg font-semibold uppercase tracking-wide text-ice-100">Explore more</h2>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {explore.map((d, i) => (
          <DrillCard key={d.id} drill={d} delay={120 + i * 60} />
        ))}
      </div>
    </div>
  )
}
