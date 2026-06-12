import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend,
} from 'recharts'
import type { RockIndex } from '../lib/types'

/* ---------- Sparkline (hand-rolled SVG) ---------- */
export function Sparkline({ data, width = 96, height = 28, stroke = 'var(--color-frost-400)' }: {
  data: number[]
  width?: number
  height?: number
  stroke?: string
}) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * (width - 4) + 2},${height - 3 - ((v - min) / span) * (height - 6)}`).join(' ')
  const up = data[data.length - 1] >= data[0]
  return (
    <svg width={width} height={height} aria-label={`trend ${up ? 'up' : 'down'} from ${data[0]} to ${data[data.length - 1]}`} role="img">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts.split(' ').pop()!.split(',')[0]} cy={pts.split(' ').pop()!.split(',')[1]} r="2.4" fill={stroke} />
    </svg>
  )
}

/* ---------- Savant-style percentile row ---------- */
export function PercentileRow({ label, score, grade }: { label: string; score: number; grade?: string }) {
  // blue (cold) -> red (hot), the Baseball Savant idiom — Savant itself is light-themed
  const hue = 210 - (score / 100) * 195
  const color = `hsl(${hue} 70% 42%)`
  return (
    <div className="grid grid-cols-[minmax(90px,140px)_1fr_auto] items-center gap-3 py-1.5">
      <span className="truncate text-xs font-medium text-ice-300">{label}</span>
      <div className="relative h-1.5 rounded-full bg-ice-700" role="img" aria-label={`${label}: ${score}th percentile`}>
        <div className="absolute inset-y-0 left-0 rounded-full opacity-60" style={{ width: `${score}%`, background: color }} />
        <span
          className="tabular absolute top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm"
          style={{ left: `calc(${score}% - 12px)`, background: color, transition: 'left 700ms cubic-bezier(0.22,1,0.36,1)' }}
        >
          {score}
        </span>
      </div>
      {grade && <span className="display w-7 text-right text-sm font-bold text-ice-100">{grade}</span>}
    </div>
  )
}

/* ---------- Skill radar ("shape of the athlete") ---------- */
export function SkillRadar({ indexes, height = 260 }: { indexes: RockIndex[]; height?: number }) {
  const data = indexes.map((ix) => ({ skill: ix.label.replace(' Index', ''), score: ix.score }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="var(--color-ice-600)" />
        <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--color-ice-300)', fontSize: 11 }} />
        <Radar dataKey="score" stroke="var(--color-frost-400)" fill="var(--color-frost-400)" fillOpacity={0.28} strokeWidth={2} isAnimationActive />
      </RadarChart>
    </ResponsiveContainer>
  )
}

/* ---------- Trend line ---------- */
export function TrendChart({ data, height = 220, yDomain = [0, 100] as [number, number], unit = '' }: {
  data: { x: string; [k: string]: number | string }[]
  height?: number
  yDomain?: [number, number]
  unit?: string
}) {
  const keys = Object.keys(data[0] ?? {}).filter((k) => k !== 'x')
  const colors = ['var(--color-frost-400)', 'var(--color-gold-400)', 'var(--color-clay-400)']
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid stroke="var(--color-ice-700)" strokeDasharray="3 6" vertical={false} />
        <XAxis dataKey="x" tick={{ fill: 'var(--color-ice-400)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis domain={yDomain} tick={{ fill: 'var(--color-ice-400)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: 'var(--color-ice-850)', border: '1px solid var(--color-ice-600)', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: 'var(--color-ice-200)' }}
          formatter={(v) => [`${v}${unit}`]}
        />
        {keys.map((k, i) => (
          <Line key={k} type="monotone" dataKey={k} stroke={colors[i % colors.length]} strokeWidth={2.25} dot={false} activeDot={{ r: 4 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

/* ---------- Grouped bars (Blueprint actual vs benchmark) ---------- */
export function CompareBars({ data, height = 240 }: { data: { x: string; actual: number; benchmark: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
        <CartesianGrid stroke="var(--color-ice-700)" strokeDasharray="3 6" vertical={false} />
        <XAxis dataKey="x" tick={{ fill: 'var(--color-ice-400)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--color-ice-400)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={{ background: 'var(--color-ice-850)', border: '1px solid var(--color-ice-600)', borderRadius: 8, fontSize: 12 }}
          formatter={(v) => [`$${Number(v).toLocaleString()}`]}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="actual" name="Actual" fill="var(--color-frost-400)" radius={[3, 3, 0, 0]} />
        <Bar dataKey="benchmark" name="Blueprint" fill="var(--color-ice-500)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
