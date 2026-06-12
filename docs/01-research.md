# 01 — Competitive & Technology Research

> Full-method research conducted 2026-06-12 across three streams: team/league management, training-tech & facility software, and design/technology benchmarks. Sources cited inline. Conclusions feed the PRD (doc 02) and design system (doc 04). Transcripts remain ground truth.

## 1. Competitor teardown matrix

Legend: ● full, ◐ partial, — none.

| Capability | GameChanger | TeamSnap | SportsEngine | LeagueApps | Upper Hand | EZFacility | Hudl | Rapsodo/TrackMan/DK | PG / PBR | Futures App | **Frozone** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Facility scheduling (cages/lanes) | — | — | — | ◐ | ● | ● | — | — | — | ◐ | ● |
| Memberships & recurring billing | — | ◐ | ◐ | ● | ● | ● | — | — | — | ◐ | ● |
| POS / Pro Shop retail | — | — | — | — | ● | ◐ | — | — | — | — | ● |
| Curriculum / content library | — | ◐ | — | — | — | — | — | — | — | ◐ | ● |
| Player evals & development tracking | — | — | — | — | — | — | ◐ | ● (device) | ◐ (event) | ● | ● |
| Training video + annotation | — | — | — | — | — | — | ● | ◐ | ◐ | ● | ● |
| Coach→parent session notes | — | — | — | — | — | — | — | — | — | ◐ | ● |
| Rewards / loyalty | — | — | — | — | — | — | — | ◐ (DK gamif.) | — | — | ● |
| College recruiting guidance | — | — | — | — | — | — | ◐ | — | ● (pay-to-play) | — | ● |
| Multi-facility / franchise HQ | — | — | ◐ | ◐ | ◐ | ◐ | — | — | — | — | ● |
| Wellness / workload | — | — | — | — | — | — | — | — | — | ◐ | ● |

### Key competitor findings (condensed; full citations in the research transcripts)

