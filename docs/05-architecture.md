# 05 — Architecture

## Stack decision

**React 19 + Vite 7 + TypeScript (strict) + Tailwind CSS v4 + React Router v7 (declarative mode), deployed as a static SPA on Netlify.**

Why not Next.js: there is no SSR/SEO requirement — five of six surfaces sit behind a role gate, and the only public page (Sneak Peek) is a single route easily served by the SPA. Route handlers would only wrap mock data. Vite gives faster builds, a simpler Netlify deployment (static publish + redirect rule), and no server runtime to maintain. React Router framework mode was evaluated and rejected for the same reason (per research doc 01 §3).

Supporting libraries (all justified in doc 01):
- **recharts** — commodity charts (radar, trend lines, grouped bars)
- **hand-rolled SVG** — signature visualizations (Savant-style percentile rows, sparklines, rope mark, diamond progress ring) where chart libraries would fight the design
- **lucide-react** — icon system (1.5px stroke, tree-shakable)
- **motion** — installed for route/feature transitions; most motion is deliberately CSS (`rise`, `animate-rope`, count-up via rAF) to keep the bundle lean

## Source layout

```
src/
  main.tsx            entry: BrowserRouter + AuthProvider
  App.tsx             route table; lazy() per page; Suspense fallback
  index.css           Tailwind v4 @theme tokens (Night Game palette), motion keyframes, a11y rules
  lib/
    types.ts          all domain types
    auth.tsx          demo auth context (persona, login/logout, localStorage persistence)
    nav.ts            NAV_CONFIG — single source of truth for nav + mobile tabs per role
  data/
    seed.ts           deterministic seeded dataset (61 players, 9 facilities, library, colleges,
                      pipeline, Blueprint P&L, threads, videos…) + lookup helpers
  components/
    ui.tsx            primitives: Card, StatCard, Chip, Button, Modal, Toast, Tabs, Breadcrumbs,
                      EmptyState, Avatar, RockReadyRing, DemoTag, useCountUp
    charts.tsx        Sparkline, PercentileRow, SkillRadar, TrendChart, CompareBars
    AppShell.tsx      guarded layout: sidebar, top bar, role switcher, mobile bottom bar
  pages/
    Login.tsx         persona picker
    SneakPeek.tsx     public prospect surface + Blueprint Simulator
    NotFound.tsx      404
    owner/ coach/ player/ parent/ hq/   role surfaces (38 screens)
```

## Key decisions

1. **Role guards at the layout level.** `<AppShell role="owner">` wraps all `/owner/*` routes; it redirects signed-out users to `/` and wrong-role users to their own home. Guards, nav, and routes all derive from the same role → no drift. (Client guards are demo-appropriate; real auth replaces `lib/auth.tsx` with a server-backed session and the same interface.)
2. **Deterministic seed.** `seed.ts` uses a fixed-seed LCG so every load shows identical data — critical for demos and screenshots. Mutations (attendance, POS sales, messages, evals) live in page-local React state: the demo feels alive without a persistence layer to break.
3. **Stubbed-with-intent boundaries.** Stripe charges, video playback/AI inference, and email delivery are mocked at the exact call sites where real services would plug in, and visibly labeled (`DemoTag`) where honesty matters. The component interfaces would not change.
4. **Code splitting.** Every page is `lazy()`; vendor and recharts are split via `manualChunks`. Recharts loads only on routes that chart.
5. **One theme.** Doc 04 sketched a light "Day Game" theme for parent/player; this pass ships the unified Night Game theme for visual coherence and contrast-audit confidence. The `data-theme="day"` hook remains in `index.css` as the seam. (Deviation recorded; revisit with real brand assets.)
6. **Netlify.** `netlify.toml` (build + publish + redirect) **and** `public/_redirects` both carry the SPA catch-all so deep links survive refresh regardless of which mechanism wins.

## Data flow (production path)

Demo: `seed.ts → page state`. Production: replace `data/seed.ts` imports with a typed API client (the domain types in `lib/types.ts` are the contract), Prisma/Postgres behind it, Stripe for billing/POS tenders, object storage + inference queue for video. The UI layer is already shaped for that swap — every screen consumes the types, not the seed module's internals.
