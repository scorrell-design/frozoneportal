import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { PERSONAS } from '../data/seed'
import { RopeMark } from '../components/AppShell'
import { DemoTag } from '../components/ui'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ice-950">
      {/* Day-game backdrop: faint field geometry, no noise */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,#eef4f9_0%,#faf9f7_60%)]" />
        <svg className="absolute bottom-0 left-1/2 w-[1400px] max-w-none -translate-x-1/2 opacity-[0.5]" viewBox="0 0 700 360" fill="none">
          <path d="M350 40 L660 350 H40 Z" stroke="#d3dde6" strokeWidth="1" />
          <path d="M350 130 L565 345 H135 Z" stroke="#d3dde6" strokeWidth="0.75" />
          <circle cx="350" cy="252" r="34" stroke="#d3dde6" strokeWidth="0.75" />
          <path d="M20 355 H680" stroke="#d3dde6" strokeWidth="1" />
        </svg>
        {/* The frozen rope — one line drive across the page, drawn once */}
        <svg className="absolute left-1/2 top-[15%] w-[900px] max-w-[95vw] -translate-x-1/2" viewBox="0 0 900 60" fill="none">
          <path d="M30 30 H850" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" strokeDasharray="240" className="animate-rope" />
          <circle cx="850" cy="30" r="4" fill="#0369a1" />
        </svg>
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-14">
        <div className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-3 text-ice-50">
            <RopeMark size={40} />
            <span className="display text-4xl font-bold uppercase tracking-[0.25em] sm:text-5xl">Frozone</span>
          </div>
          <p className="eyebrow text-frost-400">The baseball operating system · by Frozen Ropes</p>
          <h1 className="display mt-5 text-4xl font-semibold text-ice-50 sm:text-5xl">
            Who's stepping up to the plate?
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-ice-300">
            Pick a persona to tour their portal. Switch any time from the top bar. <DemoTag />
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PERSONAS.map((p, i) => (
            <button
              key={p.role}
              onClick={() => {
                login(p.role)
                nav(p.home)
              }}
              className="rise group rounded-2xl border border-ice-600/40 bg-ice-850 p-5 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-frost-400/50 hover:shadow-md"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="display flex h-11 w-11 items-center justify-center rounded-full border border-frost-400/30 bg-frost-400/10 text-base font-bold text-frost-400">
                  {p.initials}
                </span>
                <ArrowRight size={18} className="text-ice-500 transition-all group-hover:translate-x-1 group-hover:text-frost-400" aria-hidden />
              </div>
              <p className="display text-2xl font-semibold leading-none text-ice-50">{p.name}</p>
              <p className="mt-1 text-xs font-medium text-frost-400">{p.title}</p>
              <p className="mt-2 text-[13px] leading-snug text-ice-300">{p.blurb}</p>
            </button>
          ))}
        </div>
      </main>

      <footer className="relative z-10 pb-6 text-center text-xs text-ice-400">
        Replace the Google Drive. Run the building. Develop the player. · Frozen Ropes USA
      </footer>
    </div>
  )
}
