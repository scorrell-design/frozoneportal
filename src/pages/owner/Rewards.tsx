import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Coins, Globe, Plane, Star, TrendingUp } from 'lucide-react'
import { Card, CardTitle, Chip, PageHeader, useCountUp } from '../../components/ui'
import { FAMILIES, REWARD_EVENTS, TIERS } from '../../data/seed'
import type { TierId } from '../../lib/types'

const MULTIPLIERS: Record<TierId, string> = {
  rookie: '1×',
  prospect: '1.5×',
  allstar: '2×',
  franchise: '3×',
}

const HOME_FACILITY_NAME = 'Dawsonville, GA'

function RewardStat({ label, value, format, sub, icon }: {
  label: string
  value: number
  format: (n: number) => string
  sub: string
  icon: ReactNode
}) {
  const v = useCountUp(value)
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <p className="eyebrow text-ice-400">{label}</p>
        <span className="text-gold-400">{icon}</span>
      </div>
      <p className="display tabular mt-2 text-4xl font-semibold text-ice-50">{format(v)}</p>
      <p className="mt-1 text-xs text-ice-400">{sub}</p>
    </Card>
  )
}

export default function RewardsPage() {
  const liabilityPts = FAMILIES.reduce((s, f) => s + f.rewardPoints, 0)
  const liabilityUsd = liabilityPts * 0.01
  const redeemedPts = REWARD_EVENTS.filter((e) => e.points < 0).reduce((s, e) => s + Math.abs(e.points), 0)
  const redemptionCount = REWARD_EVENTS.filter((e) => e.points < 0).length

  return (
    <div>
      <PageHeader
        eyebrow="Diamond Dollars · network loyalty"
        title="Rewards admin"
        sub="One points balance per family, earned anywhere in the Frozen Ropes network, redeemed at any Pro Shop."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rise">
          <RewardStat
            label="Outstanding points liability"
            value={liabilityPts}
            format={(n) => `${Math.round(n).toLocaleString()} pts`}
            sub={`≈ $${liabilityUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} at 1 pt = $0.01`}
            icon={<Coins size={18} aria-hidden />}
          />
        </div>
        <div className="rise" style={{ animationDelay: '50ms' }}>
          <RewardStat
            label="Earn rate"
            value={1}
            format={() => '1 pt / $1'}
            sub="× tier multiplier — 1× Rookie through 3× Franchise"
            icon={<TrendingUp size={18} aria-hidden />}
          />
        </div>
        <div className="rise" style={{ animationDelay: '100ms' }}>
          <RewardStat
            label="Redemptions this month"
            value={redeemedPts}
            format={(n) => `${Math.round(n).toLocaleString()} pts`}
            sub={`${redemptionCount} redemption${redemptionCount === 1 ? '' : 's'} across the Whitman demo account`}
            icon={<Star size={18} aria-hidden />}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        {/* Earn rates by tier */}
        <Card className="rise" >
          <CardTitle>Earn rates by tier</CardTitle>
          <div className="divide-y divide-ice-600/20">
            {TIERS.map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-2.5">
                <Chip tone={t.color}>{t.name}</Chip>
                <div className="min-w-0 flex-1">
                  <p className="tabular text-xs text-ice-400">${t.price}/mo · {t.members} members</p>
                </div>
                <span className="display tabular text-xl font-bold text-gold-300">{MULTIPLIERS[t.id]}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ice-400">
            Every membership dollar, lesson, camp, and register sale earns points at the family's tier multiplier — automatically.
          </p>
        </Card>

        {/* Activity log */}
        <Card className="rise xl:col-span-2" pad={false} >
          <div className="px-4 pt-4 sm:px-5 sm:pt-5">
            <CardTitle action={<span className="text-xs text-ice-400">Whitman family · last 45 days</span>}>
              Earn & redemption log
            </CardTitle>
          </div>
          <div className="divide-y divide-ice-600/20">
            {REWARD_EVENTS.map((e) => {
              const crossLocation = e.facility !== HOME_FACILITY_NAME
              const isRedeem = e.points < 0
              return (
                <div key={e.id} className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
                  <span className="tabular w-14 shrink-0 text-xs text-ice-400">{e.date}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ice-100">{e.description}</p>
                    <p className="text-[11px] text-ice-400">{e.facility}</p>
                  </div>
                  {crossLocation && (
                    <Chip tone="frost" icon={<Plane size={11} aria-hidden />}>Cross-location</Chip>
                  )}
                  <span className={`tabular w-20 shrink-0 text-right text-sm font-bold ${isRedeem ? 'text-clay-300' : 'text-grass-400'}`}>
                    {isRedeem ? '−' : '+'}{Math.abs(e.points).toLocaleString()}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Explainer */}
      <Card className="rise mt-4" >
        <div className="flex flex-wrap items-start gap-4">
          <span className="rounded-lg border border-gold-400/30 bg-gold-400/10 p-2.5 text-gold-300">
            <Globe size={22} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="display text-lg font-semibold text-ice-100">One network, one wallet</h2>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-ice-300">
              Diamond Dollars travel with the family, not the facility. Points earned at Dawsonville spend at any Pro Shop
              in the network — and when the Whitmans buy gloves in Tampa on a travel-ball weekend, those points land right
              back in their one balance here. It's the retention loop only a network can offer.
            </p>
            <Link to="/owner/pos" className="mt-2 inline-block text-xs font-semibold text-frost-300 hover:text-frost-200">
              Redeem points at the register →
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
