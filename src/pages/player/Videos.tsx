import { useState } from 'react'
import { Check, Play, ShieldCheck } from 'lucide-react'
import { Card, Chip, EmptyState, Modal, PageHeader } from '../../components/ui'
import { TYLER, VIDEOS } from '../../data/seed'
import type { SessionVideo } from '../../lib/types'

const fmtDuration = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

function Thumb({ video, large }: { video: SessionVideo; large?: boolean }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-[10px] ${large ? 'aspect-video' : 'aspect-[16/9]'}`}
      style={{
        background: `linear-gradient(135deg, hsl(${video.hue} 55% 22%), hsl(${video.hue} 60% 10%))`,
      }}
      aria-hidden
    >
      <span
        className={`flex items-center justify-center rounded-full border border-white/20 bg-ice-950/60 text-frost-300 backdrop-blur-sm transition-transform group-hover:scale-110 ${large ? 'h-16 w-16' : 'h-12 w-12'}`}
      >
        <Play size={large ? 26 : 20} className="ml-0.5" fill="currentColor" />
      </span>
      <span className="tabular absolute bottom-2 right-2 rounded bg-ice-950/80 px-1.5 py-0.5 text-[11px] font-semibold text-ice-100">
        {fmtDuration(video.durationSec)}
      </span>
    </div>
  )
}

export default function PlayerVideos() {
  const shared = VIDEOS.filter((v) => v.playerId === TYLER.id && v.status === 'shared')
  const [selected, setSelected] = useState<SessionVideo | null>(null)

  return (
    <div>
      <PageHeader
        eyebrow="Player portal · My videos"
        title="Your film room"
        sub="Videos appear here once Coach Marcus approves them — every clip comes with his read, not a robot's."
      />

      <div className="rise mb-4 flex items-start gap-3 rounded-[10px] border border-frost-400/30 bg-frost-400/5 p-3.5">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-frost-400" aria-hidden />
        <p className="text-sm leading-relaxed text-ice-200">
          <span className="font-semibold text-frost-300">Coach-approved only.</span> The AI takes a first
          look at your sessions, but nothing lands here until Coach Marcus has confirmed what it saw and
          added his own comment.
        </p>
      </div>

      {shared.length === 0 ? (
        <EmptyState
          title="No film yet"
          hint="Videos appear here once Coach Marcus approves them. Your next session clip is probably in his queue."
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {shared.map((v, i) => {
            const confirmed = v.observations.filter((o) => o.status === 'confirmed')
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelected(v)}
                className="rise group block text-left"
                style={{ animationDelay: `${i * 60}ms` }}
                aria-label={`Open video: ${v.title}`}
              >
                <Card className="h-full transition-colors group-hover:border-frost-400/60">
                  <Thumb video={v} />
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <p className="min-w-0 flex-1 truncate text-sm font-semibold text-ice-50">{v.title}</p>
                    <Chip tone="grass" icon={<Check size={11} aria-hidden />}>Approved</Chip>
                  </div>
                  <p className="mt-0.5 text-xs text-ice-400">{v.date}</p>
                  {v.coachComment && (
                    <p className="mt-2.5 border-l-2 border-frost-400/50 pl-3 text-sm italic leading-relaxed text-ice-300">
                      “{v.coachComment}”
                    </p>
                  )}
                  {confirmed.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {confirmed.map((o) => (
                        <li key={o.id} className="flex items-start gap-2 text-xs leading-relaxed text-ice-200">
                          <Check size={13} className="mt-0.5 shrink-0 text-grass-400" aria-hidden />
                          {o.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </button>
            )
          })}
        </div>
      )}

      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.title ?? ''} wide>
        {selected && (
          <div>
            <Thumb video={selected} large />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-ice-400">{selected.date} · {fmtDuration(selected.durationSec)}</span>
              <span className="ml-auto"><Chip tone="grass" icon={<Check size={11} aria-hidden />}>Coach approved</Chip></span>
            </div>
            {selected.coachComment && (
              <div className="mt-4 rounded-[10px] border border-frost-400/30 bg-frost-400/5 p-3.5">
                <p className="eyebrow text-frost-300">Coach Marcus says</p>
                <p className="mt-1.5 text-sm italic leading-relaxed text-ice-100">“{selected.coachComment}”</p>
              </div>
            )}
            <p className="eyebrow mt-4 text-ice-400">Confirmed observations</p>
            <ul className="mt-2 space-y-2">
              {selected.observations.filter((o) => o.status === 'confirmed').map((o) => (
                <li key={o.id} className="flex items-start gap-2.5 rounded-lg border border-ice-600/40 bg-ice-900/60 p-3 text-sm leading-relaxed text-ice-100">
                  <Check size={15} className="mt-0.5 shrink-0 text-grass-400" aria-hidden />
                  <span className="min-w-0 flex-1">{o.text}</span>
                  <span className="tabular shrink-0 text-[11px] text-ice-500">{Math.round(o.confidence * 100)}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  )
}
