import { useState } from 'react'
import { ShoppingCart, Star, Wallet } from 'lucide-react'
import { Button, Card, DemoTag, PageHeader, Tabs, toast } from '../../components/ui'
import { PRODUCTS, WHITMAN } from '../../data/seed'
import type { Product } from '../../lib/types'

const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const CATEGORY_TABS = [
  { id: 'pro-shop', label: 'Pro Shop' },
  { id: 'concessions', label: 'Concessions' },
  { id: 'cage-time', label: 'Cage Time' },
]

export default function ShopPage() {
  const [tab, setTab] = useState('pro-shop')
  const [points, setPoints] = useState(WHITMAN.rewardPoints)
  const [cart, setCart] = useState<Record<string, number>>({})

  const visible = PRODUCTS.filter((p) => p.category === tab)
  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0)
  const cartTotal = Object.entries(cart).reduce((s, [id, q]) => s + (PRODUCTS.find((p) => p.id === id)?.price ?? 0) * q, 0)

  const buy = (p: Product) => {
    setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }))
    toast(`${p.name} added to cart`)
  }

  const redeem = (p: Product) => {
    setPoints((pts) => pts - p.points)
    toast(`Redeemed ${p.name} for ${p.points.toLocaleString()} points — pickup at the front desk.`)
  }

  const checkout = () => {
    setCart({})
    toast('Order placed — pickup at the Dawsonville front desk.')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Parent portal · Whitman family"
        title="Pro Shop"
        sub="Gear, snacks, and cage time — pay with your stored balance or redeem reward points."
      />

      {/* Wallet strip */}
      <Card className="rise mb-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="flex items-center gap-2">
            <Wallet size={17} className="text-frost-400" aria-hidden />
            <span className="text-sm text-ice-300">Stored balance</span>
            <span className="tabular text-base font-bold text-ice-50">{money(WHITMAN.storedBalance)}</span>
          </span>
          <span className="flex items-center gap-2">
            <Star size={17} className="text-gold-400" aria-hidden />
            <span className="text-sm text-ice-300">Reward points</span>
            <span className="tabular text-base font-bold text-gold-300">{points.toLocaleString()}</span>
          </span>
          <span className="text-xs text-ice-400 sm:ml-auto">Points work at every Frozen Ropes location — earn in Dawsonville, spend in Tampa.</span>
        </div>
      </Card>

      <Tabs tabs={CATEGORY_TABS} active={tab} onChange={setTab} />

      {/* Product grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((p) => {
          const canRedeem = points >= p.points
          return (
            <Card key={p.id} className="rise flex flex-col transition-colors hover:border-frost-400/40">
              <div
                aria-hidden
                className="h-20 rounded-lg"
                style={{ background: `linear-gradient(135deg, hsl(${p.hue} 50% 90%), hsl(${p.hue} 45% 80%))`, border: `1px solid hsl(${p.hue} 35% 68%)` }}
              />
              <p className="mt-3 flex-1 text-sm font-semibold text-ice-100">{p.name}</p>
              <div className="mt-1.5 flex items-baseline justify-between gap-2">
                <span className="tabular text-lg font-bold text-ice-50">{money(p.price)}</span>
                <span className="tabular text-xs font-semibold text-gold-300">{p.points.toLocaleString()} pts</span>
              </div>
              <p className={`mt-0.5 text-[11px] ${p.stock < 10 ? 'text-clay-300' : 'text-ice-400'}`}>
                {p.stock >= 999 ? 'Always available' : p.stock < 10 ? `Only ${p.stock} left` : `${p.stock} in stock`}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button onClick={() => buy(p)}>Buy</Button>
                <span
                  title={canRedeem ? undefined : `Needs ${p.points.toLocaleString()} points — you have ${points.toLocaleString()}`}
                  className="inline-flex"
                >
                  <Button variant="gold" disabled={!canRedeem} onClick={() => redeem(p)} className="w-full">Redeem</Button>
                </span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Mini cart */}
      {cartCount > 0 && (
        <div className="sticky bottom-4 z-30 mt-4">
          <Card className="rise border-frost-400/40 shadow-sm">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <ShoppingCart size={17} className="text-frost-400" aria-hidden />
              <span className="text-sm font-semibold text-ice-100">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} in cart
              </span>
              <span className="tabular text-base font-bold text-ice-50">{money(cartTotal)}</span>
              <DemoTag>Demo checkout</DemoTag>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" onClick={() => setCart({})}>Clear</Button>
                <Button onClick={checkout}>Checkout</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
