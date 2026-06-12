import { useState } from 'react'
import { CheckCheck, NotebookPen, Quote, Send } from 'lucide-react'
import { Avatar, Button, Card, CardTitle, Chip, PageHeader, toast } from '../../components/ui'
import { COACH_ID, DRILLS, SESSION_NOTES, drillById, playerById } from '../../data/seed'
import { MY_PLAYERS } from './shared'
import type { SessionNote } from '../../lib/types'

const FIELD =
  'mt-1.5 w-full rounded-md border border-ice-600/60 bg-ice-900 px-3 py-2 text-sm text-ice-100 placeholder:text-ice-500 focus:border-frost-400 focus:outline-none'

function NoteCard({ note, delay }: { note: SessionNote; delay: number }) {
  const p = playerById(note.playerId)
  return (
    <article
      className="rise rounded-[10px] border border-ice-600/40 bg-ice-850 p-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          {p && <Avatar name={p.name} hue={p.hue} size={32} />}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ice-50">{p?.name ?? 'Player'}</p>
            <p className="tabular text-[11px] text-ice-400">{note.date}</p>
          </div>
        </div>
        {note.sentToParent && <Chip tone="grass" icon={<CheckCheck size={11} aria-hidden />}>Sent to parent</Chip>}
      </div>
      <p className="display mt-3 text-sm font-semibold uppercase tracking-wider text-frost-300">{note.focus}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-ice-200">{note.workedOn}</p>
      {note.homework.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="eyebrow text-ice-500">Homework</span>
          {note.homework.map((id) => (
            <Chip key={id} tone="frost">{drillById(id)?.title ?? id}</Chip>
          ))}
        </div>
      )}
      <p className="mt-3 flex items-start gap-1.5 border-l-2 border-frost-400/50 pl-2.5 text-xs italic text-ice-300">
        <Quote size={11} className="mt-0.5 shrink-0 text-frost-400/70" aria-hidden />
        {note.nextFocus}
      </p>
    </article>
  )
}

export default function CoachSessionNotes() {
  const [playerId, setPlayerId] = useState(MY_PLAYERS[0].id)
  const [focus, setFocus] = useState('')
  const [workedOn, setWorkedOn] = useState('')
  const [homework, setHomework] = useState<string[]>([])
  const [nextFocus, setNextFocus] = useState('')
  const [sent, setSent] = useState<SessionNote[]>(SESSION_NOTES)

  const toggleDrill = (id: string) =>
    setHomework((hw) => (hw.includes(id) ? hw.filter((d) => d !== id) : [...hw, id]))

  const canSend = focus.trim() !== '' && workedOn.trim() !== ''

  const send = () => {
    const note: SessionNote = {
      id: `sn-local-${Date.now()}`,
      playerId,
      coachId: COACH_ID,
      date: 'Fri Jun 12',
      focus: focus.trim(),
      workedOn: workedOn.trim(),
      homework,
      nextFocus: nextFocus.trim() || 'Carry it into the next session.',
      sentToParent: true,
    }
    setSent((xs) => [note, ...xs])
    const family = playerById(playerId)?.name.split(' ').pop() ?? 'player'
    toast(
      homework.length > 0
        ? `Note sent to the ${family} family — ${homework.length} homework ${homework.length === 1 ? 'drill' : 'drills'} attached`
        : `Note sent to the ${family} family`,
    )
    setFocus('')
    setWorkedOn('')
    setHomework([])
    setNextFocus('')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Coach portal · Dawsonville"
        title="Session notes"
        sub="Two minutes after the session beats a perfect write-up tomorrow — parents read these the night they land."
      />

      <div className="grid items-start gap-3 lg:grid-cols-[minmax(320px,420px)_1fr]">
        {/* Composer */}
        <Card className="rise lg:sticky lg:top-4">
          <CardTitle>
            <span className="flex items-center gap-2">
              <NotebookPen size={17} className="text-frost-400" aria-hidden /> New note
            </span>
          </CardTitle>
          <div className="space-y-3.5">
            <label className="block">
              <span className="eyebrow text-ice-400">Player</span>
              <select value={playerId} onChange={(e) => setPlayerId(e.target.value)} className={FIELD}>
                {MY_PLAYERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.ageGroup} {p.position}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="eyebrow text-ice-400">Session focus</span>
              <input
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder="e.g. Timing vs. off-speed"
                className={FIELD}
              />
            </label>
            <label className="block">
              <span className="eyebrow text-ice-400">What we worked on</span>
              <textarea
                value={workedOn}
                onChange={(e) => setWorkedOn(e.target.value)}
                rows={4}
                placeholder="What you saw, what you changed, how it ended…"
                className={`${FIELD} resize-y`}
              />
            </label>
            <div>
              <span className="eyebrow text-ice-400">Homework drills</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5" role="group" aria-label="Select homework drills">
                {DRILLS.map((d) => {
                  const on = homework.includes(d.id)
                  return (
                    <button
                      key={d.id}
                      onClick={() => toggleDrill(d.id)}
                      aria-pressed={on}
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        on
                          ? 'border-frost-400 bg-frost-400/15 text-frost-300'
                          : 'border-ice-600/60 text-ice-300 hover:border-ice-500 hover:text-ice-100'
                      }`}
                    >
                      {d.title}
                    </button>
                  )
                })}
              </div>
              <p className="mt-1.5 text-[11px] text-ice-500" aria-live="polite">
                {homework.length === 0
                  ? 'Tap to attach drills — they land in the player app as homework.'
                  : `${homework.length} ${homework.length === 1 ? 'drill' : 'drills'} attached.`}
              </p>
            </div>
            <label className="block">
              <span className="eyebrow text-ice-400">Next session focus</span>
              <input
                value={nextFocus}
                onChange={(e) => setNextFocus(e.target.value)}
                placeholder="Where we pick it up next time"
                className={FIELD}
              />
            </label>
            <Button onClick={send} disabled={!canSend} className="w-full">
              <Send size={15} aria-hidden /> Send to parent
            </Button>
          </div>
        </Card>

        {/* Sent history */}
        <div>
          <div className="rise mb-2 flex items-baseline justify-between px-1">
            <h2 className="display text-sm font-semibold uppercase tracking-wider text-ice-100">Sent notes</h2>
            <span className="tabular text-[11px] text-ice-400">{sent.length} on file</span>
          </div>
          <div className="space-y-3">
            {sent.map((n, i) => (
              <NoteCard key={n.id} note={n} delay={60 + i * 60} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
