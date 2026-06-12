import { useMemo, useState } from 'react'
import { Banknote, Coins, CreditCard, Minus, Plus, Receipt, ShoppingCart, Trash2, TrendingUp, Wallet } from 'lucide-react'
import { Button, Card, CardTitle, Chip, PageHeader, StatCard, Tabs, toast } from '../../components/ui'
import { PRODUCTS, SALES, productById } from '../../data/seed'
import type { Product, Sale } from '../../lib/types'

const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const TAX_RATE = 0.07

const TENDERS: { key: Sale['tender']; label: string; icon: typeof CreditCard }[] = [
  { key: 'card', label: 'Card', icon: CreditCard },
  { key: 'cash', label: 'Cash', icon: Banknote },
  { key: 'balance', label: 'Stored balance', icon: Wallet },
  { key: 'points', label: 'Points', icon: Coins },
]

const TENDER_CHIP: Record<Sale['tender'], { label: string; tone: 'frost' | 'grass' | 'ice' | 'gold' }> = {
  card: { label: 'Card', tone: 'frost' },
  cash: { label: 'Cash', tone: 'grass' },
  balance: { label: 'Balance', tone: 'ice' },
  points: { label: 'Points', tone: 'gold' },
}

const nowTime = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

function Swatch({ product, size = 36 }: { product: Product; size?: number }) {
  const initials = product.name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return (
    <span
      aria-hidden
      className="display inline-flex shrink-0 items-center justify-center rounded-lg font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, hsl(${product.hue} 50% 90%), hsl(${product.hue} 45% 80%))`,
        color: `hsl(${product.hue} 50% 30%)`,
        border: `1px solid hsl(${product.hue} 35% 68%)`,
      }}
    >
      {initials}
    </span>
  )
}

