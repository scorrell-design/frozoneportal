import { Link, useParams } from 'react-router-dom'
import { CalendarDays, FileText, Percent, Rocket, Target, TrendingUp, Users } from 'lucide-react'
import { Avatar, Breadcrumbs, Button, Card, CardTitle, Chip, EmptyState, PageHeader, StatCard } from '../../components/ui'
import { CompareBars } from '../../components/charts'
import { BLUEPRINT, CLASSES, MONTHS, STAFF, facilityById } from '../../data/seed'

export default function FacilityDetailPage() {
  const { id } = useParams()
  const facility = id ? facilityById(id) : undefined

  if (!facility) {
    return (
      <div>
        <Breadcrumbs items={[{ label: 'Facilities', to: '/hq/facilities' }, { label: 'Not found' }]} />
        <EmptyState
          title="Facility not found"
          hint="That location isn't in the network roster. Head back to the facilities list."
          action={
            <Link to="/hq/facilities">
              <Button variant="ghost">Back to the network</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const isDawsonville = facility.id === 'fac-dawsonville'
  const revenueLines = BLUEPRINT.filter((l) => l.group === 'revenue')
  const compareData = MONTHS.map((m, i) => ({
    x: m,
    actual: revenueLines.reduce((s, l) => s + l.actual[i], 0),
    benchmark: revenueLines.reduce((s, l) => s + l.benchmark[i], 0),
  }))

  const weekClasses = CLASSES.filter((c) => c.type !== 'rental')
  const weekEnrolled = weekClasses.reduce((s, c) => s + c.enrolled.length, 0)
  const monthlyRevenue = Math.round(facility.revenueYtd / 6)

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Facilities', to: '/hq/facilities' }, { label: facility.name }]} />
      <PageHeader
        eyebrow="Network HQ · Facility Detail"
        title={facility.name}
        sub={`${facility.owner} · ${facility.city}, ${facility.state} · in the network since ${facility.since}`}
        action={
          facility.status === 'open'
            ? <Chip tone="grass">Open</Chip>
            : <Chip tone="gold" icon={<Rocket size={11} aria-hidden />}>Launching</Chip>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Members" value={facility.members} format={(n) => Math.round(n).toLocaleString()} icon={<Users size={18} aria-hidden />} />
        <StatCard label="Revenue YTD" value={facility.revenueYtd} format={(n) => `$${Math.round(n / 1000)}k`} icon={<TrendingUp size={18} aria-hidden />} />
        <StatCard label="Utilization" value={facility.utilization} format={(n) => `${Math.round(n)}%`} icon={<Percent size={18} aria-hidden />} />
        <StatCard label="Rock Ready rate" value={facility.rockReadyRate} format={(n) => `${Math.round(n)}%`} icon={<Target size={18} aria-hidden />} />
      </div>

      <div className="mt-4 grid items-start gap-4 xl:grid-cols-3">
        <Card className="rise xl:col-span-2">
          <CardTitle action={<Chip tone={isDawsonville ? 'frost' : 'ice'}>{isDawsonville ? 'Live feed' : 'Reported monthly'}</Chip>}>
            Blueprint compliance — revenue
          </CardTitle>
          <p className="-mt-2 mb-3 text-xs text-ice-400">
            All revenue lines vs. the Blueprint benchmark, Jan–Jun.
            {' '}Dawsonville reports through a live Frozone feed; other facilities report monthly.
          </p>
          <CompareBars data={compareData} height={260} />
        </Card>

        <div className="space-y-4">
          {isDawsonville ? (
            <>
              <Card className="rise border-gold-400/30">
                <div className="flex items-start justify-between">
                  <p className="eyebrow text-gold-300">Launch story</p>
                  <Rocket size={16} className="text-gold-300" aria-hidden />
                </div>
                <p className="display tabular mt-2 text-3xl font-semibold text-ice-50">124 members in 120 days</p>
                <p className="mt-2 text-xs leading-relaxed text-ice-400">
                  Dana &amp; Paul Whitfield came in from outside the industry and ran the launch sequence by the book.
                  The playbook that filled the building is in the Library.
                </p>
                <Link to="/hq/content" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-frost-300 hover:text-frost-200">
                  <FileText size={13} aria-hidden /> Grand Opening Playbook — Marketing pillar
                </Link>
              </Card>

              <Card className="rise">
                <CardTitle action={<Chip tone="frost" icon={<CalendarDays size={11} aria-hidden />}>{weekClasses.length} this week</Chip>}>
                  Programs on the board
                </CardTitle>
                <p className="text-sm text-ice-300">
                  <span className="tabular font-semibold text-ice-50">{weekClasses.length}</span> classes, lessons &amp; camps scheduled this week ·{' '}
                  <span className="tabular font-semibold text-ice-50">{weekEnrolled}</span> enrollments
                </p>
              </Card>

              <Card className="rise">
                <CardTitle>Staff</CardTitle>
                <div className="space-y-2">
                  {STAFF.map((s) => (
                    <div key={s.id} className="flex items-center gap-3 rounded-lg border border-ice-600/30 bg-ice-900/60 px-3 py-2">
                      <Avatar name={s.name} hue={s.hue} size={32} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ice-100">{s.name}</p>
                        <p className="truncate text-[11px] text-ice-400">{s.role} · {s.hoursWeek} hrs/wk</p>
                      </div>
                      {s.clockedIn ? <Chip tone="grass">On the clock</Chip> : <Chip tone="ice">Off</Chip>}
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="rise">
              <CardTitle action={<Chip tone="ice">Reported monthly</Chip>}>Latest report</CardTitle>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-ice-300">Reporting period</span>
                  <span className="font-medium text-ice-100">May 2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ice-300">Revenue (monthly avg)</span>
                  <span className="tabular font-semibold text-ice-50">${monthlyRevenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ice-300">Active members</span>
                  <span className="tabular font-semibold text-ice-50">{facility.members.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ice-300">Rock Ready participation</span>
                  <span className="tabular font-semibold text-ice-50">{facility.rockReadyRate}%</span>
                </div>
              </div>
              <p className="mt-3 border-t border-ice-700/60 pt-3 text-xs leading-relaxed text-ice-400">
                {facility.city} reports through the monthly Blueprint package. Live facility feeds roll out
                network-wide after the Dawsonville pilot.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
