# 00 — Source Synthesis: Transcripts & Notes Ingestion

> **Sources ingested (the full corpus provided):**
> - **T1** — Transcript #1, 2026-06-11 kickoff call: Tony (Frozen Ropes), Sal (engineering, Clever/317 Ventures), Stephanie (product/UX), + Sal↔Stephanie debrief at the end.
> - **N1** — Meeting notes for T1 (AI-generated summary + action items).
> - **T2** — Transcript #2: Stephanie's user-research call with a former pro player who is the parent of a serious 8-year-old player (the "parent persona" interview).
> - **N2** — Product-discovery synthesis of T2.
>
> **Citation convention:** `(T1 00:07:26)` = transcript 1 at that timestamp. Transcripts are ground truth; where research conflicts with them, transcripts win.

---

## 1. What Frozone is

Frozen Ropes is a ~30-year-old baseball/softball training brand ("since nineteen ninety" — T1 00:28:57) with roughly nine licensed facilities (T1 00:42:50 "I think he has nine of them") spanning at least San Diego, Dallas, New York, Boston (T1 00:24:39), plus a brand-new location in Dawsonville, Georgia (T1 00:28:57). HQ — **Frozen Ropes USA** — licenses a complete "how to run a baseball/softball facility" system for ~$50–100k/year (T1 00:31:58: "licenses this to the facilities for… fifty thousand dollars a year… Then he bills him a hundred grand").

Today that system is "a very antiquated Frozone series of documents and Excel spreadsheets and a plethora of videos" living in Google Drive (T1 00:07:26, 00:31:58). Owners describe it as "old, antiquated, can't find anything, and it's in desperate need of x" (T1 00:28:57).

**The Frozone** is the replacement: a web portal / dashboard that "basically will run the facility. From marketing to operations to programming, to evaluations… soup to nuts" (T1 00:07:26–00:08:24). The end-game is a full **baseball operating system** that takes retail/credit-card transactions in-house and displaces the incumbent third-party vendor **Baseline** (T1 00:06:45–00:07:26, 00:11:09–00:12:10), and that is big enough to be an investable, VC-grade "operating system… It has to be big" (T1 00:36:42).

**Highest priority, verbatim:** "Content. We have to replace Google Drive. If we don't replace Google Drive, we've done nothing." (T1 00:38:10)

**Dual purpose:** (a) enhance existing facilities for free to make long-time owners happy, and (b) serve as the **sales pitch / sneak peek** that convinces prospective owners to "write a check" for a license (T1 00:09:21–00:10:31, 00:42:50–00:43:15).

---

## 2. Personas (extracted, with evidence)

The four explicitly enumerated personas (T1 00:33:27–00:34:40, N1) plus two implied by the material:

### P1 — Facility Owner / Operator ("Center" / "Academy" owner)
- **Who:** Licensees. Ranges from veterans running facilities since the '90s to brand-new owners with zero industry experience — e.g., the Dawsonville couple: "She's in HR, he's a high-end medical supply product guy… corporate America… 'We want to own our own business'" (T1 00:28:57). "We've got a lot of owners that have never really run a facility before" (T1 00:09:21).
- **Goals:** Run a profitable facility end-to-end; follow the proven Frozen Ropes playbook; track P&L against the Blueprint; manage members, programs, staff, POS.
- **Pains:** Google Drive chaos ("can't find anything"); no operational tooling; spreadsheets for budgets ("Blueprints on how much money they should spend on bats and everything" — T1 00:31:58).
- **Jobs to be done:** find the right resource fast; know what to do next to run the business; see money in/out; manage memberships and the program calendar; run the Rock Ready evaluation program.

