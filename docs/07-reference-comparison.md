# 07 — Reference Comparison: dested/frozone vs. The Frozone Portal

> Read-only analysis of https://github.com/dested/frozone (cloned to a temp dir, never modified)
> conducted 2026-06-12. Two full-stack apps (`web`, `frozone-academy`) plus ~4,000 lines of
> product specs (PITCH.md, BIBLE.md, ACADEMY.md, FROZONE-PORTAL-PLAN.md) were reviewed.

## 1. What the reference repo is

| App | What it is | Infrastructure |
|---|---|---|
| `web` | Public consumer marketing site (frozenropes.com replacement: programs, locations, founder credibility, news, licensing pitch) + owner-facing "Frozen Ropes OS" admin demo + Academy content surface | TanStack Start, Postgres + Drizzle, better-auth (real), tRPC, real lead-capture write, real Anthropic "Talk to Tony" chat over a 55 GB corpus with playable video + click-to-seek transcripts |
| `frozone-academy` | Licensee portal (4-pillar content library, Rock Ready eval intake, Blueprint P&L calculator, AI tutor) + HQ CMS (drill/lecture/video/resource editors, publish workflow, ingest triage, prospect CRM) | Prisma + Postgres, role-gated tenancy (owner/gm/instructor/csr/hq), Mux video, R2 storage, OpenAI Responses + Realtime voice |

The specs go much further than either app: AI session recaps, practice-plan composer, video
intelligence roadmap, next-best-action engine, business copilot, athlete timeline, development
heatmap, facility TV mode, travel teams, marketplace, multi-tenant franchise inheritance.

Their build philosophy is **content-infrastructure-first**: corpus → manifest → VibeVoice
transcription (speaker diarization) → Mux/R2 ingest → HQ publish workflow → RAG grounding.
Everything user-facing sits on that spine.

## 2. Gaps in our portal (what to adopt)

### Strategic
1. **No public surface.** They treat the consumer site + license funnel as the front door; we have
   a login screen and a Sneak Peek. Their apply → lead → HQ pipeline (with activity log) is a
   complete loop; our pipeline kanban has no intake.
2. **Content is simulated.** No playable media, no transcripts, no draft/publish lifecycle beyond
   a toggle. Their CMS + ingest-triage queue is the real "replace Google Drive" answer.
3. **AI is a garnish, not the moat.** Their working pattern: curriculum-grounded chat with inline
   citations and tool calls, plus a voice tutor (OpenAI Realtime, ephemeral session keys, role-
   scoped tools, usage caps). Ours: canned presets and mocked observations.
4. **No auth/tenancy model.** They gate routes by org membership + role enums; we have a persona
   picker (fine for demo, but the model should exist in types).

### Feature-level (adoptable as demo surfaces)
5. **Blueprint calculator depth** — theirs: 26 program lines, 19 expense lines, 3-year ramp,
   breakeven curve, sensitivity analysis, scenario persistence attached to the lead. Ours is a
   teaser. Highest-value gap: it is the license-sales weapon.
6. **Operations accountability pillar** — QA flag inbox, POS anomaly feed, EOD reports, checklist
   sign-offs, staff review profiles. Their plan makes this one third of the product ("stop the
   leak"); we have a register and a timeclock with no accountability loop.
7. **Booking + check-in flow** — resource-grid schedule with booking drawer; front-desk check-in
   board. Our calendar is view-only.
8. **Global library search** — single search across all content types (they laid FTS + pgvector
   groundwork). Ours is per-page client filtering.
9. **BOOM scorecard** — the 64-point monthly grid as a living, color-coded scorecard with call
   digests ("the 5 minutes that mattered"). We only list calls.
10. **Lecture chapters + transcripts**, waiver-coverage compliance grid, travel teams,
    campaigns/referrals/social ("grow") tools.

### What ours has that theirs doesn't
They built no player, parent, or coach experience. Our wellness/workload guard, quality reps,
coach-verified AI video review, session-notes loop, cross-location rewards, College Bound
matching, and the journey timeline exist nowhere in their repo. Six-persona breadth remains our
differentiation; their depth is owner/licensee operations + content infrastructure.

## 3. Design comparison

| Axis | Theirs | Ours (before redesign) |
|---|---|---|
| Mode | Light-first: warm paper/cream `oklch(0.97 0.012 75)`, bone cards | Dark "Night Game" navy |
| Text | Charcoal ink `oklch(0.22 0.012 60)` | Ice-white on dark |
| Accent | One: rope red-orange `oklch(0.58 0.20 30)` (~#DC4A2E) | Neon frost blue + glows |
| Type | Inter body; Source Serif 4 / Bebas Neue display; JetBrains Mono stats | Barlow Condensed uppercase everywhere |
| Chrome | Charcoal/ink sidebar over paper content; eyebrow + hairline rule; seam dividers | Dark sidebar on dark |
| Shadows | shadow-sm, hover-only md; square CTAs | Glow shadows, blur, gradients |

Verdict: their system reads as a designed editorial product; ours reads as an AI dark-mode
template. The redesign (doc 04 v2, "Day Game") adopts the *discipline* — light surfaces, one
accent, semantic-only status colors, type hierarchy by weight, no decorative effects — while
keeping our own brand accent (deep frost blue, not their rope red) and our baseball signatures
(diamond ring, percentile rows, rope mark).

## 4. Redesign principles (every element has a reason)

1. **Warm paper bg + white cards + charcoal text** — content reads first; separation by 1px
   border and a faint shadow, not glow. Brightness comes from the surface.
2. **One accent (deep frost blue)** — actions, links, active states only; dark enough for WCAG AA
   on white. Stays on the "Frozen" brand.
3. **Semantic-only status colors** — green = positive/paid, red-clay = negative/due,
   amber-gold = rewards. Color always means something; never decoration.
4. **Type discipline** — Inter for everything readable. Barlow Condensed restricted to scoreboard
   numerals and eyebrow labels. Headings mixed-case (uppercase-condensed-everywhere is the
   template smell).
5. **Ink sidebar over paper content** — nav recedes, content gets the light; retains a trace of
   the night-game brand.
6. **Motion only where it informs** — KPI count-ups, one entrance rise. No glows, no decorative
   animation. `prefers-reduced-motion` respected.