- **GameChanger** (free for coaches; parents pay $9.99/mo–$39.99/yr to stream) owns game day for youth baseball. Billing/support rated ~2.0/5 on PissedConsumer. Even fans note "zero development tools" (mindandmuscle.ai/best-baseball-team-apps). **Verdict: interoperate, don't fight.** (gc.com/pricing/team-pass, gamechanger.pissedconsumer.com)
- **TeamSnap** ($9.99–$17.99/mo *per team*) — per-team fee stacking is the top complaint; no POS/membership/curriculum. (teamsnap.com/pricing, capterra.com/p/123208)
- **SportsEngine** — clunky app ("takes forever to load," deletes drafts) and a class-action over hidden checkout fees. Easiest incumbent to beat on UX + pricing transparency. (appsupports.co/499597400, injuryclaims.com)
- **LeagueApps** — closest team-cluster competitor (sells to academies/camps/classes) but it's a registration/money layer with a resented ~5%+ take rate. (leagueapps.com/pricing, softwareadvice.com)
- **Upper Hand** — **the one to beat on ops**: scheduling, memberships, POS, staff; powers D-BAT (largest baseball academy franchise). $79–$219/mo + onboarding. Complaints: inflexible reporting, parent-vs-participant profile confusion ("number one headache"), painful recurring-class setup. **No curriculum, no development tracking, no video.** (upperhand.com/baseball-facility-software, capterra.com/p/151570)
- **EZFacility** — legacy baseball-facility incumbent; "brutally slow and clunky," price creep, **data-export lock-in** (export charged or impossible). Migration wedge. (ezfacility.com, runswiftapp.com/blog/ezfacility-review)
- **Hudl** — owns team film ($400–$1,600/team/yr); 2025 storage-quota change + price hikes triggered open coach revolt. Opening for facility-included video. (hudl.com/pricing/club, footballscoop.com 2025-03-04)
- **TrackMan / Rapsodo / Diamond Kinetics** — measurement devices with subscription layers (TrackMan B1 ~$18–20k + $2k/yr; Rapsodo ~$3.5–4.5k + mandatory $500–$1,500/yr membership; DK+ $55/yr). All are data silos with zero facility management. **Ingest their data; become the system of record.** (trackman.com, rapsodo.com, diamondkinetics.com/membership)
- **Perfect Game / PBR** — pay-to-play showcase machines ($250–$1,000/event; PG FULL ACCESS $799.99/yr) with documented parent resentment (Passan: "profits off teenage boys and glory-hungry parents"). PBR's Capacity Sports Group (~150 diamonds by end-2026) is becoming a facility operator — watch it. (metroleague.org, thegazette.com, prepbaseballreport.com/news)
- **The Futures App** — the only product claiming curriculum + ops + development; team-side roots, weak ops layer, opaque pricing. Validates the category; doesn't own it. (thefuturesapp.com)
- **AI video (Sportsbox AI, OnForm, Mustard)** — the trust pattern is settled: products that win route AI through a human coach (OnForm's model); consumer AI verdicts earn "get a real pitching coach" forum reactions and "scam" reviews (Mustard). This independently confirms the T2 parent interview. (onform.com/pricing, justuseapp.com Mustard reviews)
- **Kicksite** (martial arts, $49–$199/mo) — belt-rank progression fused with billing and parent visibility is the proven "curriculum milestones + ops" model. Rock Ready levels are baseball's belts. (kicksite.com/pricing)

## 2. Gap analysis → Frozone's exploitable white space

1. **The full stack is unowned.** Curriculum + ops + development + parent comms in one facility-owner product does not exist. This is exactly what the transcripts describe ("soup to nuts"), and it's defensible because the curriculum moat — 30 years of Frozen Ropes IP — can't be replicated by an ops vendor (T1 00:15:31: "We have the curated curriculum… the credibility that the AI tech people cannot do").
2. **Subscription fatigue.** Families stack GameChanger + Rapsodo + DK + Hudl + PG/PBR fees. *One facility membership, everything included* attacks the dominant complaint in every cluster.
3. **Coach-mediated AI.** AI flags → the facility's coach confirms → the parent hears it from a human inside the same channel. Matches T2 verbatim and the market evidence.
4. **Lock-in resentment.** EZFacility export charges, Mindbody escalation, Hudl quotas, LeagueApps rake. Transparent flat pricing + free data export is a sales weapon for license conversion.
5. **Anti-showcase recruiting.** Longitudinal, facility-verified Rock Ready data answering "is your kid ready before you pay PG $750?" monetizes documented resentment — and feeds the College Bound program.
6. **Belt-rank mechanics for baseball.** Kicksite proves progression-tier + billing fusion; nobody has applied it to baseball development.
7. **Under-18 trust design.** Only BAND has a visible minors policy. Parent-mediated comms and coach-approved content are differentiators, not constraints.
8. **Reliability bar is on the floor.** SportsEngine and GameChanger's worst reviews are about basics. "It just works and a human answers" wins this market.

## 3. Technology recommendations (adopted in doc 05)

- **React 19 + Vite 7 + TypeScript strict + Tailwind v4** — SPA; no SSR need for a role-gated demo portal (SEO surface is the Sneak Peek only). Netlify-native.
- **React Router v7, declarative mode** — layout route per role with guard components; framework mode buys nothing here. (reactrouter.com/start/modes)
- **Charts: bespoke SVG for signature pieces** (Savant-style percentile rows, radar, sparklines, field motifs) + **Recharts** for commodity line/bar. (blog.logrocket.com/best-react-chart-libraries-2026)
- **motion** (successor to framer-motion) for entrances/number tickers/route transitions; CSS for hover micro-states. (motion.dev/docs/react)
- **lucide-react** icons + a few custom baseball glyphs on the same 24px/1.5px grid.
- **Netlify SPA config:** `_redirects` (`/* /index.html 200`) in `public/` **and** `netlify.toml` redirect — the missing-`_redirects` deep-link 404 is the #1 deploy gotcha. (docs.netlify.com/manage/routing/redirects)
- **State:** React context + seeded in-memory stores with localStorage persistence for demo mutations. No server.

## 4. What "award-winning" means for Frozone (design brief)

From Awwwards-tier SaaS (Linear, Stripe, Vercel), Whoop, and MLB's own products (Baseball Savant, Film Room):

1. **Dark-first "night game" shell** — deep navy/charcoal base, one hot accent reserved for primary actions and live/positive states. Operator surfaces (owner/coach/HQ) dark; parent/player surfaces get a true light theme, not inverted tokens.
2. **Scoreboard typography** — condensed display face (Barlow Condensed) for titles and big numbers + Inter with `tabular-nums` for every stat. A tight scale (12/14/16/20/24 + one 48–64 hero size); hierarchy from weight and color, not size sprawl.
3. **One hero metric per dashboard** ("is everything okay?" number), then progressive disclosure — Stripe/Vercel pattern.
4. **Savant percentile sliders as the signature eval viz** — blue→red percentile bubbles per metric; instantly legible to baseball parents because MLB taught them the idiom. Radar for "shape of the athlete," percentile rows for truth.
5. **Whoop's score-first model** for player development: one composite Rock Ready score → trend → drill-down; the score *is* the guidance.
6. **Motion discipline:** 150–250ms ease-out for UI; springs only for "physical" objects; count-up tickers and 30–50ms staggered reveals once per view; `prefers-reduced-motion` honored.
7. **Resource time-grid** (rows = Cages 1–6, columns = time) for scheduling; sticky-first-column attendance matrices.
8. **Empty states as coaching moments** — positive imperative + one action + baseball-authentic illustration (field at dusk, not a clipboard).
9. **Status chips with icon + color, never color alone** (booked/open/conflict; present/absent/late; paid/unpaid).
10. **Glass/gradient restraint:** craft spent on login/Sneak Peek; flat surfaces + 1px borders inside the app.
11. **Component consolidation before screen one** (Hudl's Uniform lesson: cohesion *is* the redesign) — tokens for color/radius/spacing/elevation defined once in doc 04.
12. **Field-diagram motif** as the brand's visual signature in nav, empty states, and the Sneak Peek.
