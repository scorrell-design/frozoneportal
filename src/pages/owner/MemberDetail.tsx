import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CalendarDays, Phone, Plus, Receipt, Star, Wallet } from 'lucide-react'
import {
  Avatar, Breadcrumbs, Button, Card, CardTitle, Chip, EmptyState, PageHeader,
  RockReadyRing, toast,
} from '../../components/ui'
import { PercentileRow, Sparkline } from '../../components/charts'
import { INVOICES, familyById, playerById, tierById } from '../../data/seed'
import type { Family, Invoice, Player, Tier } from '../../lib/types'

const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const STATUS_META: Record<Family['status'], { label: string; tone: 'grass' | 'clay' | 'ice' }> = {
  active: { label: 'Active', tone: 'grass' },
  past_due: { label: 'Past due', tone: 'clay' },
  paused: { label: 'Paused', tone: 'ice' },
}

const INVOICE_TONE: Record<Invoice['status'], { label: string; tone: 'grass' | 'clay' | 'gold' }> = {
  paid: { label: 'Paid', tone: 'grass' },
  due: { label: 'Due', tone: 'gold' },
  failed: { label: 'Failed', tone: 'clay' },
}

function invoicesFor(fam: Family, tier: Tier | undefined): Invoice[] {
  const real = INVOICES.filter((inv) => inv.familyId === fam.id)
  if (real.length > 0) return real
  const price = tier?.price ?? 0
  const name = tier?.name ?? 'Membership'
  return [
    { id: `inv-${fam.id}-jun`, familyId: fam.id, date: 'Jun 1', description: `${name} membership — June`, amount: price, status: fam.status === 'past_due' ? 'due' : 'paid' },
    { id: `inv-${fam.id}-may`, familyId: fam.id, date: 'May 1', description: `${name} membership — May`, amount: price, status: 'paid' },
    { id: `inv-${fam.id}-apr`, familyId: fam.id, date: 'Apr 1', description: `${name} membership — April`, amount: price, status: 'paid' },
  ]
}

