import { useState } from 'react'
import { Check, Loader2, Send, ShieldCheck, X } from 'lucide-react'
import { Button, Card, CardTitle, Chip, PageHeader, toast } from '../../components/ui'
import { VIDEOS, playerById } from '../../data/seed'
import { fmtDur } from './shared'
import type { AiObservation, SessionVideo } from '../../lib/types'

const STATUS_CHIP: Record<SessionVideo['status'], { tone: 'frost' | 'ice' | 'grass'; label: string }> = {
  review: { tone: 'frost', label: 'Needs review' },
  processing: { tone: 'ice', label: 'Processing' },
  shared: { tone: 'grass', label: 'Shared' },
}

const confColor = (c: number) =>
  c >= 0.85 ? 'var(--color-grass-400)' : c >= 0.7 ? 'var(--color-frost-400)' : 'var(--color-gold-400)'

function PlayGlyph({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden>
      <circle cx="22" cy="22" r="21" fill="rgba(7,13,22,0.55)" stroke="rgba(239,244,250,0.35)" />
      <path d="M17.5 13.5 L31 22 L17.5 30.5 Z" fill="var(--color-ice-50)" />
    </svg>
  )
}

const thumbBg = (hue: number) =>
  `linear-gradient(135deg, hsl(${hue} 45% 26%), hsl(${(hue + 40) % 360} 55% 13%))`