### P2 — Coach (facility employee)
- **Who:** Employed by facilities (T1 00:34:40–00:34:49).
- **Goals/JTBD:** "high level access… bulk mark kids as there" (attendance); know "how many kids are supposed to be in the two thirty batting cage class. And how many didn't show up and how many didn't pay? Is this kid allowed? And does he have cleats?" (T1 00:34:49–00:35:20); take iPad video of a kid on the field, play it back with AI recommendations (T1 00:32:55); write session notes back to parents — "what are the details from that session? What are they working on? What should I be doing after we get home?" (T1 00:35:21–00:35:55); time tracking — "They have to know when the coach logs in" (T1 00:34:49).
- **Pain:** fragmented tools (iPhones + GameChanger notes — T2 00:05:35); no structured way to communicate development back to the paying parent.

### P3 — Player / Member
- **Who:** "almost exclusively kids, almost exclusively under eighteen" (T1 00:33:54), from the **Born to Play** three-year-old class through the **College Bound** recruiting program — "cradle to grave" (T1 00:16:26).
- **Goals/JTBD:** get better; see their videos and drills; track Rock Ready scores and trends; earn rewards; (older players) navigate the college path.
- **Pain (via parent proxy):** quantity-over-quality practice — "they don't necessarily work on… perfecting their craft" (T2 00:06:46).

