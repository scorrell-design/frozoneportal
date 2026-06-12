# The Frozone — Baseball Operating System

> The operating system for baseball & softball training facilities, by Frozen Ropes.
> One login runs the building. One login develops the player. HQ sees the whole network.

**Live demo:** https://frozone-portal-demo.netlify.app
**Stack:** React 19 · Vite 7 · TypeScript (strict) · Tailwind CSS v4 · React Router 7 · Recharts · Netlify

<p>
  <img src="public/frozone-mark.svg" width="56" alt="Frozone mark" />
</p>

## What this is

Frozen Ropes has licensed its "how to run a baseball facility" system — the **Frozone** — as a Google Drive of spreadsheets, PDFs, and videos since 1990. This portal replaces it with a role-based operating system covering content, facility operations, player development, billing/POS, rewards, recruiting, and franchise HQ — built from founder transcripts (docs/00) and an exhaustive competitive teardown (docs/01).

## Demo guide — log in as anyone

The login screen is a persona picker; you can also switch personas any time from the top-bar avatar menu.

| Persona | Role | Start here |
|---|---|---|
| **Dana Whitfield** | Facility Owner (Dawsonville, GA) | The Blueprint (P&L vs. benchmarks), Frozone Library, POS register, cage grid |
| **Marcus Rivera** | Coach | 2:30 Batting Cage attendance, **coach-verified AI video review**, AI Drill Finder, session notes |
| **Tyler Whitman** | Player (12U) | Rock Ready score ring, **Quality Reps logger**, journey timeline, rewards |
| **Jess Whitman** | Parent | Progress + session notes feed, **wellness/workload guard**, booking, billing, Pro Shop, College Bound |
| **Tony Abbatine** | Frozen Ropes USA (HQ) | Network dashboard, content CMS, Membership Matrix, **license pipeline kanban**, Boom Calls |
| **Sneak Peek** | Prospective owner | Public pitch page with the **Blueprint Simulator** |

## Route map (abridged — full map in `docs/03-information-architecture.md`)

```
/                      Persona login
/sneak-peek            Public prospect surface + Blueprint Simulator
/owner                 Dashboard · /library[/:pillar|/resource/:id] · /blueprint · /members[/:id]
                       · /calendar · /pos · /staff · /rewards · /boom
/coach                 Today · /schedule · /classes/:id · /players[/:id] · /video · /notes · /drills
/player                Home · /development · /reps · /videos · /drills · /schedule · /journey · /rewards
/parent                Home · /progress · /wellness · /messages · /schedule · /billing · /shop · /recruiting
/hq                    Network · /facilities[/:id] · /content · /matrix · /pipeline · /boom · /rewards
```

Deep links work (Netlify SPA redirects); unauthorized routes redirect to the signed-in role's home.

## Local setup

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks (tsc -b) then builds to dist/
npm run lint
npm run preview
```

No environment variables are required — the demo runs entirely on a deterministic seeded dataset (`src/data/seed.ts`). Payment, video inference, and messaging integrations are mocked at their real call sites and labeled in-product ("Demo data").

## Deploying

```bash
netlify deploy --build --prod
```

`netlify.toml` sets the build command, `dist` publish dir, and the SPA catch-all redirect (also in `public/_redirects`).

## Documentation

| Doc | Contents |
|---|---|
| `docs/00-source-synthesis.md` | Transcript ingestion: personas, feature inventory, vocabulary, assumptions |
| `docs/01-research.md` | Competitor teardown matrix, gap analysis, tech & design research |
| `docs/02-prd.md` | PRD: epics, user stories, acceptance criteria |
| `docs/03-information-architecture.md` | Full sitemap + routing map with role access |
| `docs/04-design-system.md` | "Night Game" design system: tokens, type, motion, a11y |
| `docs/05-architecture.md` | Stack decision and source layout |
| `docs/06-innovation.md` | The six features competitors don't have |
| `docs/07-qa.md` | QA pass + Lighthouse results |
