import { useState } from 'react'
import { Building2, GraduationCap, Send } from 'lucide-react'
import { Avatar, Button, Card, PageHeader, toast } from '../../components/ui'
import { THREADS } from '../../data/seed'
import type { MessageThread } from '../../lib/types'

type Msg = MessageThread['messages'][number]

function ThreadIcon({ thread }: { thread: MessageThread }) {
  if (thread.withRole === 'Lead Instructor') return <Avatar name={thread.with.replace('Coach ', '')} hue={18} size={36} />
  const Icon = thread.withRole === 'Facility' ? Building2 : GraduationCap
  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ice-500/50 bg-ice-700 text-ice-300" aria-hidden>
      <Icon size={16} />
    </span>
  )
}

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(THREADS[0].id)
  const [extra, setExtra] = useState<Record<string, Msg[]>>({})
  const [draft, setDraft] = useState('')

  const messagesFor = (t: MessageThread) => [...t.messages, ...(extra[t.id] ?? [])]
  const active = THREADS.find((t) => t.id === activeId)!
  const activeMessages = messagesFor(active)

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setExtra((xs) => ({ ...xs, [activeId]: [...(xs[activeId] ?? []), { from: 'me', text, time: 'Just now' }] }))
    setDraft('')
    toast('Sent — the Dawsonville team usually replies within a few hours.')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Parent portal · Whitman family"
        title="Messages"
        sub="A direct line to Tyler's coach and the front desk — no team-app chaos, no lost group texts."
      />

      <div className="grid gap-3 lg:grid-cols-[minmax(260px,320px)_1fr]">
        {/* Thread list */}
        <Card className="rise self-start" pad={false}>
          <div className="border-b border-ice-600/30 px-4 py-3">
            <p className="eyebrow text-ice-400">Conversations</p>
          </div>
          <ul className="divide-y divide-ice-600/30">
            {THREADS.map((t) => {
              const msgs = messagesFor(t)
              const last = msgs[msgs.length - 1]
              const isActive = t.id === activeId
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setActiveId(t.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${isActive ? 'bg-frost-400/10' : 'hover:bg-ice-700/40'}`}
                  >
                    <ThreadIcon thread={t} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className={`truncate text-sm font-semibold ${isActive ? 'text-frost-300' : 'text-ice-100'}`}>{t.with}</span>
                        <span className="tabular shrink-0 text-[10px] text-ice-500">{last.time}</span>
                      </span>
                      <span className="block text-[11px] text-ice-400">{t.withRole}</span>
                      <span className="mt-0.5 block truncate text-xs text-ice-300">
                        {last.from === 'me' ? 'You: ' : ''}{last.text}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Card>

        {/* Conversation */}
        <Card className="rise flex flex-col" pad={false}>
          <div className="flex items-center gap-3 border-b border-ice-600/30 px-4 py-3 sm:px-5">
            <ThreadIcon thread={active} />
            <div className="min-w-0">
              <p className="display truncate text-base font-semibold uppercase tracking-wide text-ice-50">{active.with}</p>
              <p className="text-xs text-ice-400">{active.withRole} · Frozen Ropes Dawsonville</p>
            </div>
          </div>

          <div className="flex max-h-[52vh] min-h-[280px] flex-col gap-2.5 overflow-y-auto p-4 sm:p-5" aria-label={`Conversation with ${active.with}`}>
            {activeMessages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.from === 'me' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[82%] rounded-xl border px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.from === 'me'
                      ? 'rounded-br-sm border-frost-400/30 bg-frost-400/15 text-ice-50'
                      : 'rounded-bl-sm border-ice-600/50 bg-ice-700/60 text-ice-100'
                  }`}
                >
                  {m.text}
                </div>
                <span className="tabular mt-1 px-1 text-[10px] text-ice-500">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className="flex items-center gap-2 border-t border-ice-600/30 p-3 sm:p-4">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={`Message ${active.with}…`}
              aria-label={`Message ${active.with}`}
              className="w-full rounded-md border border-ice-600/60 bg-ice-900 px-3 py-2 text-sm text-ice-100 placeholder:text-ice-500"
            />
            <Button onClick={send} disabled={!draft.trim()}>
              <Send size={15} aria-hidden /> Send
            </Button>
          </div>
        </Card>
      </div>

      <p className="mt-3 text-xs text-ice-500">
        Messages go straight to staff — never to other families. For anything urgent, call the front desk at (706) 555-0100.
      </p>
    </div>
  )
}
