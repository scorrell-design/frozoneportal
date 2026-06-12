import { useState } from 'react'
import { CalendarDays, Megaphone, Mic, Plus, Quote, Share2, Users, X } from 'lucide-react'
import { Button, Card, CardTitle, Chip, PageHeader, toast } from '../../components/ui'
import { BOOM_CALLS } from '../../data/seed'

const NEXT_CALL = BOOM_CALLS[0]
const PAST_CALLS = BOOM_CALLS.slice(1)

const TESTIMONIALS = [
  {
    quote: 'The referral kit from the May call put 31 new members on our board in six weeks. One call paid for the year.',
    name: 'C. Donato',
    facility: 'Tampa, FL',
  },
  {
    quote: "I came up through Chester, and Boom is the closest thing to having Tony's whiteboard in every building.",
    name: 'Stephen Abbatine',
    facility: 'Boston, MA',
  },
]

export default function BoomPage() {
  const [topics, setTopics] = useState<string[]>(NEXT_CALL.topics)
  const [draft, setDraft] = useState('')

  const addTopic = () => {
    const t = draft.trim()
    if (!t) return
    setTopics((xs) => [...xs, t])
    setDraft('')
    toast(`Topic added to the ${NEXT_CALL.date.split(',')[0]} agenda`)
  }

  const removeTopic = (i: number) => setTopics((xs) => xs.filter((_, idx) => idx !== i))

  const publish = () => toast('Agenda published to all 9 owners — calendar invites updated')

  return (
    <div>
      <PageHeader
        eyebrow="Frozen Ropes USA · Network HQ"
        title="Boom Calls"
        sub="Business Operations, Organization & Marketing — the monthly owners' think tank. One hour, nine facilities, zero fluff."
      />

      <div className="grid items-start gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          {/* Agenda builder */}
          <Card className="rise border-frost-400/30">
            <CardTitle action={<Chip tone="frost" icon={<CalendarDays size={11} aria-hidden />}>{NEXT_CALL.date}</Chip>}>
              Next call — {NEXT_CALL.theme}
            </CardTitle>
            <p className="-mt-2 mb-3 text-xs text-ice-400">Build the agenda. Owners see it the moment you publish.</p>
            <ol className="space-y-1.5">
              {topics.map((t, i) => (
                <li key={`${t}-${i}`} className="flex items-center gap-3 rounded-lg border border-ice-600/30 bg-ice-900/60 px-3 py-2">
                  <span className="display tabular w-5 shrink-0 text-sm font-bold text-frost-300">{i + 1}</span>
                  <span className="min-w-0 flex-1 text-sm text-ice-100">{t}</span>
                  <button
                    onClick={() => removeTopic(i)}
                    aria-label={`Remove topic: ${t}`}
                    className="shrink-0 rounded p-1 text-ice-400 transition-colors hover:bg-ice-700 hover:text-clay-300"
                  >
                    <X size={14} aria-hidden />
                  </button>
                </li>
              ))}
              {topics.length === 0 && (
                <li className="rounded-lg border border-dashed border-ice-600/50 px-3 py-4 text-center text-xs text-ice-500">
                  No topics yet — add the first one below.
                </li>
              )}
            </ol>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTopic()}
                placeholder="Add an agenda topic…"
                aria-label="New agenda topic"
                className="min-w-0 flex-1 rounded-md border border-ice-600/60 bg-ice-900 px-3 py-2 text-sm text-ice-100 placeholder:text-ice-500"
              />
              <Button variant="ghost" onClick={addTopic}>
                <Plus size={14} aria-hidden /> Add
              </Button>
            </div>
            <div className="mt-4 flex justify-end border-t border-ice-700/60 pt-4">
              <Button onClick={publish}>
                <Megaphone size={14} aria-hidden /> Publish agenda to all owners
              </Button>
            </div>
          </Card>

          {/* Past calls */}
          <Card className="rise">
            <CardTitle>Call library</CardTitle>
            <div className="space-y-3">
              {PAST_CALLS.map((c) => (
                <div key={c.id} className="rounded-lg border border-ice-600/30 bg-ice-900/60 p-4 transition-colors hover:border-frost-400/30">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="display text-base font-semibold uppercase tracking-wide text-ice-50">{c.theme}</p>
                      <p className="text-xs text-ice-400">{c.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip tone="ice" icon={<Users size={11} aria-hidden />}>{c.attendance}/9 owners</Chip>
                      {c.recorded && <Chip tone="grass" icon={<Mic size={11} aria-hidden />}>Recorded</Chip>}
                    </div>
                  </div>
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {c.topics.map((t) => (
                      <li key={t} className="text-xs text-ice-300">· {t}</li>
                    ))}
                  </ul>
                  <blockquote className="mt-3 border-l-2 border-gold-400/60 pl-3 text-sm italic leading-relaxed text-ice-200">
                    <Quote size={12} className="mb-1 text-gold-300" aria-hidden />
                    {c.takeaway}
                  </blockquote>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => toast(`Takeaway from "${c.theme}" re-shared to all owner feeds`)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-ice-600/60 px-2.5 py-1.5 text-xs font-semibold text-ice-200 transition-colors hover:bg-ice-700/60 hover:text-ice-50"
                    >
                      <Share2 size={12} aria-hidden /> Re-share takeaway
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Side rail */}
        <div className="space-y-4">
          <Card className="rise">
            <p className="eyebrow text-frost-300">What is Boom?</p>
            <p className="display mt-2 text-xl font-semibold uppercase tracking-wide text-ice-50">
              Business Operations, Organization &amp; Marketing
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ice-300">
              The monthly think tank where all nine owners get on one call with HQ. Wins get systematized,
              problems get solved once, and the best ideas ship to the Library the same week.
            </p>
            <ul className="mt-3 space-y-1.5 border-t border-ice-700/60 pt-3 text-xs text-ice-400">
              <li>· Last Wednesday of every month, one hour</li>
              <li>· Every call recorded and indexed in the Library</li>
              <li>· One published takeaway per call — no homework, just the play</li>
            </ul>
          </Card>

          <Card className="rise border-gold-400/30">
            <p className="eyebrow text-gold-300">From the owners</p>
            <div className="mt-3 space-y-4">
              {TESTIMONIALS.map((t) => (
                <figure key={t.name}>
                  <blockquote className="border-l-2 border-gold-400/60 pl-3 text-sm italic leading-relaxed text-ice-200">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-1.5 pl-3 text-xs text-ice-400">
                    <span className="font-semibold text-ice-200">{t.name}</span> · {t.facility}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
