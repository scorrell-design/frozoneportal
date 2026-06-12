import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Clock, DollarSign, Eye, MapPin, Send, Users } from 'lucide-react'
import { Button, Card, Chip, Modal, PageHeader, StatCard, toast } from '../../components/ui'
import { PROSPECTS } from '../../data/seed'
import type { Prospect } from '../../lib/types'

type Stage = Prospect['stage']

const STAGES: { id: Stage; label: string; tone: 'ice' | 'frost' | 'gold' | 'grass' }[] = [
  { id: 'lead', label: 'Lead', tone: 'ice' },
  { id: 'toured', label: 'Toured', tone: 'frost' },
  { id: 'sneak-peek', label: 'Sneak Peek', tone: 'gold' },
  { id: 'committed', label: 'Committed', tone: 'grass' },
]

const nextStage = (s: Stage): Stage | null => {
  const i = STAGES.findIndex((x) => x.id === s)
  return i >= 0 && i < STAGES.length - 1 ? STAGES[i + 1].id : null
}

function DaysChip({ days }: { days: number }) {
  if (days > 7) return <Chip tone="clay" icon={<Clock size={11} aria-hidden />}>{days}d — needs follow-up</Chip>
  return <Chip tone="ice" icon={<Clock size={11} aria-hidden />}>{days}d in stage</Chip>
}

export default function PipelinePage() {
  const [prospects, setProspects] = useState<Prospect[]>(PROSPECTS)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = prospects.find((p) => p.id === selectedId) ?? null

  const pipelineValue = prospects.filter((p) => p.stage !== 'committed').reduce((s, p) => s + p.value, 0)
  const committedValue = prospects.filter((p) => p.stage === 'committed').reduce((s, p) => s + p.value, 0)
  const avgDays = prospects.reduce((s, p) => s + p.days, 0) / prospects.length

  const sendSneakPeek = (p: Prospect) => toast(`Sneak Peek link sent to ${p.name} — /sneak-peek`)

  const advance = (p: Prospect) => {
    const next = nextStage(p.stage)
    if (!next) return
    setProspects((xs) => xs.map((x) => (x.id === p.id ? { ...x, stage: next, days: 0 } : x)))
    const label = STAGES.find((s) => s.id === next)?.label
    toast(next === 'committed' ? `${p.name} committed — welcome to the network` : `${p.name} advanced to ${label}`)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Frozen Ropes USA · Network HQ"
        title="License Pipeline"
        sub="Every market in play, lead to committed. The license fee is ~$100k — the Sneak Peek does the selling."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pipeline value" value={pipelineValue} format={(n) => `$${Math.round(n / 1000)}k`} icon={<DollarSign size={18} aria-hidden />} />
        <StatCard label="Committed value" value={committedValue} format={(n) => `$${Math.round(n / 1000)}k`} icon={<Building2 size={18} aria-hidden />} />
        <StatCard label="Prospects in play" value={prospects.length} format={(n) => String(Math.round(n))} icon={<Users size={18} aria-hidden />} />
        <StatCard label="Avg days in stage" value={avgDays} format={(n) => `${Math.round(n)}d`} icon={<Clock size={18} aria-hidden />} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STAGES.map((stage, i) => {
          const cards = prospects.filter((p) => p.stage === stage.id)
          return (
            <div key={stage.id} className="rise" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="flex items-center gap-2">
                  <span className="eyebrow text-ice-300">{stage.label}</span>
                  <Chip tone={stage.tone}>{cards.length}</Chip>
                </span>
                {i < STAGES.length - 1 && <ArrowRight size={13} className="text-ice-600" aria-hidden />}
              </div>
              <div className="space-y-2 rounded-[10px] border border-ice-700/50 bg-ice-900/40 p-2">
                {cards.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className="w-full rounded-lg border border-ice-600/40 bg-ice-800 p-3 text-left transition-colors hover:border-frost-400/50 hover:bg-ice-700/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-ice-100">{p.name}</p>
                      <span className="tabular shrink-0 text-xs font-bold text-frost-300">${Math.round(p.value / 1000)}k</span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-ice-400">
                      <MapPin size={11} aria-hidden /> {p.market}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-ice-300">{p.note}</p>
                    <div className="mt-2"><DaysChip days={p.days} /></div>
                  </button>
                ))}
                {cards.length === 0 && (
                  <p className="px-2 py-6 text-center text-xs text-ice-500">Nothing in {stage.label.toLowerCase()}.</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Card className="rise mt-4 border-gold-400/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Eye size={18} className="shrink-0 text-gold-300" aria-hidden />
            <div>
              <p className="display text-base font-semibold uppercase tracking-wide text-ice-50">See what prospects see</p>
              <p className="text-xs text-ice-400">The Sneak Peek is the prospect-facing surface — the tour, the Blueprint Simulator, the invite CTA.</p>
            </div>
          </div>
          <Link to="/sneak-peek" className="inline-flex items-center gap-1 text-xs font-semibold text-frost-300 hover:text-frost-200">
            Open /sneak-peek <ArrowRight size={13} aria-hidden />
          </Link>
        </div>
      </Card>

      <Modal open={selected !== null} onClose={() => setSelectedId(null)} title={selected?.name ?? ''} wide>
        {selected && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone={STAGES.find((s) => s.id === selected.stage)?.tone ?? 'ice'}>
                {STAGES.find((s) => s.id === selected.stage)?.label}
              </Chip>
              <Chip tone="frost" icon={<MapPin size={11} aria-hidden />}>{selected.market}</Chip>
              <Chip tone="ice" icon={<DollarSign size={11} aria-hidden />}>${Math.round(selected.value / 1000)}k license</Chip>
              <DaysChip days={selected.days} />
            </div>
            <div className="rounded-lg border border-ice-600/40 bg-ice-900/60 p-3">
              <p className="eyebrow mb-1 text-ice-400">Notes</p>
              <p className="text-sm leading-relaxed text-ice-200">{selected.note}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="ghost" onClick={() => sendSneakPeek(selected)}>
                <Send size={14} aria-hidden /> Send Sneak Peek
              </Button>
              <Button onClick={() => advance(selected)} disabled={selected.stage === 'committed'}>
                {selected.stage === 'committed' ? 'Committed' : (
                  <>Advance to {STAGES.find((s) => s.id === nextStage(selected.stage))?.label} <ArrowRight size={14} aria-hidden /></>
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
