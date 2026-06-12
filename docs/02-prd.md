# 02 — Product Requirements: The Frozone Portal

> Derived from `00-source-synthesis.md` (transcripts are ground truth) and `01-research.md` (informs, never overrides). This pass delivers a deployed, role-based demo portal with full seeded data — the artifact that (a) replaces Google Drive in spirit and shape, (b) serves as the Sneak Peek that sells licenses, and (c) aligns the team on full scope.

## 1. Product statement

**The Frozone** is the operating system for baseball/softball training facilities. One login runs the building (content, members, money, schedule, staff) and one login develops the player (evals, video, drills, quality reps, college path) — with HQ overseeing the whole network. The wedge competitors can't follow: 30+ years of curated Frozen Ropes curriculum fused with facility operations and player development in a single system.

## 2. Roles & demo logins

| Role | Demo identity | Lands on |
|---|---|---|
| Facility Owner | Dana Whitfield — Owner/GM, Frozen Ropes Dawsonville GA | `/owner` |
| Coach | Marcus Rivera — Lead Instructor, Dawsonville | `/coach` |
| Player | Tyler Whitman — 12U, "Prospect" member | `/player` |
| Parent | Jess Whitman — Tyler's mom, pays the bills | `/parent` |
| HQ Admin | Tony Abbatine — Frozen Ropes USA | `/hq` |
| Prospective Owner | Sneak Peek visitor | `/sneak-peek` |

