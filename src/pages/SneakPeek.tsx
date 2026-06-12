import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, CheckCircle2, LibraryBig, Star, Store, Users, Video } from 'lucide-react'
import { RopeMark } from '../components/AppShell'
import { Button, Chip, DemoTag, toast, useCountUp } from '../components/ui'

const PILLAR_CARDS = [
  { icon: LibraryBig, title: 'The Frozone Library', body: '35 years of curriculum — Instruction, Operations, Programs, Marketing — searchable in seconds, not buried in a drive.' },
  { icon: BarChart3, title: 'The Blueprint', body: 'Your P&L tracked live against benchmarks from facilities that have run profitably since 1990.' },
  { icon: Users, title: 'Members & POS', body: 'Memberships, billing, stored balance, pro shop, concessions — one register, one system of record.' },
  { icon: Video, title: 'Rock Ready development', body: 'Evals, video with coach-verified AI analysis, and session notes parents actually read.' },
  { icon: Star, title: 'Rewards across the network', body: 'Points earned in San Diego redeem in Dallas. Loyalty that travels with the family.' },
  { icon: Store, title: 'College Bound', body: 'From Born to Play at age 3 to a D1/D2/D3 fit list at 17 — the relationship never ends.' },
]

function Simulator() {
  const [members, setMembers] = useState(220)
  const [avgFee, setAvgFee] = useState(150)
  const [cageHours, setCageHours] = useState(45)

  const calc = useMemo(() => {
    const membership = members * avgFee * 12
    const lessons = members * 0.4 * 70 * 26
    const cages = cageHours * 40 * 52
    const retail = members * 14 * 12
    const revenue = membership + lessons + cages + retail
    const expenses = revenue * 0.42 + 118000 + members * 60
    return { revenue, ebitda: revenue - expenses, membership, lessons, cages, retail }
  }, [members, avgFee, cageHours])

  const rev = useCountUp(calc.revenue, 600)
  const ebitda = useCountUp(calc.ebitda, 600)
  const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`

  const Slider = ({ label, value, set, min, max, step = 1, unit }: { label: string; value: number; set: (n: number) => void; min: number; max: number; step?: number; unit: string }) => (
    <label className="block">
      <span className="flex justify-between text-sm">
        <span className="font-medium text-ice-200">{label}</span>
        <span className="tabular font-semibold text-frost-300">{value}{unit}</span>
      </span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--color-frost-400)]"
      />
    </label>
  )

  return (
    <div className="grid gap-8 rounded-2xl border border-ice-600/50 bg-ice-850/80 p-6 backdrop-blur md:grid-cols-2 md:p-10">
      <div className="space-y-6">
        <div>
          <p className="eyebrow text-frost-400">The Blueprint Simulator</p>
          <h3 className="display mt-1 text-2xl font-semibold uppercase tracking-wide">Model your facility</h3>
          <p className="mt-2 text-sm text-ice-300">Powered by the same Blueprint benchmarks our owners run on. Drag the levers.</p>
        </div>
        <Slider label="Members" value={members} set={setMembers} min={80} max={450} step={10} unit="" />
        <Slider label="Avg. monthly membership" value={avgFee} set={setAvgFee} min={79} max={399} unit="/mo" />
        <Slider label="Cage rental hours / week" value={cageHours} set={setCageHours} min={10} max={90} unit=" hrs" />
      </div>
      <div className="flex flex-col justify-center gap-4">
        <div className="rounded-xl border border-ice-600/40 bg-ice-900 p-5">
          <p className="eyebrow text-ice-400">Projected annual revenue</p>
          <p className="display tabular mt-1 text-5xl font-bold text-ice-50">{fmt(rev)}</p>
          <div className="mt-3 space-y-1 text-xs text-ice-400">
            <p className="flex justify-between"><span>Memberships</span><span className="tabular">{fmt(calc.membership)}</span></p>
            <p className="flex justify-between"><span>Lessons & classes</span><span className="tabular">{fmt(calc.lessons)}</span></p>
            <p className="flex justify-between"><span>Cage rentals</span><span className="tabular">{fmt(calc.cages)}</span></p>
            <p className="flex justify-between"><span>Pro shop & concessions</span><span className="tabular">{fmt(calc.retail)}</span></p>
          </div>
        </div>
        <div className="rounded-xl border border-grass-500/30 bg-grass-500/10 p-5">
          <p className="eyebrow text-grass-400">Projected EBITDA</p>
          <p className="display tabular mt-1 text-4xl font-bold text-grass-400">{fmt(ebitda)}</p>
          <p className="mt-1 text-xs text-ice-400">Blueprint expense model · before license fee · illustrative <DemoTag /></p>
        </div>
      </div>
    </div>
  )
}

export default function SneakPeek() {
  const [sent, setSent] = useState(false)
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,#13304a_0%,#0a1420_50%,#070d16_100%)]" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5">
          <RopeMark size={30} />
          <span className="display text-xl font-bold uppercase tracking-[0.2em]">Frozone</span>
          <Chip tone="gold">Sneak Peek</Chip>
        </div>
        <Link to="/" className="text-sm font-medium text-ice-300 hover:text-frost-300">Persona login →</Link>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24">
        {/* Hero */}
        <section className="py-16 text-center sm:py-24">
          <p className="eyebrow text-frost-400">For prospective owners</p>
          <h1 className="display mx-auto mt-3 max-w-3xl text-5xl font-bold uppercase leading-[0.95] tracking-wide sm:text-7xl">
            Own a baseball business, <span className="text-frost-400">not a guessing game.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-ice-300">
            Since 1990, Frozen Ropes has trained players from first glove to first college offer — and taught owners how to run the building.
            The Frozone is that whole playbook, turned into an operating system.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#simulator"><Button>Model your facility <ArrowRight size={15} /></Button></a>
            <Link to="/"><Button variant="ghost">Tour the live portal</Button></Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-ice-400">
            <span>9 facilities nationwide</span><span aria-hidden>·</span>
            <span>35 years of curriculum</span><span aria-hidden>·</span>
            <span>MLB-trusted instruction</span><span aria-hidden>·</span>
            <span>Born to Play → College Bound</span>
          </div>
        </section>

        {/* What you get */}
        <section className="py-10">
          <p className="eyebrow text-center text-frost-400">What the license includes</p>
          <h2 className="display mt-2 text-center text-3xl font-semibold uppercase tracking-wide sm:text-4xl">One system. Soup to nuts.</h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PILLAR_CARDS.map((c, i) => (
              <div key={c.title} className="rise rounded-2xl border border-ice-600/40 bg-ice-800/70 p-5" style={{ animationDelay: `${i * 50}ms` }}>
                <c.icon size={22} className="text-frost-400" aria-hidden />
                <h3 className="display mt-3 text-lg font-semibold uppercase tracking-wide">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ice-300">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Simulator */}
        <section id="simulator" className="scroll-mt-10 py-10">
          <Simulator />
        </section>

        {/* Why owners convert */}
        <section className="py-10">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { q: '"We came from corporate America with zero industry experience. The Blueprint told us what to spend on everything — down to the bats."', a: 'Dana & Paul Whitfield, Dawsonville GA — opened 2026' },
              { q: '"Parents stay because they can finally see the development they\'re paying for. Retention went up nine points."', a: 'Stephen Abbatine, Boston MA — owner since 2016' },
              { q: '"Points my families earn here get spent in our pro shop on travel weekends in Tampa. The network is the moat."', a: 'R. Calloway, San Diego CA — owner since 2004' },
            ].map((t) => (
              <figure key={t.a} className="rounded-2xl border border-ice-600/40 bg-ice-800/70 p-5">
                <blockquote className="text-sm leading-relaxed text-ice-100">{t.q}</blockquote>
                <figcaption className="mt-3 text-xs font-medium text-frost-300/80">{t.a}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 text-center">
          <h2 className="display text-3xl font-semibold uppercase tracking-wide sm:text-4xl">Ready to see the whole field?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-ice-300">
            Request your invite and we'll open a full Frozone sandbox for your market, plus a working session with Frozen Ropes USA.
          </p>
          {sent ? (
            <p className="mt-6 inline-flex items-center gap-2 rounded-lg border border-grass-500/40 bg-grass-500/10 px-4 py-3 text-sm font-semibold text-grass-400">
              <CheckCircle2 size={16} /> Invite requested — HQ will reach out within one business day.
            </p>
          ) : (
            <form
              className="mx-auto mt-6 flex max-w-md gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
                toast('Invite request sent to Frozen Ropes USA')
              }}
            >
              <input
                type="email" required placeholder="you@example.com" aria-label="Email address"
                className="min-w-0 flex-1 rounded-md border border-ice-600/60 bg-ice-900 px-3.5 py-2 text-sm text-ice-100 placeholder:text-ice-500"
              />
              <Button type="submit">Request invite</Button>
            </form>
          )}
        </section>
      </main>

      <footer className="relative z-10 border-t border-ice-600/30 py-6 text-center text-xs text-ice-500">
        The Frozone · Frozen Ropes USA · This is a product demo — figures are illustrative.
      </footer>
    </div>
  )
}
