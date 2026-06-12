import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, X } from 'lucide-react'

/* ---------- Card ---------- */
export function Card({ children, className = '', pad = true }: { children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <div className={`rounded-[10px] border border-ice-600/40 bg-ice-800 dark-card ${pad ? 'p-4 sm:p-5' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="display text-lg font-semibold uppercase tracking-wide text-ice-100">{children}</h2>
      {action}
    </div>
  )
}

/* ---------- Eyebrow + PageHeader ---------- */
export function PageHeader({ eyebrow, title, sub, action }: { eyebrow: string; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 rise">
      <div>
        <p className="eyebrow text-frost-400">{eyebrow}</p>
        <h1 className="display mt-1 text-3xl font-semibold uppercase tracking-wide text-ice-50 sm:text-4xl">{title}</h1>
        {sub && <p className="mt-1 max-w-2xl text-sm text-ice-300">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

/* ---------- StatCard with count-up ---------- */
export function useCountUp(target: number, duration = 800) {
  const [v, setV] = useState(0)
  const ref = useRef(target)
  ref.current = target
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(ref.current)
      return
    }
    let raf: number
    const t0 = performance.now()
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / duration)
      setV(ref.current * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return v
}

export function StatCard({ label, value, format = (n) => String(Math.round(n)), delta, deltaLabel, icon }: {
  label: string
  value: number
  format?: (n: number) => string
  delta?: number
  deltaLabel?: string
  icon?: ReactNode
}) {
  const v = useCountUp(value)
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <p className="eyebrow text-ice-400">{label}</p>
        {icon && <span className="text-frost-400">{icon}</span>}
      </div>
      <p className="display tabular mt-2 text-4xl font-semibold text-ice-50">{format(v)}</p>
      {delta !== undefined && (
        <p className={`tabular mt-1 text-xs font-medium ${delta >= 0 ? 'text-grass-400' : 'text-clay-300'}`}>
          {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}{deltaLabel ?? '%'} <span className="text-ice-400">vs last month</span>
        </p>
      )}
    </Card>
  )
}

/* ---------- Badge / StatusChip ---------- */
const CHIP_STYLES: Record<string, string> = {
  frost: 'bg-frost-400/15 text-frost-300 border-frost-400/30',
  grass: 'bg-grass-500/15 text-grass-400 border-grass-500/30',
  clay: 'bg-clay-500/15 text-clay-300 border-clay-500/40',
  gold: 'bg-gold-400/15 text-gold-300 border-gold-400/30',
  ice: 'bg-ice-600/30 text-ice-200 border-ice-500/40',
}

export function Chip({ tone = 'ice', children, icon }: { tone?: keyof typeof CHIP_STYLES; children: ReactNode; icon?: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${CHIP_STYLES[tone]}`}>
      {icon}
      {children}
    </span>
  )
}

/* ---------- Buttons ---------- */
export function Button({ children, onClick, variant = 'primary', type = 'button', disabled, className = '' }: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger' | 'gold'
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}) {
  const styles = {
    primary: 'bg-frost-400 text-ice-950 hover:bg-frost-300 shadow-[0_0_18px_rgba(56,189,248,0.25)]',
    ghost: 'border border-ice-600/60 text-ice-200 hover:bg-ice-700/60 hover:text-ice-50',
    danger: 'bg-clay-500 text-white hover:bg-clay-400',
    gold: 'bg-gold-400 text-ice-950 hover:bg-gold-300',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

/* ---------- Avatar ---------- */
export function Avatar({ name, hue, size = 36 }: { name: string; hue: number; size?: number }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return (
    <span
      aria-hidden
      className="display inline-flex shrink-0 items-center justify-center rounded-full font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, hsl(${hue} 55% 28%), hsl(${hue} 60% 18%))`,
        color: `hsl(${hue} 80% 82%)`,
        border: `1px solid hsl(${hue} 50% 38%)`,
      }}
    >
      {initials}
    </span>
  )
}

/* ---------- EmptyState ---------- */
export function EmptyState({ title, hint, action }: { title: string; hint: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-ice-600/50 px-6 py-12 text-center">
      <svg width="72" height="48" viewBox="0 0 72 48" fill="none" aria-hidden className="mb-4 opacity-70">
        <path d="M36 6 L62 32 H10 Z" stroke="var(--color-ice-500)" strokeWidth="1.5" fill="none" />
        <path d="M8 38 H64" stroke="var(--color-frost-400)" strokeWidth="2" strokeLinecap="round" strokeDasharray="240" className="animate-rope" />
        <circle cx="36" cy="20" r="2.5" fill="var(--color-frost-400)" />
      </svg>
      <p className="display text-lg font-semibold uppercase tracking-wide text-ice-100">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-ice-400">{hint}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/* ---------- Modal ---------- */
export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ice-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div
        className={`rise max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border border-ice-600/50 bg-ice-850 p-5 shadow-2xl sm:rounded-2xl ${wide ? 'sm:max-w-2xl' : 'sm:max-w-md'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="display text-xl font-semibold uppercase tracking-wide">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 text-ice-400 hover:bg-ice-700 hover:text-ice-100">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ---------- Toast ---------- */
let pushToast: (msg: string) => void = () => {}
export function toast(msg: string) {
  pushToast(msg)
}

export function ToastHost() {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([])
  useEffect(() => {
    pushToast = (msg: string) => {
      const id = Date.now() + Math.random()
      setItems((xs) => [...xs, { id, msg }])
      setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 3200)
    }
    return () => {
      pushToast = () => {}
    }
  }, [])
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-20 left-1/2 z-[60] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4 sm:bottom-6">
      {items.map((t) => (
        <div key={t.id} className="rise pointer-events-auto w-full rounded-lg border border-frost-400/40 bg-ice-800 px-4 py-2.5 text-sm font-medium text-ice-50 shadow-xl">
          {t.msg}
        </div>
      ))}
    </div>
  )
}

/* ---------- Tabs ---------- */
export function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div role="tablist" className="mb-4 flex flex-wrap gap-1 rounded-lg border border-ice-600/40 bg-ice-900 p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${active === t.id ? 'bg-frost-400 text-ice-950' : 'text-ice-300 hover:bg-ice-700/70 hover:text-ice-100'}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/* ---------- Breadcrumbs ---------- */
export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-xs text-ice-400">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={12} aria-hidden />}
          {it.to ? (
            <Link to={it.to} className="hover:text-frost-300">{it.label}</Link>
          ) : (
            <span className="text-ice-200">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

/* ---------- ProgressRing (diamond-framed) ---------- */
export function RockReadyRing({ score, size = 148, label = 'Rock Ready' }: { score: number; size?: number; label?: string }) {
  const v = useCountUp(score, 1100)
  const r = size * 0.36
  const c = 2 * Math.PI * r
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden>
        <rect
          x={size * 0.14} y={size * 0.14} width={size * 0.72} height={size * 0.72} rx={10}
          transform={`rotate(45 ${size / 2} ${size / 2})`}
          fill="none" stroke="var(--color-ice-600)" strokeWidth="1"
        />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-ice-700)" strokeWidth="7" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="var(--color-frost-400)" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 80ms linear', filter: 'drop-shadow(0 0 6px rgba(56,189,248,0.45))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="display tabular text-4xl font-bold text-ice-50">{Math.round(v)}</span>
        <span className="eyebrow text-ice-400">{label}</span>
      </div>
    </div>
  )
}

/* ---------- Demo notice ---------- */
export function DemoTag({ children = 'Demo data' }: { children?: ReactNode }) {
  return <span className="rounded border border-gold-400/40 bg-gold-400/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-300">{children}</span>
}
