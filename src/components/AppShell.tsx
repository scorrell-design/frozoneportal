import { useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, MoreHorizontal, X } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { NAV_CONFIG } from '../lib/nav'
import type { Role } from '../lib/types'
import { PERSONAS, HOME_FACILITY } from '../data/seed'
import { ToastHost } from './ui'

export function RopeMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect x="7" y="7" width="18" height="18" rx="3" transform="rotate(45 16 16)" fill="none" stroke="var(--color-frost-400)" strokeWidth="1.6" />
      <path d="M3 16 H29" stroke="var(--color-ice-50)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="29" cy="16" r="2.2" fill="var(--color-frost-400)" />
    </svg>
  )
}

function RoleSwitcher() {
  const { persona, login } = useAuth()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  if (!persona) return null
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg border border-ice-600/50 bg-ice-800 px-2.5 py-1.5 text-sm hover:border-frost-400/50"
      >
        <span className="display flex h-6 w-6 items-center justify-center rounded-full bg-frost-400 text-xs font-bold text-ice-950">{persona.initials}</span>
        <span className="hidden font-medium sm:block">{persona.name}</span>
        <ChevronDown size={14} className="text-ice-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
          <div role="menu" className="rise absolute right-0 z-40 mt-2 w-64 rounded-xl border border-ice-600/50 bg-ice-850 p-1.5 shadow-2xl">
            <p className="eyebrow px-2.5 pb-1 pt-2 text-ice-400">Switch persona</p>
            {PERSONAS.map((p) => (
              <button
                key={p.role}
                role="menuitem"
                onClick={() => {
                  login(p.role)
                  setOpen(false)
                  nav(p.home)
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-ice-700 ${p.role === persona.role ? 'bg-ice-700/60' : ''}`}
              >
                <span className="display flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ice-500 text-xs font-bold text-ice-100">{p.initials}</span>
                <span>
                  <span className="block font-semibold text-ice-100">{p.name}</span>
                  <span className="block text-[11px] text-ice-400">{p.title}</span>
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function AppShell({ role }: { role: Role }) {
  const { persona, logout } = useAuth()
  const nav = useNavigate()
  const [moreOpen, setMoreOpen] = useState(false)

  if (!persona) return <Navigate to="/" replace />
  if (persona.role !== role) return <Navigate to={persona.home} replace />

  const items = NAV_CONFIG[role as Exclude<Role, 'prospect'>]
  const mobileItems = items.filter((i) => i.mobile).slice(0, 4)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-ice-600/40 bg-ice-900 md:flex">
        <Link to={persona.home} className="flex items-center gap-2.5 px-5 py-5">
          <RopeMark />
          <span>
            <span className="display block text-lg font-bold uppercase leading-none tracking-widest">Frozone</span>
            <span className="block text-[10px] font-medium tracking-wider text-ice-400">BY FROZEN ROPES</span>
          </span>
        </Link>
        <div className="mx-4 mb-3 rounded-lg border border-ice-600/40 bg-ice-800 px-3 py-2">
          <p className="eyebrow text-frost-400">{role === 'hq' ? 'Network HQ' : 'Facility'}</p>
          <p className="text-sm font-semibold text-ice-100">{role === 'hq' ? 'Frozen Ropes USA' : `Frozen Ropes ${HOME_FACILITY.name}`}</p>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3" aria-label="Primary">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.to === persona.home}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-frost-400/15 text-frost-300' : 'text-ice-300 hover:bg-ice-700/60 hover:text-ice-100'
                }`
              }
            >
              <it.icon size={17} aria-hidden />
              {it.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => {
            logout()
            nav('/')
          }}
          className="m-3 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ice-400 hover:bg-ice-700/60 hover:text-ice-100"
        >
          <LogOut size={17} aria-hidden /> Sign out
        </button>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col md:pl-60">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-ice-600/40 bg-ice-900/90 px-4 py-3 backdrop-blur md:px-8">
          <Link to={persona.home} className="flex items-center gap-2 md:hidden">
            <RopeMark size={24} />
            <span className="display text-base font-bold uppercase tracking-widest">Frozone</span>
          </Link>
          <p className="hidden text-sm text-ice-400 md:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · <span className="text-ice-200">{persona.title}</span>
          </p>
          <div className="flex items-center gap-2">
            <button aria-label="Notifications (3 unread)" className="relative rounded-lg border border-ice-600/50 bg-ice-800 p-2 hover:border-frost-400/50">
              <Bell size={16} />
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-clay-500 text-[9px] font-bold">3</span>
            </button>
            <RoleSwitcher />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom bar */}
      <nav aria-label="Primary mobile" className="fixed inset-x-0 bottom-0 z-30 flex border-t border-ice-600/50 bg-ice-900/95 backdrop-blur md:hidden">
        {mobileItems.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === persona.home}
            className={({ isActive }) =>
              `flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold ${isActive ? 'text-frost-300' : 'text-ice-400'}`
            }
          >
            <it.icon size={18} aria-hidden />
            {it.label.split(' ')[0]}
          </NavLink>
        ))}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold text-ice-400"
        >
          <MoreHorizontal size={18} aria-hidden /> More
        </button>
      </nav>

      {/* Mobile "More" sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-40 bg-ice-950/70 backdrop-blur-sm md:hidden" onClick={() => setMoreOpen(false)}>
          <div className="rise absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-ice-600/50 bg-ice-850 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between">
              <p className="display text-lg font-semibold uppercase tracking-wide">All destinations</p>
              <button onClick={() => setMoreOpen(false)} aria-label="Close" className="rounded p-1 text-ice-400">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {items.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.to === persona.home}
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ice-200 hover:bg-ice-700"
                >
                  <it.icon size={16} aria-hidden /> {it.label}
                </NavLink>
              ))}
              <button
                onClick={() => {
                  logout()
                  nav('/')
                }}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ice-400"
              >
                <LogOut size={16} aria-hidden /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastHost />
    </div>
  )
}
