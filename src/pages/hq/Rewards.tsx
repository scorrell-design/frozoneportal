import { ArrowRight, Coins, Flame, Landmark, Percent, Plane } from 'lucide-react'
import { Card, CardTitle, Chip, PageHeader, StatCard } from '../../components/ui'
import { FACILITIES, REWARD_EVENTS, TIERS } from '../../data/seed'
import type { TierId } from '../../lib/types'

const AVG_PTS_PER_MEMBER = 1400
const SETTLEMENT_RATE = 0.01 // $ per point, settled monthly between facilities

const MULTIPLIER: Record<TierId, string> = { rookie: '1x', prospect: '1.5x', allstar: '2x', franchise: '3x' }

const CORRIDORS = [
  { from: 'Dawsonville, GA', to: 'Tampa, FL', points: 18400, note: 'Travel-ball spring circuit' },
  { from: 'Chester, NY', to: 'Boston, MA', points: 12950, note: 'Family footprint across both markets' },
  { from: 'Dallas, TX', to: 'Phoenix, AZ', points: 9310, note: 'Winter showcase season' },
  { from: 'Chicago, IL', to: 'Charlotte, NC', points: 6240, note: 'Relocations keep members in-network' },
]

export default function RewardsPage() {
  const totalMembers = FACILITIES.reduce((s, f) => s + f.members, 0)
  const liability = totalMembers * AVG_PTS_PER_MEMBER
  const crossRedemptions = CORRIDORS.reduce((s, c) => s + c.points, 0)

  return (
    <div>
      <PageHeader
        eyebrow="Frozen Ropes USA · Network HQ"
        title="Network Rewards"
        sub="Diamond Dollars across all 9 facilities. Members travel, points travel — the network is the moat."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Network points liability"
          value={liability}
          format={(n) => `${(n / 1_000_000).toFixed(2)}M pts`}
          icon={<Landmark size={18} aria-hidden />}
        />
        <StatCard label="Settlement value" value={liability * SETTLEMENT_RATE} format={(n) => `$${Math.round(n).toLocaleString()}`} icon={<Coins size={18} aria-hidden />} />
        <StatCard label="Redemption rate" value={38} format={(n) => `${Math.round(n)}%`} delta={4} icon={<Percent size={18} aria-hidden />} />
        <StatCard label="Cross-location pts · Q2" value={crossRedemptions} format={(n) => Math.round(n).toLocaleString()} delta={12} icon={<Plane size={18} aria-hidden />} />
      </div>
      <p className="mt-2 text-xs text-ice-400">
        Liability estimated from {totalMembers.toLocaleString()} network members × ~{AVG_PTS_PER_MEMBER.toLocaleString()} pts average outstanding balance.
      </p>

      <div className="mt-4 grid items-start gap-4 xl:grid-cols-3">
        <div className="space-y-4">
          {/* Earn config */}
          <Card className="rise border-gold-400/30">
            <CardTitle action={<Chip tone="gold" icon={<Coins size={11} aria-hidden />}>HQ-governed</Chip>}>
              Earn configuration
            </CardTitle>
            <div className="flex items-baseline gap-2">
              <span className="display tabular text-3xl font-semibold text-ice-50">1 pt</span>
              <span className="text-sm text-ice-300">per $1 spent, any facility</span>
            </div>
            <p className="eyebrow mt-4 mb-2 text-ice-400">Tier multipliers</p>
            <div className="space-y-1.5">
              {TIERS.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border border-ice-600/30 bg-ice-900/60 px-3 py-2">
                  <span className="text-sm font-medium text-ice-100">{t.name}</span>
                  <Chip tone="gold">{MULTIPLIER[t.id]}</Chip>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-ice-600/30 bg-ice-900/60 px-3 py-2.5">
              <Flame size={16} className="shrink-0 text-gold-300" aria-hidden />
              <p className="text-xs text-ice-300">
                <span className="font-semibold text-ice-100">Streak bonus:</span> 150 pts for every 10-day practice streak — quality reps pay.
              </p>
            </div>
          </Card>

          {/* Policy */}
          <Card className="rise">
            <p className="eyebrow text-frost-300">Settlement policy</p>
            <p className="mt-2 text-sm leading-relaxed text-ice-200">
              Points earned at one facility and redeemed at another settle monthly between facilities at
              ${SETTLEMENT_RATE.toFixed(2)}/pt. HQ clears the ledger; owners never chase each other.
            </p>
          </Card>
        </div>

        {/* Corridors */}
        <Card className="rise">
          <CardTitle action={<Chip tone="frost" icon={<Plane size={11} aria-hidden />}>Q2 2026</Chip>}>
            Cross-location corridors
          </CardTitle>
          <p className="-mt-2 mb-3 text-xs text-ice-400">Where points are flowing between facilities this quarter.</p>
          <div className="space-y-2">
            {CORRIDORS.map((c) => (
              <div key={`${c.from}-${c.to}`} className="rounded-lg border border-ice-600/30 bg-ice-900/60 p-3 transition-colors hover:border-frost-400/30">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-ice-100">
                    <span className="truncate">{c.from}</span>
                    <ArrowRight size={13} className="shrink-0 text-frost-400" aria-hidden />
                    <span className="truncate">{c.to}</span>
                  </span>
                  <span className="tabular shrink-0 text-sm font-semibold text-gold-300">{c.points.toLocaleString()} pts</span>
                </div>
                <p className="mt-1 text-[11px] text-ice-400">{c.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 border-t border-ice-700/60 pt-3 text-xs leading-relaxed text-ice-400">
            A Dawsonville family redeeming at the Tampa Pro Shop on a tournament weekend is the network
            working as designed — members travel, points travel.
          </p>
        </Card>

        {/* Activity */}
        <Card className="rise">
          <CardTitle>Recent activity</CardTitle>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[360px] text-left text-sm">
              <thead>
                <tr className="border-b border-ice-600/40 text-[11px] uppercase tracking-wider text-ice-400">
                  <th className="py-2 pr-3 font-semibold">Date</th>
                  <th className="py-2 pr-3 font-semibold">Facility</th>
                  <th className="py-2 pr-3 font-semibold">Event</th>
                  <th className="py-2 text-right font-semibold">Points</th>
                </tr>
              </thead>
              <tbody>
                {REWARD_EVENTS.map((e) => (
                  <tr key={e.id} className="border-b border-ice-700/40 transition-colors last:border-0 hover:bg-ice-700/30">
                    <td className="tabular py-2.5 pr-3 text-ice-400">{e.date}</td>
                    <td className="py-2.5 pr-3 text-ice-300">{e.facility}</td>
                    <td className="max-w-[180px] truncate py-2.5 pr-3 text-ice-100" title={e.description}>{e.description}</td>
                    <td className={`tabular py-2.5 text-right font-semibold ${e.points >= 0 ? 'text-grass-400' : 'text-gold-300'}`}>
                      {e.points >= 0 ? '+' : ''}{e.points.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 border-t border-ice-700/60 pt-3 text-xs text-ice-400">
            Whitman family feed shown — the Tampa line is a cross-location earn from a travel weekend.
          </p>
        </Card>
      </div>
    </div>
  )
}