function PlayerCard({ player }: { player: Player }) {
  const topIndexes = [...player.indexes].sort((a, b) => b.score - a.score).slice(0, 3)
  return (
    <Card className="rise">
      <div className="flex items-center gap-3">
        <Avatar name={player.name} hue={player.hue} size={40} />
        <div className="min-w-0 flex-1">
          <p className="display truncate text-lg font-semibold uppercase tracking-wide text-ice-50">{player.name}</p>
          <p className="text-xs text-ice-400">#{player.jersey} · {player.ageGroup} · {player.position} · {player.program}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-5">
        <RockReadyRing score={player.composite} size={112} />
        <div className="min-w-0 flex-1" style={{ minWidth: 200 }}>
          {topIndexes.map((ix) => (
            <PercentileRow key={ix.key} label={ix.label} score={ix.score} grade={ix.grade} />
          ))}
          <div className="mt-2 flex items-center gap-2">
            <Sparkline data={player.compositeTrend} />
            <span className="text-xs text-ice-400">Composite, last 8 evals</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

function MemberDetail({ fam }: { fam: Family }) {
  const [balance, setBalance] = useState(fam.storedBalance)
  const tier = tierById(fam.tier)
  const players = fam.playerIds.map((id) => playerById(id)).filter((p) => p !== undefined)
  const status = STATUS_META[fam.status]
  const invoices = invoicesFor(fam, tier)

  const addFunds = () => {
    setBalance((b) => b + 50)
    toast(`Added $50.00 — stored balance is now ${money(balance + 50)}`)
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Members', to: '/owner/members' }, { label: fam.parentName }]} />
      <PageHeader
        eyebrow={`${tier?.name ?? 'Member'} · member since ${fam.joined}`}
        title={fam.parentName}
        sub={`${players.map((p) => p.name).join(', ')} — full family account: development, billing, balance, and rewards.`}
      />

      <div className="grid gap-3 lg:grid-cols-3">
        {/* Family profile */}
        <Card className="rise">
          <CardTitle action={<Chip tone={status.tone}>{status.label}</Chip>}>Family profile</CardTitle>
          <div className="flex items-center gap-3">
            <Avatar name={fam.parentName} hue={players[0]?.hue ?? 205} size={44} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ice-100">{fam.parentName}</p>
              <p className="flex items-center gap-1.5 text-xs text-ice-400"><Phone size={12} aria-hidden />{fam.phone}</p>
              <p className="flex items-center gap-1.5 text-xs text-ice-400"><CalendarDays size={12} aria-hidden />Joined {fam.joined}</p>
            </div>
          </div>
          <p className="eyebrow mt-4 mb-1.5 text-ice-400">{tier?.name} — {money(tier?.price ?? 0)}/mo</p>
          <ul className="space-y-1">
            {tier?.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-xs text-ice-200">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-frost-400" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
        </Card>

        {/* Stored balance */}
        <Card className="rise" >
          <CardTitle action={<Wallet size={17} className="text-frost-400" aria-hidden />}>Stored balance</CardTitle>
          <p className="display tabular text-4xl font-semibold text-ice-50">{money(balance)}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ice-400">
            Spends at the register, the Pro Shop, and cage rentals. Stored-balance families renew at 94%.
          </p>
          <div className="mt-4">
            <Button onClick={addFunds}><Plus size={15} aria-hidden /> Add funds ($50)</Button>
          </div>
        </Card>

        {/* Reward points */}
        <Card className="rise" >
          <CardTitle action={<Star size={17} className="text-gold-400" aria-hidden />}>Diamond Dollars</CardTitle>
          <p className="display tabular text-4xl font-semibold text-gold-300">{fam.rewardPoints.toLocaleString()}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ice-400">
            ≈ {money(fam.rewardPoints * 0.01)} of Pro Shop credit · earning at the {tier?.name} multiplier.
          </p>
          <Link to="/owner/rewards" className="mt-4 inline-block text-xs font-semibold text-frost-300 hover:text-frost-200">
            Rewards admin →
          </Link>
        </Card>
      </div>

      {/* Players */}
      <h2 className="display mt-6 mb-3 text-lg font-semibold uppercase tracking-wide text-ice-100">
        Rock Ready — {players.length === 1 ? 'player' : 'players'}
      </h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {players.map((p) => <PlayerCard key={p.id} player={p} />)}
      </div>

      {/* Billing history */}
      <Card className="rise mt-6" pad={false}>
        <div className="flex items-center justify-between px-4 pt-4 sm:px-5 sm:pt-5">
          <CardTitle action={<Receipt size={17} className="text-frost-400" aria-hidden />}>Billing history</CardTitle>
        </div>
        <div className="divide-y divide-ice-600/20">
          {invoices.map((inv) => {
            const meta = INVOICE_TONE[inv.status]
            return (
              <div key={inv.id} className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ice-100">{inv.description}</p>
                  <p className="text-xs text-ice-400">{inv.date} · {inv.id}</p>
                </div>
                <Chip tone={meta.tone}>{meta.label}</Chip>
                <span className="tabular w-20 shrink-0 text-right text-sm font-semibold text-ice-50">{money(inv.amount)}</span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>()
  const fam = id ? familyById(id) : undefined

  if (!fam) {
    return (
      <div>
        <Breadcrumbs items={[{ label: 'Members', to: '/owner/members' }, { label: 'Not found' }]} />
        <PageHeader eyebrow="Member directory" title="Member not found" sub="That family isn't in the Dawsonville book." />
        <EmptyState
          title="No family with that ID"
          hint="The link may be stale — head back to the directory and search by name."
          action={
            <Link to="/owner/members">
              <Button variant="ghost">Back to members</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return <MemberDetail key={fam.id} fam={fam} />
}