export default function PosPage() {
  const [category, setCategory] = useState<Product['category']>('pro-shop')
  const [cart, setCart] = useState<{ productId: string; qty: number }[]>([])
  const [sales, setSales] = useState<Sale[]>(SALES)

  const catalog = PRODUCTS.filter((p) => p.category === category)

  const subtotal = useMemo(
    () => cart.reduce((s, line) => s + (productById(line.productId)?.price ?? 0) * line.qty, 0),
    [cart],
  )
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  const revenue = sales.reduce((s, sale) => s + sale.total, 0)
  const avgTicket = sales.length > 0 ? revenue / sales.length : 0

  const addToCart = (productId: string) => {
    setCart((c) => {
      const line = c.find((l) => l.productId === productId)
      if (line) return c.map((l) => (l.productId === productId ? { ...l, qty: l.qty + 1 } : l))
      return [...c, { productId, qty: 1 }]
    })
  }

  const step = (productId: string, delta: number) => {
    setCart((c) =>
      c
        .map((l) => (l.productId === productId ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0),
    )
  }

  const remove = (productId: string) => setCart((c) => c.filter((l) => l.productId !== productId))

  const charge = (tender: Sale['tender'], label: string) => {
    if (cart.length === 0) return
    const sale: Sale = { id: `s-${Date.now()}`, time: nowTime(), items: cart, total, tender }
    setSales((s) => [sale, ...s])
    setCart([])
    toast(`Sale recorded — ${money(total)} (${label})`)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Frozen Ropes Dawsonville"
        title="Point of sale"
        sub="Pro Shop, concessions, and cage time — one register, four tenders."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rise">
          <StatCard label="Today's revenue" value={revenue} format={money} icon={<TrendingUp size={18} aria-hidden />} />
        </div>
        <div className="rise" style={{ animationDelay: '50ms' }}>
          <StatCard label="Transactions" value={sales.length} icon={<Receipt size={18} aria-hidden />} />
        </div>
        <div className="rise" style={{ animationDelay: '100ms' }}>
          <StatCard label="Average ticket" value={avgTicket} format={money} icon={<ShoppingCart size={18} aria-hidden />} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Catalog */}
        <div className="rise" style={{ animationDelay: '100ms' }}>
          <Card>
            <CardTitle>Catalog</CardTitle>
            <Tabs
              tabs={[
                { id: 'pro-shop', label: 'Pro Shop' },
                { id: 'concessions', label: 'Concessions' },
                { id: 'cage-time', label: 'Cage time' },
              ]}
              active={category}
              onChange={(id) => setCategory(id as Product['category'])}
            />
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {catalog.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p.id)}
                  aria-label={`Add ${p.name} to cart — ${money(p.price)}`}
                  className="group flex items-center gap-3 rounded-lg border border-ice-600/40 bg-ice-900/60 p-2.5 text-left transition-colors hover:border-frost-400/50 hover:bg-ice-700/50"
                >
                  <Swatch product={p} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ice-100 group-hover:text-frost-200">{p.name}</p>
                    <p className="tabular text-xs text-ice-400">
                      {money(p.price)}
                      {p.stock < 999 && (
                        <span className={p.stock < 10 ? ' text-gold-300' : ''}> · {p.stock} in stock</span>
                      )}
                    </p>
                  </div>
                  <Plus size={15} className="shrink-0 text-ice-500 transition-colors group-hover:text-frost-300" aria-hidden />
                </button>
              ))}
            </div>
          </Card>

          {/* Transactions */}
          <Card className="mt-4" pad={false}>
            <div className="px-4 pt-4 sm:px-5 sm:pt-5">
              <CardTitle action={<span className="tabular text-xs text-ice-400">{sales.length} today</span>}>
                Today's transactions
              </CardTitle>
            </div>
            <div className="max-h-80 divide-y divide-ice-600/20 overflow-y-auto">
              {sales.map((s) => (
                <div key={s.id} className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
                  <span className="tabular w-16 shrink-0 text-xs text-ice-400">{s.time}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ice-100">
                      {s.items.map((i) => `${i.qty}× ${productById(i.productId)?.name ?? 'Item'}`).join(', ')}
                    </p>
                    {s.memberName && <p className="text-[11px] text-ice-400">Member · {s.memberName}</p>}
                  </div>
                  <Chip tone={TENDER_CHIP[s.tender].tone}>{TENDER_CHIP[s.tender].label}</Chip>
                  <span className="tabular w-16 shrink-0 text-right text-sm font-semibold text-ice-50">{money(s.total)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Register */}
        <div className="rise" style={{ animationDelay: '150ms' }}>
          <Card>
            <CardTitle action={<Chip tone="frost" icon={<ShoppingCart size={11} aria-hidden />}>{cart.reduce((s, l) => s + l.qty, 0)} items</Chip>}>
              Register
            </CardTitle>
            {cart.length === 0 ? (
              <p className="rounded-lg border border-dashed border-ice-600/50 px-4 py-8 text-center text-sm text-ice-400">
                Cart is empty — tap a product to ring it up.
              </p>
            ) : (
              <div className="divide-y divide-ice-600/20">
                {cart.map((line) => {
                  const p = productById(line.productId)
                  if (!p) return null
                  return (
                    <div key={line.productId} className="flex items-center gap-2.5 py-2.5">
                      <Swatch product={p} size={30} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ice-100">{p.name}</p>
                        <p className="tabular text-xs text-ice-400">{money(p.price)} each</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => step(line.productId, -1)}
                          aria-label={`Decrease quantity of ${p.name}`}
                          className="rounded-md border border-ice-600/60 p-1 text-ice-300 transition-colors hover:bg-ice-700 hover:text-ice-100"
                        >
                          <Minus size={13} aria-hidden />
                        </button>
                        <span className="tabular w-6 text-center text-sm font-semibold text-ice-50">{line.qty}</span>
                        <button
                          onClick={() => step(line.productId, 1)}
                          disabled={line.qty >= p.stock}
                          aria-label={`Increase quantity of ${p.name}`}
                          className="rounded-md border border-ice-600/60 p-1 text-ice-300 transition-colors hover:bg-ice-700 hover:text-ice-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus size={13} aria-hidden />
                        </button>
                      </div>
                      <span className="tabular w-14 shrink-0 text-right text-sm font-semibold text-ice-50">{money(p.price * line.qty)}</span>
                      <button
                        onClick={() => remove(line.productId)}
                        aria-label={`Remove ${p.name} from cart`}
                        className="rounded-md p-1 text-ice-500 transition-colors hover:bg-clay-500/20 hover:text-clay-300"
                      >
                        <Trash2 size={14} aria-hidden />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="mt-4 space-y-1.5 border-t border-ice-600/40 pt-3">
              <div className="flex justify-between text-sm text-ice-300">
                <span>Subtotal</span>
                <span className="tabular">{money(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-ice-300">
                <span>Tax (7%)</span>
                <span className="tabular">{money(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-ice-50">
                <span className="display uppercase tracking-wide">Total</span>
                <span className="display tabular text-xl">{money(total)}</span>
              </div>
            </div>

            <p className="eyebrow mt-4 mb-2 text-ice-400">Tender</p>
            <div className="grid grid-cols-2 gap-2">
              {TENDERS.map((t) => (
                <Button
                  key={t.key}
                  variant={t.key === 'card' ? 'primary' : t.key === 'points' ? 'gold' : 'ghost'}
                  disabled={cart.length === 0}
                  onClick={() => charge(t.key, t.label)}
                >
                  <t.icon size={15} aria-hidden /> {t.label}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
