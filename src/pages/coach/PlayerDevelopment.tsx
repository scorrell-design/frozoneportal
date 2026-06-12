import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, ClipboardPlus, Flame, NotebookPen, Play, Save } from 'lucide-react'
import {
  Avatar, Breadcrumbs, Button, Card, CardTitle, Chip, EmptyState, Modal, PageHeader,
  RockReadyRing, toast,
} from '../../components/ui'
import { PercentileRow, SkillRadar, TrendChart } from '../../components/charts'
import { SESSION_NOTES, VIDEOS, drillById, playerById } from '../../data/seed'
import { EVAL_LABELS, FlagChips, fmtDur, gradeFor } from './shared'
import type { SessionVideo, TierId } from '../../lib/types'

const TIER_TONE: Record<TierId, 'ice' | 'frost' | 'gold' | 'clay'> = {
  rookie: 'ice',
  prospect: 'frost',
  allstar: 'gold',
  franchise: 'clay',
}
const TIER_NAME: Record<TierId, string> = {
  rookie: 'Rookie',
  prospect: 'Prospect',
  allstar: 'All-Star',
  franchise: 'Franchise',
}

const VIDEO_CHIP: Record<SessionVideo['status'], { tone: 'frost' | 'ice' | 'grass'; label: string }> = {
  review: { tone: 'frost', label: 'Needs review' },
  processing: { tone: 'ice', label: 'Processing' },
  shared: { tone: 'grass', label: 'Shared' },
}

const FIELD =
  'mt-1.5 w-full rounded-md border border-ice-600/60 bg-ice-900 px-3 py-2 text-sm text-ice-100 placeholder:text-ice-500 focus:border-frost-400 focus:outline-none'