Auth is a demo role selector (assumption #2 in doc 00): persona-card login screen, persistent role switcher in the top bar, role persisted to `localStorage`, route guards redirect unauthorized deep links to that role's home (or to login when signed out).

## 3. Epics, user stories & acceptance criteria

### E1 — Content Library ("replace Google Drive" — the #1 priority)
- **US1.1** As an owner, I browse resources by the Four Pillars (Instruction, Operations, Programs, Marketing) with type filters (video / PDF / spreadsheet / drill / lecture) and full-text search. *AC: pillar landing pages, search box filters live, every resource opens a detail view with preview, metadata, related items. No dead tiles.*
- **US1.2** As a coach, I search drills in plain language ("9-year-old late on fastballs") and get matched drills with confidence scores. *AC: AI Drill Finder returns ranked seeded results for canned + free queries; clearly labeled as AI-assisted; each result links to the drill.*
- **US1.3** As HQ, I manage the library (publish status, pillar assignment, usage analytics). *AC: CMS table with status toggles, per-resource view counts, "most/least used" sort.*

### E2 — The Blueprint (interactive operating doc)
- **US2.1** As an owner, I track my P&L against the Frozen Ropes Blueprint benchmarks (revenue lines, expense lines incl. equipment budgets like bats). *AC: monthly P&L vs benchmark with variance highlighting; category drill-in; 12 months seeded.*
- **US2.2** As a prospective owner, I model facility economics in the Sneak Peek. *AC: interactive sliders (members, cage rate, programs) → projected revenue/EBITDA from Blueprint multiples.*

### E3 — Rock Ready evaluation & development
- **US3.1** As a coach, I record evals across indexes (Strength Index, Grip Index + extended set, letter grades) and trend them. *AC: eval entry form (interactive), radar "shape of the athlete," Savant-style percentile rows, sparkline trends per index.*
- **US3.2** As a player/parent, I see scores, trends, and what to work on. *AC: player dashboard hero = composite Rock Ready score with delta; tap-through to per-index trends and coach comments.*
- **US3.3** As a player, I log **quality reps** (focus tag + self-rated quality), not just volume. *AC: rep logger writes to the session log; quality-vs-volume chart updates.*

### E4 — Video & hybrid AI review
- **US4.1** As a coach, I capture/review session video with an AI first pass that I confirm or reject before anyone else sees it. *AC: review queue with AI-flagged observations, per-observation Confirm/Dismiss, status flows Pending AI → Needs Coach Review → Shared; only "Shared" appears to parent/player.*
- **US4.2** As a parent/player, I watch shared session videos with coach-approved notes. *AC: video cards (placeholder players) with annotations timeline.*

### E5 — Membership & billing
- **US5.1** As an owner, I manage members against the Membership Matrix (tiers: Rookie / Prospect / All-Star / Franchise — assumption #4). *AC: member directory with tier, status, balance; member detail with billing history, stored balance, family links.*
- **US5.2** As a parent, I manage my plan, see invoices, and load stored balance ("give them $250"). *AC: billing screen with plan card, invoice list, balance top-up flow (mock Stripe, clearly stubbed-with-intent).*

### E6 — POS & Pro Shop
- **US6.1** As an owner/staff, I ring up sales (Pro Shop, concessions like Gatorade, cage time), against cash/card/stored balance/reward points. *AC: working register UI — product grid, cart, tender selection, receipt; transaction log updates.*
- **US6.2** As a parent/player, I shop the Pro Shop and redeem reward points. *AC: shop grid with points-or-dollars pricing; redemption decrements the wallet.*

### E7 — Scheduling & programs
- **US7.1** As an owner, I run the program calendar and cage/lane resource grid. *AC: week calendar of programs + resource time-grid (Cages 1–6) with booked/open/conflict states; clicking a class opens its roster.*
- **US7.2** As a parent, I book sessions/cage time. *AC: booking flow picks program → slot → confirm; appears in family schedule.*
- **US7.3** As a coach/player, I see my day at a glance. *AC: today list with times, locations (cage #), roster counts.*

### E8 — Attendance, staff & time tracking
- **US8.1** As a coach, I bulk-mark attendance for "the 2:30 batting cage class," and flag unpaid/no-cleats/not-allowed. *AC: roster grid with one-tap present/absent/late, payment-status badges, eligibility flags.*
- **US8.2** As an owner, I see staff clock-ins and hours. *AC: timeclock screen (coach) + staff hours report (owner).*

### E9 — Communication
- **US9.1** As a coach, I send structured session notes (what we worked on, homework, next focus). *AC: note composer with drill attachments; notes appear in parent/player feeds.*
- **US9.2** As a parent, I message the coach/facility. *AC: threaded messaging with seeded history; send appends to thread.*

### E10 — Rewards (Diamond Dollars)
- **US10.1** As a member family, I earn points on spend at any facility and redeem at any Pro Shop or online. *AC: wallet shows balance + earn history across locations; redemption works in shop/POS.*
- **US10.2** As HQ/owner, I configure earn rates and see liability. *AC: rewards admin with earn-rate matrix and outstanding-points report.*

### E11 — College Bound recruiting
- **US11.1** As a parent of an older player, I browse the D1/D2/D3 college database and get academic+athletic fit matches. *AC: searchable/filterable college table (division, region, academics, baseball profile) with fit scores from the player's Rock Ready + GPA profile; shortlist persists.*
- **US11.2** As a player, I see my cradle-to-grave journey from Born to Play to College Bound. *AC: journey timeline with completed/current/future milestones.*

### E12 — HQ network operations
- **US12.1** As HQ, I see network health across all 9 facilities. *AC: network dashboard — revenue, membership, utilization, Rock Ready participation per facility; map/list of facilities; facility drill-in.*
- **US12.2** As HQ, I run the license pipeline and Sneak Peek invites. *AC: pipeline kanban (Lead → Toured → Sneak Peek sent → Committed), prospect detail with activity.*
- **US12.3** As HQ, I run Boom calls. *AC: Boom hub — next call agenda builder, past-call library with recordings (placeholder) and shared best practices.*

### E13 — Wellness & workload (parent priority from T2)
- **US13.1** As a parent, I track health/sleep/nutrition/workload and see over-training warnings. *AC: wellness screen with weekly inputs, workload vs guideline chart, "quality over quantity" indicator.*

### E14 — Sneak Peek (prospect surface)
- **US14.1** As a prospect, I get a cinematic guided tour: the story, the OS, the economics (Blueprint simulator), credibility, and a "request your invite" CTA. *AC: public route, premium scroll experience, working simulator, CTA captures interest (mock).*

## 4. Prioritization

Everything above ships **in this pass** as interactive UI on seeded data. **Stubbed-with-intent** (mock boundary, real UI): Stripe charges, real video upload/AI inference, live streaming integration (we link out — research shows GameChanger owns game day; we interop, not replicate), email/SMS delivery, real auth. Each stub is visibly labeled in-product where honesty matters (e.g., "Demo data").

## 5. Non-functional requirements

- WCAG 2.1 AA: contrast, focus states, keyboard nav, reduced-motion support.
- Responsive 320px → ultrawide; nav collapses to bottom-bar/drawer on mobile.
- Lighthouse targets ≥90 across the board.
- No console errors; no dead links; every route reachable from nav or an in-page link.
- Under-18 sensitivity: player surfaces show coach-approved content only; messaging is parent-mediated (research: COPPA-aware design is a differentiator).
