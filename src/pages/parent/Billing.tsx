import { useState } from 'react'
import { Check, CreditCard, RefreshCcw, Star, Wallet } from 'lucide-react'
import { Button, Card, CardTitle, Chip, DemoTag, Modal, PageHeader, StatCard, toast } from '../../components/ui'
import { INVOICES, REWARD_EVENTS, TIERS, WHITMAN, tierById } from '../../data/seed'

const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function BillingPage() {
  const [balance, setBalance] = useState(WHITMAN.storedBalance)
  const [compareOpen, setCompareOpen] = useState(false)

  const current = tierById(WHITMAN.tier)!
  const ytdSpend = INVOICES.reduce((s, i) => s + i.amount, 0)
  const pointsYtd = REWARD_EVENTS.filter((e) => e.points > 0).reduce((s, e) => s + e.points, 0)

  const addFunds = (amt: number) => {
    setBalance((b) => b + amt)
    toast(`$${amt} added — new balance ${money(balance + amt)}`)
  }

  const switchPlan = (name: string) => {
    setCompareOpen(false)
    toast(`Switch to ${name} requested — takes effect at your next billing date.`)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Parent portal · Whitman family"
        title="Billing & membership"
        sub="One membership, one balance, one honest bill. No surprise fees, ever."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard
          label="Spend this year"
          value={ytdSpend}
          format={(n) => money(n)}
          icon={<CreditCard size={17} aria-hidden />}
        />
        <StatCard
          label="Points earned this year"
          value={pointsYtd}
          format={(n) => Math.round(n).toLocaleString()}
          icon={<Star size={17} aria-hidden />}
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {/* Membership */}
        <Card className="rise">
          <CardTitle action={<Chip tone="frost">{current.name}</Chip>}>Membership</CardTitle>
          <p className="display tabular text-3xl font-semibold text-ice-50">
            ${current.price}<span className="text-base text-ice-400"> / mo</span>
          </p>
          <ul className="mt-3 space-y-1.5">
            {current.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-ice-200">
                <Check size={15} className="mt-0.5 shrink-0 text-grass-400" aria-hidden /> {b}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-3">
            <Button variant="ghost" onClick={() => setCompareOpen(true)}>Compare plans</Button>
            <span className="text-xs text-ice-400">Member since {WHITMAN.joined} · paid Jun 1</span>
          </div>
        </Card>

        {/* Stored balance */}
        <Card className="rise">
          <CardTitle action={<DemoTag>Mock Stripe</DemoTag>}>Stored balance</CardTitle>
          <div className="flex items-center gap-3">
            <Wallet size={22} className="text-frost-400" aria-hidden />
            <p className="display tabular text-3xl font-semibold text-ice-50">{money(balance)}</p>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-ice-300">
            <RefreshCcw size={13} className="text-grass-400" aria-hidden />
            Auto-reload: adds $50 when the balance drops below $25 — <span className="font-semibold text-grass-400">on</span>
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ice-400">
            The balance covers lessons, cage time, Pro Shop, and concessions — Tyler never needs to carry cash.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="eyebrow text-ice-400">Add funds</span>
            {[25, 50, 100].map((amt) => (
              <Button key={amt} variant="ghost" onClick={() => addFunds(amt)}>${amt}</Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Invoices */}
      <Card className="rise mt-3" pad={false}>
        <div className="p-4 pb-0 sm:p-5 sm:pb-0">
          <CardTitle action={<span className="tabular text-xs text-ice-400">{INVOICES.length} invoices · 2026</span>}>Invoices</CardTitle>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ice-600/30 text-left">
              <th scope="col" className="eyebrow px-4 py-2 font-semibold text-ice-400 sm:px-5">Date</th>
              <th scope="col" className="eyebrow px-4 py-2 font-semibold text-ice-400 sm:px-5">Description</th>
              <th scope="col" className="eyebrow px-4 py-2 text-right font-semibold text-ice-400 sm:px-5">Amount</th>
              <th scope="col" className="eyebrow px-4 py-2 text-right font-semibold text-ice-400 sm:px-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ice-600/20">
            {INVOICES.map((inv) => (
              <tr key={inv.id} className="transition-colors hover:bg-ice-700/30">
                <td className="tabular whitespace-nowrap px-4 py-2.5 text-ice-300 sm:px-5">{inv.date}</td>
                <td className="px-4 py-2.5 text-ice-100 sm:px-5">{inv.description}</td>
                <td className="tabular px-4 py-2.5 text-right font-semibold text-ice-50 sm:px-5">{money(inv.amount)}</td>
                <td className="px-4 py-2.5 text-right sm:px-5">
                  <Chip tone={inv.status === 'paid' ? 'grass' : 'clay'}>{inv.status === 'paid' ? 'Paid' : inv.status}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Compare plans */}
      <Modal open={compareOpen} onClose={() => setCompareOpen(false)} title="Compare plans" wide>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TIERS.map((t) => {
            const isCurrent = t.id === WHITMAN.tier
            return (
              <div
                key={t.id}
                className={`flex flex-col rounded-lg border p-3 ${isCurrent ? 'border-frost-400/50 bg-frost-400/5' : 'border-ice-600/40 bg-ice-900/60'}`}
              >
                <p className="display text-sm font-semibold text-ice-50">{t.name}</p>
                <p className="display tabular mt-1 text-xl font-semibold text-ice-50">
                  ${t.price}<span className="text-xs text-ice-400">/mo</span>
                </p>
                <ul className="mt-2 flex-1 space-y-1">
                  {t.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-1.5 text-[11px] leading-snug text-ice-300">
                      <Check size={11} className="mt-0.5 shrink-0 text-grass-400" aria-hidden /> {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-3">
                  {isCurrent ? (
                    <Button variant="ghost" disabled className="w-full">Current plan</Button>
                  ) : (
                    <Button variant={t.price > 149 ? 'primary' : 'ghost'} onClick={() => switchPlan(t.name)} className="w-full">Switch</Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-ice-400">Plan changes are prorated and take effect at the next billing date. No contracts, no cancellation fees.</p>
      </Modal>
    </div>
  )
}
