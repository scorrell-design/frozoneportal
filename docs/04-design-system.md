# 04 — Design System: "Day Game" (v2)

> v1 ("Night Game") shipped a dark control-room theme. v2 replaces it after a competitive
> design audit (see `07-reference-comparison.md`): bright, editorial, single-accent — a
> ballpark on a clear morning, not a template dark mode. Every element below exists for a
> stated reason; anything that can't justify itself gets cut.

## 1. Brand

- **Name in product:** The Frozone (the OS), by Frozen Ropes.
- **Mark:** a frozen rope — the flat line-drive — a horizontal streak crossing a diamond
  outline. The rope inherits `currentColor` so the mark works on the ink sidebar (white)
  and paper surfaces (charcoal) without variants.
- **Voice:** confident coach. Short imperatives. Baseball vocabulary used precisely, never
  as decoration.

## 2. Color tokens (Tailwind v4 `@theme`)

The neutral ramp keeps its v1 names with inverted values — pages were written against the
dark theme, so flipping values inside the tokens relit every screen without rewriting 46
pages. Names now read as *roles*, not lightness.

| Token | Value | Role |
|---|---|---|
| `ice-950` | `#FAF9F7` | Page background — warm paper |
| `ice-900` | `#F4F2EE` | Inset surfaces, tab rails |
| `ice-850/800` | `#FFFFFF` | Cards, modals, menus |
| `ice-700` | `#F0EDE8` | Hover, progress tracks |
| `ice-600/500` | `#A8A094` / `#8D8578` | Borders (usually at /40 alpha), dim icons |
| `ice-400` | `#6F6759` | Muted text (AA on white) |
| `ice-300…50` | → `#211D17` | Secondary → primary charcoal text |
| `frost-400/300` | `#0369A1` | **The one accent.** Actions, links, active states. AA as text on white |
| `frost-500` | `#075985` | Accent hover/pressed |
| `grass-500/400` | `#15803D` / `#166534` | Semantic only: positive, present, paid |
| `clay-500/300` | `#C2410C` / `#9A3412` | Semantic only: negative, due, hot percentiles |
| `gold-400/300` | `#B45309` / `#92400E` | Semantic only: rewards, achievements |
| `ink-950…700` | `#101826` → `#2A3A52` | The dark exception: sidebar rail, video chrome, scrims |

**Why one accent:** when blue can only mean "act here," scanning is effortless. Status
colors never decorate — green always means good, clay always means attention, gold always
means reward. Percentile ramp stays blue→red (the Savant idiom — Savant itself is light).

**Why the ink rail:** navigation recedes into a dark column so content gets all the light;
it also keeps a trace of the brand's night-game heritage.

## 3. Typography

- **Inter 400–700** — everything readable. `tabular-nums` on all stats, tables, counters.
- **Barlow Condensed 500–700** — demoted to exactly three jobs: page titles (mixed case),
  scoreboard numerals, and `eyebrow` labels. The eyebrow (11px, +0.18em tracking) is the
  *only* uppercase device in the product — wall-to-wall uppercase condensed type is the #1
  AI-template smell, so card titles are now Inter 600 mixed case.
- **Scale:** 12 / 14 / 16 / 15 (card title) / 32 (page title) / 48–64 (hero stat).
  Hierarchy via weight and color, not size sprawl.

## 4. Spacing, radius, elevation

- 4px grid; component paddings 12/16/24; page gutters 16/24/32.
- Radius: 6 (chips/inputs), 10 (cards), 16 (modals/feature cards), full (avatars/pills).
- Elevation is honest: cards = 1px warm border + `shadow-xs`; popovers/modals = `shadow-lg/xl`.
  **No glows anywhere.** Separation comes from borders and the paper/white contrast, which is
  why the background is warm paper rather than pure white.
- Scrims: `ink-950/35` + 2px blur — dark enough to focus, light enough to stay "day."

## 5. Iconography

lucide-react at default stroke, 16/20/24. Custom SVGs (rope mark, diamond ring) on the same
grid. Never emoji.

## 6. Motion

Motion only where it informs: count-ups on KPI heroes (the number arriving *is* the
information), one 280ms entrance rise per view with ≤60ms stagger, springs only on the
percentile bubbles. No looping, no decorative animation. `prefers-reduced-motion` zeroes
everything.

## 7. Component inventory

Unchanged from v1 (see git history) — the redesign deliberately changed *clothes, not
bones*: Shell (`AppShell`, role switcher, mobile tab bar), primitives (`Card`, `StatCard`,
`Chip`, `Button` primary/ghost/danger/gold, `Tabs`, `Modal`, `Toast`, `EmptyState`), data
(`Sparkline`, `PercentileRow`, `SkillRadar`, `TrendChart`, calendar/kanban/journey grids),
domain (`RockReadyRing`, `RepLogger`, register pad, Blueprint sliders).

## 8. Accessibility (WCAG 2.1 AA)

- All text tokens ≥4.5:1 on their surfaces (accents were darkened specifically so colored
  *text* passes, not just colored fills); UI components ≥3:1.
- Visible frost focus ring on every interactive element; status = icon + text + color;
  `aria-label`s on icon buttons; touch targets ≥44px.

## 9. Responsive breakpoints

Unchanged: bottom tab bar <768, full sidebar ≥768 (`w-60` ink rail), content max 1600px on
ultrawide, 320px floor.

## 10. Signature moments

1. **Login** — persona cards on paper with a faint field-geometry line drawing; the frozen
   rope draws itself once across the sky. Bright, quiet, unmistakably baseball.
2. **Rock Ready hero** — count-up composite inside the diamond progress ring (glow removed;
   the moving number is the moment).
3. **Percentile rows** — Savant bubbles sliding into place, deep-saturation ramp for white.
4. **Cage grid** — live "now" line sweeping the day's schedule.
5. **Sneak Peek** — morning-sky hero into the Blueprint Simulator.
6. **Ink rail** — the one dark element; the product's silhouette.
