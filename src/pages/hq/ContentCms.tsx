import { useMemo, useState } from 'react'
import { Eye, FileText, Pencil, Plus, Search, Star } from 'lucide-react'
import { Button, Card, CardTitle, Chip, Modal, PageHeader, StatCard, Tabs, toast } from '../../components/ui'
import { PILLARS, RESOURCES } from '../../data/seed'
import type { Pillar, Resource, ResourceType } from '../../lib/types'

const TYPES: ResourceType[] = ['video', 'pdf', 'spreadsheet', 'drill', 'lecture']

const PILLAR_LABEL: Record<Pillar, string> = {
  instruction: 'Instruction',
  operations: 'Operations',
  programs: 'Programs',
  marketing: 'Marketing',
}

const PILLAR_TONE: Record<Pillar, 'frost' | 'ice' | 'grass' | 'gold'> = {
  instruction: 'frost',
  operations: 'ice',
  programs: 'grass',
  marketing: 'gold',
}

export default function ContentCmsPage() {
  const [resources, setResources] = useState<Resource[]>(RESOURCES)
  const [pillar, setPillar] = useState('all')
  const [types, setTypes] = useState<ResourceType[]>([])
  const [query, setQuery] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newPillar, setNewPillar] = useState<Pillar>('instruction')
  const [newType, setNewType] = useState<ResourceType>('video')

  const published = resources.filter((r) => r.status === 'published').length
  const drafts = resources.filter((r) => r.status === 'draft').length
  const totalViews = resources.reduce((s, r) => s + r.views, 0)
  const mostViewed = [...resources].sort((a, b) => b.views - a.views)[0]
  const top5 = [...resources].sort((a, b) => b.views - a.views).slice(0, 5)
  const maxViews = top5[0]?.views ?? 1

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return resources.filter((r) => {
      if (pillar !== 'all' && r.pillar !== pillar) return false
      if (types.length > 0 && !types.includes(r.type)) return false
      if (q && !`${r.title} ${r.description} ${r.tags.join(' ')}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [resources, pillar, types, query])

  const toggleType = (t: ResourceType) =>
    setTypes((xs) => (xs.includes(t) ? xs.filter((x) => x !== t) : [...xs, t]))

  const toggleStatus = (id: string) => {
    setResources((xs) =>
      xs.map((r) => (r.id === id ? { ...r, status: r.status === 'published' ? 'draft' : 'published' } : r)),
    )
    const r = resources.find((x) => x.id === id)
    if (r) toast(r.status === 'published' ? `Unpublished "${r.title}" — pulled from the network Library` : `Published "${r.title}" to all 9 facilities`)
  }

  const createResource = () => {
    if (!newTitle.trim()) {
      toast('Give the resource a title first')
      return
    }
    const draft: Resource = {
      id: `r-new-${Date.now()}`,
      title: newTitle.trim(),
      pillar: newPillar,
      type: newType,
      description: 'Drafted in the CMS — add a description before publishing.',
      meta: '—',
      views: 0,
      status: 'draft',
      tags: [],
      updated: 'Jun 12',
    }
    setResources((xs) => [draft, ...xs])
    setShowNew(false)
    setNewTitle('')
    toast(`Draft created: "${draft.title}"`)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Frozen Ropes USA · Network HQ"
        title="Content CMS"
        sub="The Library that replaced Google Drive — 35 years of curriculum, governed from one desk and published to all 9 facilities."
        action={
          <Button onClick={() => setShowNew(true)}>
            <Plus size={15} aria-hidden /> New resource
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Published" value={published} format={(n) => String(Math.round(n))} icon={<FileText size={18} aria-hidden />} />
        <StatCard label="Drafts" value={drafts} format={(n) => String(Math.round(n))} icon={<Pencil size={18} aria-hidden />} />
        <StatCard label="Total views" value={totalViews} format={(n) => Math.round(n).toLocaleString()} delta={11} icon={<Eye size={18} aria-hidden />} />
        <Card className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <p className="eyebrow text-ice-400">Most viewed</p>
            <Star size={18} className="text-frost-400" aria-hidden />
          </div>
          <p className="display mt-2 truncate text-xl font-semibold text-ice-50" title={mostViewed.title}>
            {mostViewed.title}
          </p>
          <p className="tabular mt-1 text-xs font-medium text-ice-400">{mostViewed.views.toLocaleString()} views · {PILLAR_LABEL[mostViewed.pillar]}</p>
        </Card>
      </div>

      <div className="mt-4 grid items-start gap-4 xl:grid-cols-3">
        <Card className="rise xl:col-span-2">
          <CardTitle>Library catalog</CardTitle>

          <Tabs
            tabs={[{ id: 'all', label: 'All pillars' }, ...PILLARS.map((p) => ({ id: p.id, label: p.name }))]}
            active={pillar}
            onChange={setPillar}
          />

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ice-400" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles, descriptions, tags…"
                aria-label="Search resources"
                className="w-full rounded-md border border-ice-600/60 bg-ice-900 py-1.5 pl-8 pr-3 text-sm text-ice-100 placeholder:text-ice-500"
              />
            </div>
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => toggleType(t)}
                aria-pressed={types.includes(t)}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize transition-colors ${
                  types.includes(t)
                    ? 'border-frost-400/60 bg-frost-400/15 text-frost-300'
                    : 'border-ice-600/50 text-ice-300 hover:border-ice-500 hover:text-ice-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-ice-600/40 text-[11px] uppercase tracking-wider text-ice-400">
                  <th className="py-2 pr-3 font-semibold">Resource</th>
                  <th className="py-2 pr-3 font-semibold">Pillar</th>
                  <th className="py-2 pr-3 font-semibold">Type</th>
                  <th className="py-2 pr-3 text-right font-semibold">Views</th>
                  <th className="py-2 pr-3 font-semibold">Updated</th>
                  <th className="py-2 pr-3 font-semibold">Status</th>
                  <th className="py-2 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-ice-700/40 transition-colors last:border-0 hover:bg-ice-700/30">
                    <td className="max-w-[260px] py-2.5 pr-3">
                      <p className="truncate font-medium text-ice-100" title={r.title}>{r.title}</p>
                      <p className="truncate text-[11px] text-ice-400">{r.meta}</p>
                    </td>
                    <td className="py-2.5 pr-3"><Chip tone={PILLAR_TONE[r.pillar]}>{PILLAR_LABEL[r.pillar]}</Chip></td>
                    <td className="py-2.5 pr-3 capitalize text-ice-300">{r.type}</td>
                    <td className="tabular py-2.5 pr-3 text-right text-ice-100">{r.views.toLocaleString()}</td>
                    <td className="py-2.5 pr-3 text-ice-400">{r.updated}</td>
                    <td className="py-2.5 pr-3">
                      {r.status === 'published' ? <Chip tone="grass">Published</Chip> : <Chip tone="gold">Draft</Chip>}
                    </td>
                    <td className="py-2.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => toggleStatus(r.id)}
                          className="rounded-md border border-ice-600/60 px-2 py-1 text-[11px] font-semibold text-ice-200 transition-colors hover:bg-ice-700/60 hover:text-ice-50"
                        >
                          {r.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => toast(`Editor opening for "${r.title}"`)}
                          aria-label={`Edit ${r.title}`}
                          className="rounded-md border border-ice-600/60 p-1.5 text-ice-300 transition-colors hover:bg-ice-700/60 hover:text-ice-50"
                        >
                          <Pencil size={13} aria-hidden />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-ice-400">
                      No resources match those filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="rise">
          <CardTitle action={<Chip tone="frost" icon={<Eye size={11} aria-hidden />}>Last 90 days</Chip>}>
            Usage analytics
          </CardTitle>
          <p className="-mt-2 mb-3 text-xs text-ice-400">Top 5 resources by views across the network.</p>
          <div className="space-y-3">
            {top5.map((r, i) => (
              <div key={r.id}>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="display tabular w-4 shrink-0 text-sm font-bold text-ice-400">{i + 1}</span>
                    <span className="truncate text-sm font-medium text-ice-100" title={r.title}>{r.title}</span>
                  </span>
                  <span className="tabular shrink-0 text-xs font-semibold text-ice-200">{r.views.toLocaleString()}</span>
                </div>
                <div className="ml-6 h-1.5 overflow-hidden rounded-full bg-ice-700" role="img" aria-label={`${r.title}: ${r.views} views`}>
                  <div className="h-full rounded-full bg-frost-400" style={{ width: `${Math.round((r.views / maxViews) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 border-t border-ice-700/60 pt-3 text-xs leading-relaxed text-ice-400">
            View counts roll up from every facility's Library. The Blueprint and the Rock Ready Manual lead
            the network month after month.
          </p>
        </Card>
      </div>

      <Modal open={showNew} onClose={() => setShowNew(false)} title="New resource">
        <div className="space-y-4">
          <label className="block">
            <span className="eyebrow mb-1.5 block text-ice-400">Title</span>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Fall Camp Pricing Worksheet"
              className="w-full rounded-md border border-ice-600/60 bg-ice-900 px-3 py-2 text-sm text-ice-100 placeholder:text-ice-500"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="eyebrow mb-1.5 block text-ice-400">Pillar</span>
              <select
                value={newPillar}
                onChange={(e) => setNewPillar(e.target.value as Pillar)}
                className="w-full rounded-md border border-ice-600/60 bg-ice-900 px-3 py-2 text-sm text-ice-100"
              >
                {PILLARS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="eyebrow mb-1.5 block text-ice-400">Type</span>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as ResourceType)}
                className="w-full rounded-md border border-ice-600/60 bg-ice-900 px-3 py-2 text-sm capitalize text-ice-100"
              >
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
          </div>
          <p className="text-xs text-ice-400">New resources start as drafts — publish from the catalog when they're network-ready.</p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button onClick={createResource}>Create draft</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
