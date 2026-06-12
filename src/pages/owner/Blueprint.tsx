import { useMemo, useState } from 'react'
import { Lightbulb, Receipt, Scale, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardTitle, Chip, Modal, PageHeader, StatCard } from '../../components/ui'
import { CompareBars, Sparkline, TrendChart } from '../../components/charts'
import { BLUEPRINT, MONTHS } from '../../data/seed'
import type { BlueprintLine } from '../../lib/types'

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

const COACHING_TIPS: Record<string, string> = {
  'Memberships': 'Above benchmark in month five of a launch — protect it. Renewal outreach beats new-member ads on margin every time.',
  'Lessons & Classes': 'Running under benchmark. Fill the 4–6 PM dead zone first — semi-private lessons convert the class waitlist without adding staff hours.',
  'Camps & Clinics': 'School breaks carry this line. Lock July staffing now — the playbook ratio is one coach per eight campers, and margin dies past that.',
  'Cage Rentals': 'Hot line. Add prime-time Friday and Sunday slots before you ever discount off-peak hours.',
  'Pro Shop & Concessions': 'Light vs. benchmark. Move grip trainers next to the register and push stored-balance top-ups — balance families spend 30% more.',
  'Payroll': 'Under benchmark while classes stay full — that is the launch sweet spot. Do not cut instructor hours to chase it lower.',
  'Rent & Utilities': 'Slightly over. Audit the HVAC schedule — the cages do not need 68 degrees at 6 AM on a Tuesday.',
  'Equipment (bats, balls, screens)': 'Over benchmark. Ball attrition is usually the leak — count buckets weekly, not monthly, and tag the L-screens.',
  'Marketing': 'Under benchmark with members still climbing — referrals are doing the work. Keep funding the points kit, skip the billboard.',
  'Insurance': 'On benchmark. Keep the maintenance log current — that documentation is what holds this rate at renewal.',
}

export default function BlueprintPage() {
  const [selected, setSelected] = useState<BlueprintLine | null>(null)

  const juneIdx = MONTHS.length - 1
  const revenue = BLUEPRINT.filter((l) => l.group === 'revenue')
  const expenses = BLUEPRINT.filter((l) => l.group === 'expense')

  const totals = useMemo(() => {
    const revYtd = sum(revenue.map((l) => sum(l.actual)))
    const expYtd = sum(expenses.map((l) => sum(l.actual)))
    const revBench = sum(revenue.map((l) => sum(l.benchmark)))
    const expBench = sum(expenses.map((l) => sum(l.benchmark)))
    const net = revYtd - expYtd
    const netBench = revBench - expBench
    return { revYtd, expYtd, net, variance: ((net - netBench) / netBench) * 100 }
  }, [revenue, expenses])

  const monthly = useMemo(
    () =>
      MONTHS.map((m, i) => ({
        x: m,
        actual: sum(revenue.map((l) => l.actual[i])),
        benchmark: sum(revenue.map((l) => l.benchmark[i])),
      })),
    [revenue],
  )

  const variancePct = (line: BlueprintLine) => {
    const a = line.actual[juneIdx]
    const b = line.benchmark[juneIdx]
    return ((a - b) / b) * 100
  }
  const isFavorable = (line: BlueprintLine) => {
    const v = variancePct(line)
    return line.group === 'revenue' ? v >= 0 : v <= 0
  }

  const modalData = selected
    ? MONTHS.map((m, i) => ({
        x: m,
        actual: Math.round(selected.actual[i] / 100) / 10,
        blueprint: Math.round(selected.benchmark[i] / 100) / 10,
      }))
    : []
  const modalMax = selected
    ? Math.ceil(Math.max(...selected.actual, ...selected.benchmark) / 1000) + 1
    : 10

  return (
    <div>
      <PageHeader
        eyebrow="Frozen Ropes Dawsonville"
        title="The Blueprint"
        sub="Your P&L against the numbers that work — benchmarks from the Frozen Ropes Blueprint, proven across nine facilities since 1990."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Revenue YTD', value: totals.revYtd, format: usd, icon: <TrendingUp size={18} aria-hidden /> },
          { label: 'Expenses YTD', value: totals.expYtd, format: usd, icon: <TrendingDown size={18} aria-hidden /> },
          { label: 'Net YTD', value: totals.net, format: usd, icon: <Receipt size={18} aria-hidden /> },
          { label: 'vs Blueprint', value: totals.variance, format: (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`, icon: <Scale size={18} aria-hidden /> },
        ].map((s, i) => (
          <div key={s.label} className="rise" style={{ animationDelay: `${i * 50}ms` }}>
            <StatCard label={s.label} value={s.value} format={s.format} icon={s.icon} />
          </div>
        ))}
      </div>

      <div className="mt-4 rise" style={{ animationDelay: '200ms' }}>
        <Card>
          <CardTitle>Monthly revenue vs. Blueprint</CardTitle>
          <CompareBars data={monthly} height={250} />
        </Card>
      </div>

      <div className="mt-4 rise" style={{ animationDelay: '260ms' }}>
        <Card pad={false}>
          <div className="flex items-center justify-between gap-2 px-4 pt-4 sm:px-5">
            <h2 className="display text-lg font-semibold text-ice-100">June variance by line</h2>
            <p className="text-xs text-ice-400">Click a line for the six-month story</p>
          </div>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-ice-600/40 text-left text-[11px] uppercase tracking-wider text-ice-400">
                  <th className="px-4 py-2.5 font-semibold sm:px-5">Category</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Jun actual</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Blueprint</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Variance</th>
                  <th className="px-4 py-2.5 text-right font-semibold sm:px-5">6-mo trend</th>
                </tr>
              </thead>
              <tbody>
                {BLUEPRINT.map((line) => {
                  const v = variancePct(line)
                  const good = isFavorable(line)
                  return (
                    <tr
                      key={line.category}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelected(line)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(line) } }}
                      className="cursor-pointer border-b border-ice-700/40 transition-colors last:border-0 hover:bg-ice-700/30 focus-visible:bg-ice-700/30"
                    >
                      <td className="px-4 py-3 sm:px-5">
                        <span className="font-medium text-ice-100">{line.category}</span>
                        <span className="ml-2 align-middle">
                          <Chip tone={line.group === 'revenue' ? 'frost' : 'ice'}>{line.group === 'revenue' ? 'Revenue' : 'Expense'}</Chip>
                        </span>
                      </td>
                      <td className="tabular px-3 py-3 text-right font-medium text-ice-100">{usd(line.actual[juneIdx])}</td>
                      <td className="tabular px-3 py-3 text-right text-ice-400">{usd(line.benchmark[juneIdx])}</td>
                      <td className={`tabular px-3 py-3 text-right font-semibold ${good ? 'text-grass-400' : 'text-clay-300'}`}>
                        {v >= 0 ? '+' : ''}{v.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-right sm:px-5">
                        <Sparkline data={line.actual} stroke={good ? 'var(--color-grass-400)' : 'var(--color-clay-300)'} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.category ?? ''} wide>
        {selected && (
          <div>
            <p className="mb-3 text-xs text-ice-400">
              Actual vs. Blueprint benchmark, Jan–Jun · $ thousands
            </p>
            <TrendChart data={modalData} height={230} yDomain={[0, modalMax]} unit="k" />
            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-gold-400/30 bg-gold-400/10 p-3.5">
              <Lightbulb size={16} className="mt-0.5 shrink-0 text-gold-300" aria-hidden />
              <p className="text-sm leading-relaxed text-ice-100">{COACHING_TIPS[selected.category] ?? 'Hold this line to benchmark and the model takes care of itself.'}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
