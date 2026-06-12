import { useState } from 'react'
import { Check, DollarSign, Landmark, Sparkles, Users } from 'lucide-react'
import { Button, Card, CardTitle, Chip, Modal, PageHeader, StatCard, toast } from '../../components/ui'
import { TIERS } from '../../data/seed'
import type { TierId } from '../../lib/types'

const MULTIPLIER: Record<TierId, string> = { rookie: '1x', prospect: '1.5x', allstar: '2x', franchise: '3x' }

const ACCENT: Record<string, { bar: string; text: string; chip: 'ice' | 'frost' | 'gold' | 'clay' }> = {
  ice: { bar: 'bg-ice-500', text: 'text-ice-200', chip: 'ice' },
  frost: { bar: 'bg-frost-400', text: 'text-frost-300', chip: 'frost' },
  gold: { bar: 'bg-gold-400', text: 'text-gold-300', chip: 'gold' },
  clay: { bar: 'bg-clay-400', text: 'text-clay-300', chip: 'clay' },
}

export default function MatrixPage() {
  const [prices, setPrices] = useState<Record<TierId, number>>(
    () => Object.fromEntries(TIERS.map((t) => [t.id, t.price])) as Record<TierId, number>,
  )
  const [editing, setEditing] = useState<TierId | null>(null)
  const [draftPrice, setDraftPrice] = useState('')

  const editingTier = TIERS.find((t) => t.id === editing)
  const totalMembers = TIERS.reduce((s, t) => s + t.members, 0)
  const cohortMrr = TIERS.reduce((s, t) => s + prices[t.id] * t.members, 0)
  const networkMrr = cohortMrr * 9
  const avgPrice = cohortMrr / totalMembers

  const openEditor = (id: TierId) => {
    setEditing(id)
    setDraftPrice(String(prices[id]))
  }

  const savePrice = () => {
    if (!editingTier) return
    const next = Number(draftPrice)
    if (!Number.isFinite(next) || next <= 0) {
      toast('Enter a valid monthly price')
      return
    }
    setPrices((p) => ({ ...p, [editingTier.id]: next }))
    setEditing(null)
    toast(`${editingTier.name} adjusted to $${next}/mo — facilities inherit on the 1st`)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Frozen Ropes USA · Network HQ"
        title="Membership Matrix"
        sub="Four tiers, one ladder — Rookie to Franchise. HQ sets the matrix; every facility in the network runs it."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Members on the matrix" value={totalMembers} format={(n) => String(Math.round(n))} icon={<Users size={18} aria-hidden />} />
        <StatCard label="Cohort MRR" value={cohortMrr} format={(n) => `$${Math.round(n).toLocaleString()}`} icon={<DollarSign size={18} aria-hidden />} />
        <StatCard label="Network MRR impact" value={networkMrr} format={(n) => `$${Math.round(n).toLocaleString()}`} icon={<Landmark size={18} aria-hidden />} />
        <StatCard label="Avg price per member" value={avgPrice} format={(n) => `$${Math.round(n)}/mo`} icon={<Sparkles size={18} aria-hidden />} />
      </div>
      <p className="mt-2 text-xs text-ice-400">
        MRR computed live from the Dawsonville cohort ({totalMembers} matrix members); network extrapolation ×9 facilities. Adjust a price below and watch it recompute.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {TIERS.map((t, i) => {
          const a = ACCENT[t.color] ?? ACCENT.ice
          return (
            <div key={t.id} className="rise" style={{ animationDelay: `${i * 60}ms` }}>
              <Card pad={false} className="flex h-full flex-col overflow-hidden transition-colors hover:border-frost-400/40">
                <div className={`h-1 w-full ${a.bar}`} aria-hidden />
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="flex items-start justify-between">
                    <h2 className={`display text-xl font-semibold uppercase tracking-wide ${a.text}`}>{t.name}</h2>
                    <Chip tone={a.chip}>{MULTIPLIER[t.id]} rewards</Chip>
                  </div>
                  <p className="display tabular mt-2 text-4xl font-semibold text-ice-50">
                    ${prices[t.id]}<span className="text-lg text-ice-400">/mo</span>
                  </p>
                  <p className="tabular mt-1 text-xs font-medium text-ice-400">{t.members} members · Dawsonville cohort</p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {t.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-ice-200">
                        <Check size={14} className={`mt-0.5 shrink-0 ${a.text}`} aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Button variant="ghost" className="mt-4 w-full" onClick={() => openEditor(t.id)}>
                    Adjust price
                  </Button>
                </div>
              </Card>
            </div>
          )
        })}
      </div>

      <div className="mt-4 grid items-start gap-4 xl:grid-cols-3">
        <Card className="rise xl:col-span-2">
          <CardTitle>Member distribution</CardTitle>
          <p className="-mt-2 mb-3 text-xs text-ice-400">Where the Dawsonville cohort sits on the ladder.</p>
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-ice-700" role="img" aria-label="Member distribution across tiers">
            {TIERS.map((t) => (
              <div
                key={t.id}
                className={(ACCENT[t.color] ?? ACCENT.ice).bar}
                style={{ width: `${(t.members / totalMembers) * 100}%` }}
                title={`${t.name}: ${t.members} members`}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {TIERS.map((t) => {
              const a = ACCENT[t.color] ?? ACCENT.ice
              return (
                <span key={t.id} className="flex items-center gap-1.5 text-xs text-ice-300">
                  <span className={`inline-block h-2.5 w-2.5 rounded-sm ${a.bar}`} aria-hidden />
                  {t.name} <span className="tabular font-semibold text-ice-100">{t.members}</span>
                  <span className="tabular text-ice-500">({Math.round((t.members / totalMembers) * 100)}%)</span>
                </span>
              )
            })}
          </div>
        </Card>

        <Card className="rise border-frost-400/30">
          <p className="eyebrow text-frost-300">Governance</p>
          <p className="mt-2 text-sm leading-relaxed text-ice-200">
            The Matrix is HQ-governed — facilities inherit changes on the 1st. Price moves publish to every
            facility's billing engine and member-facing plan pages automatically; no local overrides.
          </p>
          <p className="mt-3 border-t border-ice-700/60 pt-3 text-xs leading-relaxed text-ice-400">
            Rewards multipliers ride the same ladder: a Franchise family earns Diamond Dollars at 3x on every
            dollar spent, anywhere in the network.
          </p>
        </Card>
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={`Adjust price — ${editingTier?.name ?? ''}`}>
        <div className="space-y-4">
          <label className="block">
            <span className="eyebrow mb-1.5 block text-ice-400">Monthly price (USD)</span>
            <input
              type="number"
              min={1}
              value={draftPrice}
              onChange={(e) => setDraftPrice(e.target.value)}
              className="tabular w-full rounded-md border border-ice-600/60 bg-ice-900 px-3 py-2 text-sm text-ice-100"
            />
          </label>
          {editingTier && (
            <p className="text-xs leading-relaxed text-ice-400">
              {editingTier.members} cohort members on {editingTier.name} · current ${prices[editingTier.id]}/mo.
              Network MRR recomputes live when you save.
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={savePrice}>Save price</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
