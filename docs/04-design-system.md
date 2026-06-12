# 04 — Design System: "Night Game"

The Frozone should feel like a big-league control room: dark, calm, precise — with the warmth of a ballpark at dusk. Premium and unmistakably baseball; zero clip-art, zero template smell.

## 1. Brand

- **Name in product:** The Frozone (the OS), by Frozen Ropes.
- **Mark:** a frozen rope — the flat line-drive — rendered as a horizontal streak crossing a diamond outline. Used as favicon and nav mark (custom SVG).
- **Voice:** confident coach. Short imperatives ("Run the day," "Make it count"). Baseball vocabulary used precisely, never as decoration.

## 2. Color tokens (Tailwind v4 `@theme`)

| Token | Value | Use |
|---|---|---|
| `ice-950` | `#070D16` | App background (dark) |
| `ice-900` | `#0A1420` | Surface base |
| `ice-800` | `#101D2E` | Cards |
| `ice-700` | `#1A2B40` | Raised / hover |
| `ice-600` | `#273B54` | Borders strong |
| `ice-400` | `#577190` | Muted text |
| `ice-200` | `#B9C8DA` | Secondary text |
| `ice-50`  | `#EFF4FA` | Primary text on dark |
| `frost-400` | `#38BDF8` | **Accent** — primary actions, live states, focus |
| `frost-300` | `#7DD3FC` | Accent hover/glow |
| `clay-500` | `#C2410C` | Infield clay — destructive/negative, hot percentiles |
| `grass-500` | `#16A34A` | Positive, present, paid |
| `gold-400` | `#FACC15` | Rewards, achievements |
| `chalk` | `#F8FAFC` | Light-theme background (parent/player) |

Dark theme is default for owner/coach/HQ; parent and player surfaces use the light "Day Game" theme (same tokens, semantically flipped via CSS `data-theme`). Percentile ramp: `frost` (cold/low) → `clay` (hot/high) — the Savant idiom.

## 3. Typography

- **Display:** Barlow Condensed 500–700 — page titles, hero numbers, scoreboard moments. Uppercase + tracking for eyebrow labels.
- **Text:** Inter 400–700 — everything else. `font-variant-numeric: tabular-nums` on all stats, tables, counters.
- **Scale:** 12 (meta) / 14 (base) / 16 (section) / 20 (card title) / 24–32 (page title) / 48–64 (hero stat). Hierarchy via weight + color, not size sprawl.

## 4. Spacing, radius, elevation

- 4px base grid; component paddings 12/16/24; page gutters 16 (mobile) / 24 / 32.
- Radius: 6 (chips/inputs), 10 (cards), 16 (modals/feature cards), full (avatars/pills).
- Elevation: flat surfaces + 1px `ice-600`/15% borders; one soft shadow tier for popovers; glow (`frost` at 25%) only on primary CTAs and the login/Sneak Peek surfaces.

## 5. Iconography

lucide-react at 1.5px stroke, 16/20/24 sizes. Custom SVG glyphs on the same grid: frozen-rope mark, diamond, batting cage, home plate. Never emoji.

## 6. Motion

- UI transitions 150–250ms ease-out; page/role transitions 200–300ms fade+4px rise via `motion`.
- Count-up tickers on dashboard hero stats; 30–50ms staggered list/chart reveals — once per view.
- Springs reserved for drawers and the rep-logger dial. No animation on large tables. `prefers-reduced-motion`: all non-essential motion disabled.

## 7. Component inventory

Shell: `AppShell`, `Sidebar`, `TopBar`, `MobileTabBar`, `Breadcrumbs`, `RoleSwitcher`, `FacilityPicker`.
Primitives: `Card`, `StatCard` (hero + delta chip), `Badge`/`StatusChip` (icon+color), `Button` (primary/ghost/danger), `Input`, `Select`, `Tabs`, `Modal`, `Drawer`, `Toast`, `EmptyState`, `ProgressRing`.
Data: `DataTable` (sticky first column), `Sparkline` (SVG), `PercentileRow` (Savant-style), `SkillRadar` (Recharts), `TrendChart`, `ResourceTimeGrid` (cage scheduler), `CalendarWeek`, `AttendanceGrid`, `KanbanBoard`, `JourneyTimeline`, `VideoCard`, `MoneyDelta`.
Domain: `RockReadyScore`, `RepLogger`, `DrillCard`, `SessionNoteCard`, `MembershipTierCard`, `RegisterPad`, `WalletCard`, `CollegeFitCard`, `BoomAgenda`, `PipelineCard`, `BlueprintVariance`, `SimulatorSliders`.

## 8. Accessibility (WCAG 2.1 AA)

- Text contrast ≥4.5:1 (verified for all token pairs above), UI components ≥3:1.
- Visible `frost` focus ring on every interactive element; full keyboard paths incl. role picker, tabs, kanban, register.
- Status conveyed by icon + text + color (never color alone); `aria-label`s on icon buttons; landmarks (`nav`, `main`); chart data mirrored in accessible tables or labels.
- Touch targets ≥44px on mobile.

## 9. Responsive breakpoints

- `<768px`: bottom tab bar, single column, horizontal-scroll stat rows, calendar collapses to agenda list.
- `768–1024`: collapsed icon sidebar.
- `1024–1536`: full sidebar + 12-col content grid.
- `>1536` (ultrawide): content max-width 1600px centered; dashboards add a third column rather than stretching.
- Tested floor: 320px.

## 10. Signature moments (the award bits)

1. **Login** — "Who's stepping up to the plate?" persona cards over a dusk-field gradient with the frozen-rope streak animating across.
2. **Rock Ready hero** — count-up composite score inside a diamond-shaped progress ring.
3. **Percentile rows** — Savant-style bubbles sliding into place on load.
4. **Cage grid** — live "now" line sweeping the resource schedule.
5. **Sneak Peek** — scroll-driven tour ending in the Blueprint Simulator.
6. **Rewards** — gold ticker + subtle confetti burst on redemption (reduced-motion safe).
