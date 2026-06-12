# 03 — Information Architecture & Routing Map

Six roles, each with a guarded layout route, role-scoped navigation, and a purpose-built home. A single `NAV_CONFIG` drives nav rendering, route registration, and guards (one source of truth). Deep links into another role's surface redirect to the signed-in role's home; signed-out deep links redirect to `/` (login) — after login the user lands on their role home.

## Public routes

| Route | Purpose |
|---|---|
| `/` | Persona-picker login ("Who's stepping up to the plate?") — 6 persona cards |
| `/sneak-peek` | Prospect surface: cinematic tour, Blueprint Simulator, credibility, invite CTA |
| `*` | 404 → styled "foul ball" page with route-home link |

## Owner — `/owner` (Dana Whitfield, Dawsonville)

| Route | Screen | Notes |
|---|---|---|
| `/owner` | Facility dashboard | Utilization hero, today's revenue, schedule, alerts (unpaid, low stock, expiring memberships) |
| `/owner/library` | Frozone Library home | Four Pillars + search + recents |
| `/owner/library/:pillar` | Pillar browse | `instruction` / `operations` / `programs` / `marketing`; type filters |
| `/owner/library/resource/:id` | Resource detail | Preview, metadata, related resources |
| `/owner/blueprint` | The Blueprint | P&L vs benchmark, variance, category drill-in, equipment budgets |
| `/owner/members` | Member directory | Tier/status/balance; search + filters |
| `/owner/members/:id` | Member detail | Profile, family, billing history, stored balance, Rock Ready summary, rewards |
| `/owner/calendar` | Programs & cages | Week program calendar + cage resource grid; class click-through to roster |
| `/owner/pos` | Point of Sale | Register (products/cart/tender), transactions log, product catalog tabs |
| `/owner/staff` | Staff & timeclock | Roster, clock-in status, hours report |
| `/owner/rewards` | Rewards admin | Earn rates, outstanding points liability, redemption log |
| `/owner/boom` | Boom Calls | Next agenda, past calls, best-practice library |

## Coach — `/coach` (Marcus Rivera)

| Route | Screen | Notes |
|---|---|---|
| `/coach` | Coach dashboard | Today's sessions, review queue count, clock-in card |
| `/coach/schedule` | My schedule | Week view of assigned classes/lessons |
| `/coach/classes/:id` | Class roster & attendance | Bulk present/absent/late; unpaid & eligibility flags ("Is this kid allowed? Does he have cleats?") |
| `/coach/players` | My players | Sortable grid w/ Rock Ready sparklines |
| `/coach/players/:id` | Player development | Radar, percentile rows, trends, eval entry, video, notes history |
| `/coach/video` | Video review queue | Hybrid AI: AI observations → coach Confirm/Dismiss → share |
| `/coach/notes` | Session notes | Composer (focus, homework drills, next steps) + sent history |
| `/coach/drills` | Drill library + AI Drill Finder | Instruction pillar + natural-language search |

## Player — `/player` (Tyler Whitman, 12U)

| Route | Screen | Notes |
|---|---|---|
| `/player` | Player dashboard | Rock Ready composite hero w/ delta, streak, next session, homework |
| `/player/development` | My development | Index trends, eval history, coach comments |
| `/player/reps` | Quality reps log | Log reps w/ focus + quality; quality-vs-volume chart |
| `/player/videos` | My videos | Shared (coach-approved) session clips w/ annotations |
| `/player/drills` | My drills | Assigned homework; mark complete |
| `/player/schedule` | My schedule | Upcoming sessions |
| `/player/journey` | My journey | Born to Play → College Bound timeline |
| `/player/rewards` | My rewards | Points balance, earn history, shop link |

## Parent — `/parent` (Jess Whitman)

| Route | Screen | Notes |
|---|---|---|
| `/parent` | Family dashboard | Tyler summary card, latest session note, next booking, balance |
| `/parent/progress` | Tyler's progress | Development view + session notes feed (parent lens) |
| `/parent/wellness` | Wellness & workload | Sleep/nutrition/workload inputs, over-training guard, quality-over-quantity |
| `/parent/messages` | Messages | Threads w/ coach + facility; send works |
| `/parent/schedule` | Schedule & booking | Family calendar + book program/cage flow |
| `/parent/billing` | Billing & membership | Plan (matrix tier), invoices, stored balance top-up (mock Stripe) |
| `/parent/shop` | Pro Shop | Dollars-or-points purchase; cross-location rewards wallet |
| `/parent/recruiting` | College Bound | D1/D2/D3 database, fit scores, shortlist |

## HQ — `/hq` (Tony Abbatine, Frozen Ropes USA)

| Route | Screen | Notes |
|---|---|---|
| `/hq` | Network dashboard | 9 facilities: revenue, members, utilization, Rock Ready participation |
| `/hq/facilities` | Facilities | List/map of network |
| `/hq/facilities/:id` | Facility detail | KPIs, staff, programs, Blueprint compliance |
| `/hq/content` | Content CMS | Library management, publish status, usage analytics |
| `/hq/matrix` | Membership Matrix | Tier manager (Rookie/Prospect/All-Star/Franchise) |
| `/hq/pipeline` | License pipeline | Kanban: Lead → Toured → Sneak Peek → Committed; prospect detail drawer |
| `/hq/boom` | Boom Calls admin | Agenda builder, call library, testimonials |
| `/hq/rewards` | Network rewards | Cross-location config + liability rollup |

## Navigation rules

- **Desktop:** fixed left sidebar (role-scoped items + role badge + facility context), top bar with search, role switcher, notifications.
- **Mobile (<768px):** bottom tab bar (4–5 top destinations per role) + "More" sheet; top bar collapses.
- **Breadcrumbs** on all detail routes (e.g., Library / Instruction / Rotational Hitting Drills).
- **Active states** exact-match for home, prefix-match for sections.
- **HQ tenant switcher:** facility selector in top bar re-scopes HQ detail views.
- **Unauthorized access:** `/coach/*` while logged in as parent → redirect `/parent` with toast. Unknown route → 404 page.
- Every screen reachable in ≤2 clicks from its role home; every entity name (member, player, class, resource, facility) is a link.