export default function VideoReview() {
  const [videos, setVideos] = useState<SessionVideo[]>(() =>
    VIDEOS.map((v) => ({ ...v, observations: v.observations.map((o) => ({ ...o })) })),
  )
  const [selectedId, setSelectedId] = useState(() => (VIDEOS.find((v) => v.status === 'review') ?? VIDEOS[0]).id)
  const [comments, setComments] = useState<Record<string, string>>(() =>
    Object.fromEntries(VIDEOS.map((v) => [v.id, v.coachComment ?? ''])),
  )

  const selected = videos.find((v) => v.id === selectedId) ?? videos[0]
  const player = playerById(selected.playerId)
  const familyName = player?.name.split(' ').pop() ?? 'player'

  const pendingCount = selected.observations.filter((o) => o.status === 'pending').length
  const allResolved = selected.observations.length > 0 && pendingCount === 0
  const queueCount = videos.filter((v) => v.status === 'review').length

  const resolve = (obsId: string, status: AiObservation['status']) =>
    setVideos((vs) =>
      vs.map((v) =>
        v.id === selected.id
          ? { ...v, observations: v.observations.map((o) => (o.id === obsId ? { ...o, status } : o)) }
          : v,
      ),
    )

  const share = () => {
    setVideos((vs) => vs.map((v) => (v.id === selected.id ? { ...v, status: 'shared' } : v)))
    toast(`Shared to the ${familyName} family — only your approved findings travel.`)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Coach portal · Dawsonville"
        title="Coach-verified AI review"
        sub={`${queueCount} ${queueCount === 1 ? 'clip waits' : 'clips wait'} on your eyes — confirm or dismiss every finding before anything ships.`}
      />

      {/* Trust banner */}
      <Card className="rise border-frost-400/30 bg-frost-400/5">
        <div className="flex items-start gap-3">
          <ShieldCheck size={22} className="mt-0.5 shrink-0 text-frost-300" aria-hidden />
          <div>
            <p className="display text-lg font-semibold uppercase tracking-wide text-ice-50">
              AI takes the first pass. Nothing reaches a parent until you approve it.
            </p>
            <p className="mt-1 text-sm text-ice-300">
              The model watches every cage clip and flags what it sees with a confidence score. You confirm or
              dismiss each finding — families only ever see coach-verified analysis, delivered in your words.
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(300px,360px)_1fr]">
        {/* Queue */}
        <div className="space-y-2">
          <p className="eyebrow rise px-1 text-ice-400">Review queue</p>
          {videos.map((v, i) => {
            const vp = playerById(v.playerId)
            const chip = STATUS_CHIP[v.status]
            const active = v.id === selected.id
            return (
              <button
                key={v.id}
                onClick={() => setSelectedId(v.id)}
                aria-pressed={active}
                aria-label={`Open ${v.title} for ${vp?.name ?? 'player'}`}
                className={`rise flex w-full items-center gap-3 rounded-[10px] border p-3 text-left transition-colors ${
                  active
                    ? 'border-frost-400/70 bg-ice-800 shadow-[0_0_16px_rgba(56,189,248,0.12)]'
                    : 'border-ice-600/40 bg-ice-850 hover:border-ice-500'
                }`}
                style={{ animationDelay: `${60 + i * 50}ms` }}
              >
                <span
                  className="flex h-12 w-[72px] shrink-0 items-center justify-center rounded-md"
                  style={{ background: thumbBg(v.hue) }}
                  aria-hidden
                >
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path d="M5 3 L15 9 L5 15 Z" fill="rgba(239,244,250,0.9)" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ice-50">{v.title}</span>
                  <span className="tabular mt-0.5 block text-[11px] text-ice-400">
                    {vp?.name} · {v.date} · {fmtDur(v.durationSec)}
                  </span>
                  <span className="mt-1.5 block">
                    <Chip tone={chip.tone}>{chip.label}</Chip>
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Review panel */}
        <Card className="rise self-start">
          <CardTitle action={<Chip tone={STATUS_CHIP[selected.status].tone}>{STATUS_CHIP[selected.status].label}</Chip>}>
            {selected.title}
          </CardTitle>
          <p className="tabular -mt-2 mb-3 text-xs text-ice-400">
            {player?.name} · {player?.ageGroup} {player?.position} · {selected.date}
          </p>

          {/* Player area */}
          <div
            className="relative flex h-52 items-center justify-center overflow-hidden rounded-[10px] sm:h-64"
            style={{ background: thumbBg(selected.hue) }}
            role="img"
            aria-label={`Session video: ${selected.title}, ${fmtDur(selected.durationSec)}`}
          >
            <PlayGlyph size={56} />
            <span className="tabular absolute bottom-2.5 right-3 rounded bg-ice-950/70 px-1.5 py-0.5 text-xs font-semibold text-ice-100">
              {fmtDur(selected.durationSec)}
            </span>
            <span className="absolute left-3 top-2.5 rounded bg-ice-950/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-frost-300">
              Cage cam
            </span>
          </div>

          {selected.status === 'processing' ? (
            <div className="mt-4 flex flex-col items-center rounded-[10px] border border-dashed border-ice-600/50 px-6 py-10 text-center">
              <Loader2 size={26} className="animate-spin text-frost-400" aria-hidden />
              <p className="display mt-3 text-lg font-semibold uppercase tracking-wide text-ice-100">
                AI first pass in progress
              </p>
              <p className="mt-1 max-w-sm text-sm text-ice-400">
                The model is still watching this clip. Observations land here for your review — nothing is visible
                to the family yet.
              </p>
              <div className="mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-ice-700" aria-hidden>
                <div className="h-full w-1/2 animate-pulse rounded-full bg-frost-400/70" />
              </div>
            </div>
          ) : (
            <>
              {/* Observations */}
              <div className="mt-4 flex items-center justify-between">
                <h3 className="display text-sm font-semibold uppercase tracking-wider text-ice-200">
                  AI observations
                </h3>
                <span className="tabular text-xs text-ice-400" aria-live="polite">
                  {selected.observations.length - pendingCount} of {selected.observations.length} resolved
                </span>
              </div>
              <ul className="mt-2 space-y-2">
                {selected.observations.map((o) => (
                  <li key={o.id} className="rounded-[10px] border border-ice-600/40 bg-ice-850 p-3.5">
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                      <p
                        className={`min-w-0 flex-1 text-sm leading-snug ${
                          o.status === 'dismissed' ? 'text-ice-500 line-through' : 'text-ice-100'
                        }`}
                        style={{ minWidth: 200 }}
                      >
                        {o.text}
                      </p>
                      {o.status === 'pending' && selected.status === 'review' ? (
                        <div className="flex shrink-0 items-center gap-1.5">
                          <button
                            onClick={() => resolve(o.id, 'confirmed')}
                            aria-label={`Confirm observation: ${o.text}`}
                            className="inline-flex items-center gap-1 rounded-md border border-grass-500/50 bg-grass-500/10 px-2.5 py-1.5 text-xs font-semibold text-grass-400 transition-colors hover:bg-grass-500 hover:text-ice-950"
                          >
                            <Check size={13} aria-hidden /> Confirm
                          </button>
                          <button
                            onClick={() => resolve(o.id, 'dismissed')}
                            aria-label={`Dismiss observation: ${o.text}`}
                            className="inline-flex items-center gap-1 rounded-md border border-ice-600/60 px-2.5 py-1.5 text-xs font-semibold text-ice-300 transition-colors hover:bg-ice-700 hover:text-ice-100"
                          >
                            <X size={13} aria-hidden /> Dismiss
                          </button>
                        </div>
                      ) : o.status === 'confirmed' ? (
                        <Chip tone="grass" icon={<Check size={11} aria-hidden />}>Confirmed</Chip>
                      ) : o.status === 'dismissed' ? (
                        <Chip tone="ice" icon={<X size={11} aria-hidden />}>Dismissed</Chip>
                      ) : null}
                    </div>
                    <div className="mt-2.5 flex items-center gap-2.5">
                      <span className="eyebrow text-ice-500">Confidence</span>
                      <div
                        className="h-1.5 flex-1 rounded-full bg-ice-700"
                        role="img"
                        aria-label={`AI confidence ${Math.round(o.confidence * 100)} percent`}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.round(o.confidence * 100)}%`,
                            background: confColor(o.confidence),
                            transition: 'width 600ms cubic-bezier(0.22,1,0.36,1)',
                          }}
                        />
                      </div>
                      <span className="tabular w-9 text-right text-xs font-semibold" style={{ color: confColor(o.confidence) }}>
                        {Math.round(o.confidence * 100)}%
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Coach sign-off */}
              {selected.status === 'review' ? (
                <div className="mt-4 rounded-[10px] border border-ice-600/40 bg-ice-900 p-3.5">
                  <label className="block">
                    <span className="eyebrow text-ice-400">Your comment to the family</span>
                    <textarea
                      value={comments[selected.id] ?? ''}
                      onChange={(e) => setComments((c) => ({ ...c, [selected.id]: e.target.value }))}
                      rows={3}
                      placeholder={`What should the ${familyName} family take from this clip?`}
                      className="mt-1.5 w-full resize-y rounded-md border border-ice-600/60 bg-ice-850 px-3 py-2 text-sm text-ice-100 placeholder:text-ice-500 focus:border-frost-400 focus:outline-none"
                    />
                  </label>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-ice-500">
                      {allResolved
                        ? 'Every finding is resolved — dismissed items never leave this screen.'
                        : `Resolve ${pendingCount} remaining ${pendingCount === 1 ? 'finding' : 'findings'} to unlock sharing.`}
                    </p>
                    <Button onClick={share} disabled={!allResolved}>
                      <Send size={15} aria-hidden /> Approve & share with family
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-[10px] border border-grass-500/30 bg-grass-500/5 p-3.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-grass-400" aria-hidden />
                    <p className="text-sm font-semibold text-grass-400">Shared with the {familyName} family</p>
                  </div>
                  {(comments[selected.id] ?? '').trim() !== '' && (
                    <p className="mt-2 border-l-2 border-grass-500/50 pl-2.5 text-sm italic text-ice-200">
                      “{comments[selected.id]}”
                    </p>
                  )}
                  <p className="mt-2 text-xs text-ice-500">
                    Only confirmed findings traveled — this clip now appears in the player and parent portals.
                  </p>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