### P4 — Parent
- **Who:** The actual payer: "the kid's not paying anything. It's the parents paying the hundred dollars" (T1 00:34:08).
- **Goals/JTBD (from the T2 interview):** one place instead of a patchwork — today it's GameChanger for streaming/communication plus iPhones for video plus nothing for the rest (T2 00:05:35–00:06:22, N2); track **health, sleep, eating, the right trainers, not overworking** — "quality reps instead of just quantity reps" (T2 00:06:46); see session details and what to practice at home (T1 00:35:21); message the coach/facility; book and pay; shop; college guidance ("Parents and families are paying a big dollar amount… to navigate the college selection process" — T1 00:15:31).
- **Critical constraint:** distrust of AI-only coaching — "I don't trust AI as much as I would someone that's a biomechanics coach… You'd probably have to bring on coaches as well. AI is great for certain things, but it's not good for other things." (T2 00:09:28). Any AI feature must be **hybrid, human-validated** (N2's "Strategic Risk").

### P5 — HQ Admin (Frozen Ropes USA)
- **Who:** Tony, brother Stephen (built the original Frozone, ran the Boston facility ten years — T1 00:23:10), GM in New York.
- **Goals/JTBD:** author and curate the content library (the CMS — T1 00:41:05); oversee all facilities; run **Boom calls** — monthly all-owner best-practice calls, "Boom standing for Business Operations, Organization and Marketing" (T1 00:25:35); manage the **membership matrix** (T1 00:12:27, 00:24:39); run the license-sales funnel and the **sneak peek** for prospects (T1 00:09:21); collect testimonials; eventually take credit-card transactions in-house (T1 00:11:40); present an investable operating system to VCs (T1 00:36:42).

### P6 — Prospective Owner (lead)
- **Who:** People considering writing a ~$100k check for a license (T1 00:42:50).
- **JTBD:** evaluate whether Frozen Ropes is "so much better than everyone else" (T1 00:09:21) — see industry credibility (major-league teams worked with), the playbook, and the economics before committing.
- **Implication:** a limited **Sneak Peek** surface is itself a product requirement (T1 00:09:21–00:10:31, 00:43:15: the demo "video is actually really important from a timeline perspective").

*(Front-desk staff is folded into P1's facility tools — staff share the facility portal with role-appropriate access; T1 distinguishes only "facility owners and people who work at the facility," 00:33:27.)*

---

## 3. Feature inventory (deduplicated, grouped by domain)

### A. Content / Curriculum (the #1 priority — "replace Google Drive")
- Four-pillar library structure mirroring the Drive: **Instruction, Operations, Programs, Marketing** (T1 00:40:31–00:41:05).
- Resource types: videos, PDFs, Excel docs, drills, lectures, resources; "bespoke UIs" for special collections (e.g., promotional videos) (T1 00:41:05).
- **The Blueprint** — the master operating doc ("blueprint dot XLS… actually really valuable") turned into an interactive tool: budgets ("how much money they should spend on bats"), P&L tracking (T1 00:31:58, 00:41:05).
- Searchable — the antithesis of "can't find anything" (T1 00:28:57).

### B. Player Development & Evaluation
- **Rock Ready eval**: graded skill indexes (e.g., Strength Index, Grip Index), letter grades, "you can track it and trend them" (T1 00:41:05).
- Video library of player sessions; iPad capture at the cage; movement tracking + AI recommendations on playback (T1 00:32:55, 00:13:07).
- AI drill search: "I have this… nine year old that's hitting his pitch a little slow… searching all of the videos and all the drills on things that we can show them" (T1 00:32:32).
- Quality-reps logging — quality over quantity (T2 00:06:46).
- Holistic tracking: health, sleep, nutrition, workload/over-training (T2 00:06:46, 00:08:23).
- **Hybrid AI+coach review** — AI suggests, a human coach validates (T2 00:09:28 constraint).

### C. Membership & Billing
- **Membership matrix** — tiers/levels of membership (T1 00:12:27, 00:24:39).
- Member management, billing "for stuff," stored value — "buy Gatorade from the facility… give them two fifty and charge Stripe," take cash (T1 00:32:55).
- Parent-pays model; add-ons like recruiting access sold through the portal (T1 00:34:08).

### D. POS & Retail
- Full point-of-sale for the facility incl. Pro Shop (T1 00:32:55, 00:13:07).
- Take retail/credit-card transactions in-house (displace Baseline) (T1 00:06:45, 00:11:40).
- E-commerce on the Frozen Ropes website (future phase) (T1 00:11:40–00:12:27).

### E. Scheduling & Programs
- **Program calendar** facilities can set up (T1 00:19:58).
- Class rosters ("the two thirty batting cage class"), capacity, bookings (T1 00:34:49).
- Cage/lane resource scheduling (implied by facility operations; Baseline's scheduling software is the benchmark — T1 00:18:17).

### F. Attendance, Staff & Time Tracking
- Bulk attendance marking by coaches; no-show and unpaid flags; eligibility ("Is this kid allowed?") (T1 00:34:49–00:35:20).
- Staff time tracking — coach login/clock-in (T1 00:34:49).

### G. Communication
- Coach → parent session notes with at-home practice guidance (T1 00:35:21–00:35:55).
- Messaging between parents and coach/facility (T2 00:05:15).
- Benchmark: GameChanger is "used for everything" — streaming, communication, notes (T2 00:05:35–00:06:22).

### H. Rewards
- Points earned by spend — "the more money you spend at a place, there should be some incentive" (T1 00:24:39).
- **Cross-location redemption**: "if you have reward points in San Diego, you should be able to redeem them in the Pro Shop or on the Frozen Rope website" (T1 00:24:39).
- Video-linked rewards concepts from the Basepath NDA worth borrowing (T1 00:14:54–00:15:31, 00:17:59).

### I. Recruiting / College Bound
- "Database of all the colleges in the country, Division one, two and three"; identify "academically and athletically where little Johnny or Jane should go to school" (T1 00:16:26).
- Paid add-on for parents; the top of the cradle-to-grave arc (T1 00:16:26, 00:34:08).

### J. HQ / Network Operations
- CMS for the content library (T1 00:41:05).
- Multi-facility oversight dashboard (implied by HQ persona + license model).
- **Boom calls** hub — monthly best-practice think tank; agendas, recordings, marketing ideas, social collab (T1 00:25:35–00:26:05).
- License-sales pipeline + **Sneak Peek** demo for prospects (T1 00:09:21, 00:42:50–00:43:15).
- Testimonials collection (T1 00:23:10).

### K. AI (cross-cutting, Jim's mandate)
- "Jim has a very heavy fascination with AI. So think through AI aspects in all ranges, especially like an avatar, a tutor that you can talk to" (T1 00:36:42).
- Always constrained by the T2 trust finding: AI assists and routes to humans; it does not replace the biomechanics coach.

---

## 4. Vocabulary (use everywhere, verbatim)

| Term | Meaning |
|---|---|
| **The Frozone** | The portal/OS itself ("affectionately calling that the Frozone") |
| **Frozen Ropes USA** | HQ entity |
| **Center / Academy / Facility** | A licensed location (T1 00:39:18 uses "center" and "academy"; "facility" is most common) |
| **Four Pillars** | Instruction · Operations · Programs · Marketing |
| **The Blueprint** | Master facility operating/budget doc |
| **Rock Ready** | The player evaluation program (indexes, grades, trends) |
| **Born to Play** | Entry program for 3-year-olds |
| **College Bound** | Recruiting program (the "cradle to grave" endpoint) |
| **Boom call** | Monthly Business Operations, Organization & Marketing owners' call |
| **Membership Matrix** | The tier structure for memberships |
| **Sneak Peek** | Limited prospect-facing view of the Frozone used to sell licenses |
| **Baseline** | Incumbent third-party POS/website vendor to be displaced |
| **Basepath** | Prospective partner whose NDA'd concepts include video-linked rewards |
| **Quality reps** | The development philosophy: deliberate practice over volume |

---

## 5. Open questions & working assumptions

| # | Open question | Assumption taken (and why) |
|---|---|---|
| 1 | Source folder path placeholder was never replaced in the mission brief. | The transcripts/notes pasted inline in the brief **are** the full corpus; proceed on those. |
| 2 | Real auth, real Stripe, real database? Timeline is ~2 months remaining of a 3-month engagement (T1 00:42:14) and the immediate need is a demo that sells licenses and lands features (T1 00:42:50–00:43:15). | Build a production-grade **front-end portal with demo auth (role selector) and rich seeded data**. Payments/AI endpoints are realistic interactive mocks, marked stubbed-with-intent in the PRD. |
| 3 | Exact Rock Ready index list — transcript names Strength Index and Grip Index and letter grades only. | Extend with baseball-credible indexes (Bat Speed, Arm Strength, Speed, Fielding, Baseball IQ) clearly marked as proposed; keep Strength + Grip verbatim. |
| 4 | Membership Matrix contents — referenced but never enumerated. | Model a 4-tier matrix (Rookie / Prospect / All-Star / Franchise) with benefits aligned to features in the corpus (cage hours, lessons, rewards multiplier, College Bound access). Flag for Tony's matrix doc. |
| 5 | Coach employment/permissions details. | Coaches are facility employees with elevated (not owner) access: rosters, attendance, video, session notes, own schedule, clock-in. |
| 6 | Facility list. | Seed 9 facilities incl. the cities named: San Diego, Dallas, New York (Chester, NY is the historic HQ), Boston, Dawsonville GA + 4 plausible others. |
| 7 | Is the public website/e-comm in scope? Tony explicitly deferred it ("that website is going to stay" — T1 00:11:40). | Out of scope for this build except the Sneak Peek prospect surface; noted as a later phase. |
| 8 | GameChanger-style live game streaming. | Out of scope to replicate; the portal links/embeds game info instead. The wedge is development + facility ops, not game-day streaming (T2 evidence: GameChanger already owns game day). |
| 9 | Brand identity assets. | No brand files provided; design system (doc 04) defines an original premium "Frozone" identity (cold/ice + ballpark cues) that won't collide with existing Frozen Ropes trade dress. |

---

## 6. What "done" means for this pass

A deployed, role-based Frozone portal where every persona above logs in (demo role selector), lands on a purpose-built dashboard, and can touch every feature domain A–K with realistic seeded data — strong enough to be the Sneak Peek that convinces a prospect, and the alignment artifact for the Monday scope call (N1 next-arrangements).
