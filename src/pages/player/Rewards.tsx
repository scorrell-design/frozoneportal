import { useState } from 'react'
import { Flame, Gem, MapPin, ShoppingBag } from 'lucide-react'
import { Button, Card, CardTitle, Chip, PageHeader, toast, useCountUp } from '../../components/ui'
import { PRODUCTS, REWARD_EVENTS, WHITMAN } from '../../data/seed'
import type { RewardEvent } from '../../lib/types'

const SHOP_IDS = ['pr-7', 'pr-9', 'pr-6', 'pr-1']

export default function PlayerRewards() {
  const [balance, setBalance] = useState(WHITMAN.rewardPoints)
  const [events, setEvents] = useState<RewardEvent[]>(REWARD_EVENTS)
  const animated = useCountUp(balance, 1100)

  const shopItems = PRODUCTS.filter((p) => SHOP_IDS.includes(p.id))
  const streakBonus = events.find((e) => e.id === 'rw-6')

  const redeem = (name: string, points: number) => {
    setBalance((b) => b - points)
    setEvents((xs) => [
      { id: `rw-local-${Date.now()}`, date: 'Jun 12', facility: 'Dawsonville, GA', description: `Redeemed: ${name}`, points: -points },
      ...xs,
    ])
    toast('Redeemed — pick it up at the front desk.')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Player portal · My rewards"
        title="Diamond Dollars"
        sub="Earned every time the Whitmans spend at any Frozen Ropes — and every time you keep your streak alive."
      />

      {/* Gold hero */}
      <Card className="rise relative overflow-hidden border-gold-400/40">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, var(--color-gold-400), transparent 70%)' }}
          aria-hidden
        />
        <div className="flex flex-wrap items-center gap-6">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-gold-400/40 bg-gold-400/10 text-gold-300">
            <Gem size={28} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="eyebrow text-gold-300">Your balance</p>
            <p className="display tabular mt-1 text-5xl font-bold text-ice-50 sm:text-6xl">
              {Math.round(animated).toLocaleString()}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <Chip tone="gold">Prospect tier · 1.5x earn rate</Chip>
              <Chip tone="frost" icon={<MapPin size={11} aria-hidden />}>Good at every Frozen Ropes</Chip>
            </div>
          </div>
        </div>
      </Card>

      {/* Streak bonus callout */}
      {streakBonus && (
        <div className="rise mt-3 flex items-start gap-3 rounded-[10px] border border-gold-400/40 bg-gold-400/10 p-3.5">
          <Flame size={18} className="mt-0.5 shrink-0 text-gold-300" aria-hidden />
          <p className="text-sm leading-relaxed text-ice-100">
            <span className="font-semibold text-gold-300">Streak pays.</span> Your {streakBonus.description.toLowerCase()} earned{' '}
            <span className="tabular font-bold text-gold-300">+{streakBonus.points}</span> — Diamond Dollars
            reward showing up, not just spending. Keep the streak going and the next bonus is bigger.
          </p>
        </div>
      )}

      <div className="mt-3 grid gap-3 lg:grid-cols-5">
        {/* Earn history */}
        <Card className="rise lg:col-span-3" pad={false}>
          <div className="p-4 pb-2 sm:p-5 sm:pb-2">
            <CardTitle action={<span className="text-xs text-ice-400">Whitman family</span>}>Earn history</CardTitle>
          </div>
          <div className="divide-y divide-ice-600/30">
            {events.map((e) => {
              const earn = e.points >= 0
              const tampa = e.facility.startsWith('Tampa')
              return (
                <div key={e.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-ice-700/30 sm:px-5">
                  <span className="tabular w-14 shrink-0 text-xs text-ice-400">{e.date}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ice-100">{e.description}</p>
                    {tampa && (
                      <span className="mt-1 inline-block">
                        <Chip tone="frost" icon={<MapPin size={11} aria-hidden />}>Earned in Tampa</Chip>
                      </span>
                    )}
                  </div>
                  <span className={`tabular shrink-0 text-sm font-bold ${earn ? 'text-grass-400' : 'text-clay-300'}`}>
                    {earn ? '+' : ''}{e.points.toLocaleString()}
                  </span>
                </div>
              )
            })}
          </div>
          <p className="px-4 py-3 text-xs text-ice-500 sm:px-5">
            Points work at every Frozen Ropes in the country — travel weekend in Tampa included.
          </p>
        </Card>

        {/* Redeem */}
        <Card className="rise lg:col-span-2">
          <CardTitle action={<ShoppingBag size={16} className="text-gold-300" aria-hidden />}>Redeem in the Pro Shop</CardTitle>
          <div className="space-y-2.5">
            {shopItems.map((p) => {
              const affordable = balance >= p.points
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 rounded-[10px] border p-3 transition-colors ${
                    affordable ? 'border-ice-600/40 bg-ice-850 hover:border-gold-400/50' : 'border-ice-600/30 bg-ice-900 opacity-70'
                  }`}
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `linear-gradient(135deg, hsl(${p.hue} 55% 26%), hsl(${p.hue} 60% 14%))` }}
                    aria-hidden
                  >
                    <ShoppingBag size={16} style={{ color: `hsl(${p.hue} 80% 78%)` }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ice-100">{p.name}</p>
                    <p className="tabular mt-0.5 text-xs text-gold-300">{p.points.toLocaleString()} pts</p>
                    {!affordable && (
                      <p className="tabular mt-0.5 text-[11px] text-ice-500">
                        {(p.points - balance).toLocaleString()} more to go
                      </p>
                    )}
                  </div>
                  <Button
                    variant="gold"
                    disabled={!affordable}
                    onClick={() => redeem(p.name, p.points)}
                  >
                    Redeem
                  </Button>
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ice-500">
            The Grip Trainer Kit pairs with your rice bucket homework — two more lesson months and it's yours.
          </p>
        </Card>
      </div>
    </div>
  )
}