export default function PlayerDevelopment() {
  const { id } = useParams()
  const [evalOpen, setEvalOpen] = useState(false)
  const [evalKey, setEvalKey] = useState('strength')
  const [evalScore, setEvalScore] = useState('')

  const p = id ? playerById(id) : undefined

  if (!p) {
    return (
      <div>
        <Breadcrumbs items={[{ label: 'My players', to: '/coach/players' }, { label: 'Unknown player' }]} />
        <PageHeader eyebrow="Coach portal · Dawsonville" title="Player development" />
        <EmptyState
          title="Player not found"
          hint="That player isn't on one of your rosters — they may have moved programs."
          action={
            <Link to="/coach/players">
              <Button variant="ghost">Back to my players</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const notes = SESSION_NOTES.filter((n) => n.playerId === p.id)
  const videos = VIDEOS.filter((v) => v.playerId === p.id)
  const trendData = p.compositeTrend.map((v, i) => ({ x: EVAL_LABELS[i] ?? `Eval ${i + 1}`, composite: v }))

  const scoreNum = Number(evalScore)
  const evalValid = evalScore !== '' && scoreNum >= 0 && scoreNum <= 100

  const saveEval = () => {
    const label = p.indexes.find((ix) => ix.key === evalKey)?.label ?? 'Index'
    toast(`${label} recorded at ${scoreNum} for ${p.name} — trend updates at the next eval sync`)
    setEvalOpen(false)
    setEvalScore('')
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'My players', to: '/coach/players' }, { label: p.name }]} />
      <PageHeader
        eyebrow="Coach portal · Dawsonville"
        title="Player development"
        sub={`${p.program} program · quarterly Rock Ready evals, your session notes, and the video record.`}
        action={
          <Button onClick={() => setEvalOpen(true)}>
            <ClipboardPlus size={15} aria-hidden /> Record eval
          </Button>
        }
      />

      {/* Identity + composite hero */}
      <Card className="rise">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar name={p.name} hue={p.hue} size={64} />
            <div className="min-w-0">
              <h2 className="display text-2xl font-semibold uppercase tracking-wide text-ice-50">
                {p.name} <span className="tabular text-lg font-normal text-ice-400">#{p.jersey}</span>
              </h2>
              <p className="mt-0.5 text-sm text-ice-300">
                {p.ageGroup} · {p.position} · age {p.age}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Chip tone={TIER_TONE[p.tier]}>{TIER_NAME[p.tier]} member</Chip>
                <Chip tone="gold" icon={<Flame size={11} aria-hidden />}>{p.streakDays}-day streak</Chip>
                <FlagChips player={p} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="display text-5xl font-bold text-frost-300">{gradeFor(p.composite)}</p>
              <p className="eyebrow mt-1 text-ice-400">Composite grade</p>
            </div>
            <RockReadyRing score={p.composite} />
          </div>
        </div>
      </Card>

      {/* Shape of the athlete + index board */}
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Card className="rise">
          <CardTitle>Shape of the athlete</CardTitle>
          <SkillRadar indexes={p.indexes} />
        </Card>
        <Card className="rise">
          <CardTitle>Rock Ready indexes</CardTitle>
          <div className="divide-y divide-ice-700/50">
            {p.indexes.map((ix) => (
              <PercentileRow key={ix.key} label={ix.label} score={ix.score} grade={ix.grade} />
            ))}
          </div>
          <p className="mt-3 text-xs text-ice-500">Percentiles vs. the {p.ageGroup} network board — blue runs cold, red runs hot.</p>
        </Card>
      </div>

      {/* Composite trend */}
      <Card className="rise mt-3">
        <CardTitle
          action={
            <Button variant="ghost" onClick={() => setEvalOpen(true)}>
              <ClipboardPlus size={14} aria-hidden /> Record eval
            </Button>
          }
        >
          Composite trend
        </CardTitle>
        <TrendChart data={trendData} yDomain={[40, 100]} />
        <p className="mt-2 text-xs text-ice-500">
          Eight quarterly evals · {p.compositeTrend[0]} → {p.compositeTrend[p.compositeTrend.length - 1]} composite.
        </p>
      </Card>

      {/* Notes + video record */}
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Card className="rise">
          <CardTitle
            action={
              <Link to="/coach/notes" className="text-xs font-semibold text-frost-300 hover:text-frost-200">
                Open composer →
              </Link>
            }
          >
            Session notes
          </CardTitle>
          {notes.length === 0 ? (
            <EmptyState
              title="No notes yet"
              hint={`Parents read these the night they land — give the ${p.name.split(' ')[0]} family their first one.`}
              action={
                <Link to="/coach/notes">
                  <Button variant="ghost">
                    <NotebookPen size={14} aria-hidden /> Write the first note
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-2">
              {notes.map((n, i) => (
                <article
                  key={n.id}
                  className="rise rounded-[10px] border border-ice-600/40 bg-ice-850 p-3.5"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-ice-50">{n.focus}</p>
                    <span className="tabular text-[11px] text-ice-400">{n.date}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-ice-300">{n.workedOn}</p>
                  {n.homework.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="eyebrow text-ice-500">Homework</span>
                      {n.homework.map((d) => (
                        <Chip key={d} tone="frost">{drillById(d)?.title ?? d}</Chip>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 border-l-2 border-frost-400/50 pl-2.5 text-xs italic text-ice-400">
                    Next: {n.nextFocus}
                  </p>
                </article>
              ))}
            </div>
          )}
        </Card>

        <Card className="rise">
          <CardTitle
            action={
              <Link to="/coach/video" className="text-xs font-semibold text-frost-300 hover:text-frost-200">
                Review queue →
              </Link>
            }
          >
            Session video
          </CardTitle>
          {videos.length === 0 ? (
            <EmptyState
              title="No video yet"
              hint="Clips recorded in the cages land here once the AI first pass finishes."
            />
          ) : (
            <div className="space-y-2">
              {videos.map((v, i) => (
                <Link
                  key={v.id}
                  to="/coach/video"
                  className="rise group flex items-center gap-3 rounded-[10px] border border-ice-600/40 bg-ice-850 px-3 py-2.5 transition-colors hover:border-frost-400/60"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span
                    className="flex h-11 w-16 shrink-0 items-center justify-center rounded-md"
                    style={{
                      background: `linear-gradient(135deg, hsl(${v.hue} 45% 26%), hsl(${(v.hue + 40) % 360} 55% 13%))`,
                    }}
                    aria-hidden
                  >
                    <Play size={14} className="text-ice-50/90" fill="currentColor" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ice-100 group-hover:text-frost-200">{v.title}</span>
                    <span className="tabular block text-[11px] text-ice-400">
                      {v.date} · {fmtDur(v.durationSec)}
                    </span>
                  </span>
                  <Chip tone={VIDEO_CHIP[v.status].tone}>{VIDEO_CHIP[v.status].label}</Chip>
                  <ChevronRight size={15} className="text-ice-500 transition-colors group-hover:text-frost-300" aria-hidden />
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Record eval modal */}
      <Modal open={evalOpen} onClose={() => setEvalOpen(false)} title={`Record eval — ${p.name.split(' ')[0]}`}>
        <div className="space-y-4">
          <label className="block">
            <span className="eyebrow text-ice-400">Index</span>
            <select value={evalKey} onChange={(e) => setEvalKey(e.target.value)} className={FIELD}>
              {p.indexes.map((ix) => (
                <option key={ix.key} value={ix.key}>
                  {ix.label} — currently {ix.score} ({ix.grade})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="eyebrow text-ice-400">Score (0–100 percentile)</span>
            <input
              type="number"
              min={0}
              max={100}
              value={evalScore}
              onChange={(e) => setEvalScore(e.target.value)}
              placeholder="e.g. 72"
              className={`${FIELD} tabular`}
            />
          </label>
          <p className="text-xs text-ice-500">
            New scores re-grade the index, refresh the radar, and roll into the composite at the next eval sync.
          </p>
          <Button onClick={saveEval} disabled={!evalValid} className="w-full">
            <Save size={15} aria-hidden /> Save eval
          </Button>
        </div>
      </Modal>
    </div>
  )
}
