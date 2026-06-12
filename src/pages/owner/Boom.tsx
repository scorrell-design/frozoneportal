import { CalendarDays, CheckCircle2, Megaphone, Mic, Users, Video } from 'lucide-react'
import { Button, Card, CardTitle, Chip, PageHeader, toast } from '../../components/ui'
import { BOOM_CALLS } from '../../data/seed'

const NETWORK_SIZE = 9

export default function BoomPage() {
  const [next, ...past] = BOOM_CALLS

  return (
    <div>
      <PageHeader
        eyebrow="Frozen Ropes USA · owners only"
        title="Boom Calls"
        sub="The monthly owners' think tank — what's working across nine facilities, straight from the people running them."
      />

      <div className="grid gap-4 xl:grid-cols-3">
        {/* Next call hero */}
        <Card className="rise border-frost-400/40 xl:col-span-2" >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Chip tone="frost" icon={<CalendarDays size={11} aria-hidden />}>Next call · {next.date}</Chip>
            <Chip tone="ice" icon={<Mic size={11} aria-hidden />}>Live · 60 min</Chip>
          </div>
          <h2 className="display mt-3 text-3xl font-semibold text-ice-50">{next.theme}</h2>
          <p className="mt-1 text-sm text-ice-300">
            Hosted by Tony Abbatine, Frozen Ropes USA — all {NETWORK_SIZE} facility owners on the line.
          </p>

          <p className="eyebrow mt-5 mb-2 text-ice-400">On the agenda</p>
          <ul className="space-y-2">
            {next.topics.map((topic) => (
              <li key={topic} className="flex items-start gap-2.5 rounded-lg border border-ice-600/40 bg-ice-900/60 px-3 py-2.5">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-frost-400" aria-hidden />
                <span className="text-sm text-ice-100">{topic}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button onClick={() => toast(`RSVP confirmed — ${next.theme}, ${next.date}`)}>
              <CalendarDays size={15} aria-hidden /> RSVP for {next.date.split(',')[0]}
            </Button>
            <span className="text-xs text-ice-400">Dawsonville's first 120 days is on this agenda — your story, Dana.</span>
          </div>
        </Card>

        {/* What is Boom */}
        <Card className="rise" >
          <CardTitle action={<Megaphone size={17} className="text-frost-400" aria-hidden />}>What's a Boom Call?</CardTitle>
          <p className="text-sm leading-relaxed text-ice-300">
            <span className="font-semibold text-ice-100">Business Operations, Organization &amp; Marketing</span> — the
            monthly owners' think tank. One theme, one hour, every owner in the network. No vendors, no pitch decks; just
            what moved the numbers last month and the playbook behind it.
          </p>
          <div className="mt-4 space-y-2.5">
            <p className="flex items-center gap-2 text-xs text-ice-300">
              <Users size={14} className="shrink-0 text-frost-400" aria-hidden />
              {NETWORK_SIZE} facilities, owners only — last Wednesday of every month
            </p>
            <p className="flex items-center gap-2 text-xs text-ice-300">
              <Video size={14} className="shrink-0 text-frost-400" aria-hidden />
              Every call recorded; takeaways ship to the Library within the week
            </p>
            <p className="flex items-center gap-2 text-xs text-ice-300">
              <CheckCircle2 size={14} className="shrink-0 text-frost-400" aria-hidden />
              Best practices become kits — the referral engine started as a Boom takeaway
            </p>
          </div>
        </Card>
      </div>

      {/* Past calls */}
      <h2 className="display mt-6 mb-3 text-lg font-semibold text-ice-100">Past calls</h2>
      <div className="grid gap-3 lg:grid-cols-3">
        {past.map((call, i) => (
          <div key={call.id} className="rise" style={{ animationDelay: `${100 + i * 50}ms` }}>
            <Card className="flex h-full flex-col">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="tabular text-xs text-ice-400">{call.date}</span>
                {call.recorded && <Chip tone="frost" icon={<Video size={11} aria-hidden />}>Recorded</Chip>}
              </div>
              <h3 className="display mt-2 text-xl font-semibold text-ice-50">{call.theme}</h3>
              <p className="tabular mt-1 flex items-center gap-1.5 text-xs text-ice-400">
                <Users size={12} aria-hidden /> {call.attendance}/{NETWORK_SIZE} facilities
              </p>
              <blockquote className="mt-3 flex-1 rounded-lg border-l-2 border-gold-400/70 bg-ice-900/60 px-3 py-2.5 text-sm italic leading-relaxed text-ice-200">
                “{call.takeaway}”
              </blockquote>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
