import type {
  AiObservation, BlueprintLine, BoomCall, College, Drill, Facility, Family, Invoice,
  JourneyStage, MessageThread, Persona, Player, ProgramClass, Product, Prospect,
  RepLog, Resource, RewardEvent, RockIndex, RockIndexKey, Sale, SessionNote,
  SessionVideo, StaffMember, Tier, WellnessEntry,
} from '../lib/types'

// Deterministic pseudo-random so the demo is stable across loads
let seedState = 42
const rnd = () => {
  seedState = (seedState * 1103515245 + 12345) % 2147483648
  return seedState / 2147483648
}
const ri = (min: number, max: number) => Math.floor(rnd() * (max - min + 1)) + min
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)]

export const PERSONAS: Persona[] = [
  { role: 'owner', name: 'Dana Whitfield', title: 'Owner / GM · Frozen Ropes Dawsonville', initials: 'DW', blurb: 'Run the building — members, money, schedule, staff.', home: '/owner' },
  { role: 'coach', name: 'Marcus Rivera', title: 'Lead Instructor · Dawsonville', initials: 'MR', blurb: 'Your day, your rosters, your players. AI flags, you decide.', home: '/coach' },
  { role: 'player', name: 'Tyler Whitman', title: '12U · Prospect Member', initials: 'TW', blurb: 'Your scores, your drills, your journey to College Bound.', home: '/player' },
  { role: 'parent', name: 'Jess Whitman', title: "Tyler's mom · Whitman Family", initials: 'JW', blurb: 'Progress you can see, coaches you can reach, one bill.', home: '/parent' },
  { role: 'hq', name: 'Tony Abbatine', title: 'Frozen Ropes USA · HQ', initials: 'TA', blurb: 'The whole network — content, facilities, pipeline, Boom calls.', home: '/hq' },
  { role: 'prospect', name: 'Sneak Peek', title: 'Prospective Owner', initials: 'SP', blurb: 'See why owners write the check. The Frozone, from the outside.', home: '/sneak-peek' },
]

export const FACILITIES: Facility[] = [
  { id: 'fac-chester', name: 'Chester, NY', city: 'Chester', state: 'NY', since: 1990, members: 412, revenueYtd: 689400, utilization: 84, rockReadyRate: 91, status: 'open', owner: 'Frozen Ropes USA' },
  { id: 'fac-boston', name: 'Boston, MA', city: 'Natick', state: 'MA', since: 2016, members: 348, revenueYtd: 552300, utilization: 79, rockReadyRate: 88, status: 'open', owner: 'Stephen Abbatine' },
  { id: 'fac-sandiego', name: 'San Diego, CA', city: 'San Diego', state: 'CA', since: 2004, members: 396, revenueYtd: 601200, utilization: 81, rockReadyRate: 76, status: 'open', owner: 'R. Calloway' },
  { id: 'fac-dallas', name: 'Dallas, TX', city: 'Plano', state: 'TX', since: 2008, members: 374, revenueYtd: 578900, utilization: 77, rockReadyRate: 72, status: 'open', owner: 'M. Greer' },
  { id: 'fac-dawsonville', name: 'Dawsonville, GA', city: 'Dawsonville', state: 'GA', since: 2026, members: 124, revenueYtd: 86200, utilization: 58, rockReadyRate: 64, status: 'launching', owner: 'Dana & Paul Whitfield' },
  { id: 'fac-tampa', name: 'Tampa, FL', city: 'Tampa', state: 'FL', since: 2012, members: 322, revenueYtd: 498100, utilization: 74, rockReadyRate: 69, status: 'open', owner: 'C. Donato' },
  { id: 'fac-chicago', name: 'Chicago, IL', city: 'Naperville', state: 'IL', since: 2014, members: 301, revenueYtd: 471500, utilization: 71, rockReadyRate: 70, status: 'open', owner: 'K. Walsh' },
  { id: 'fac-charlotte', name: 'Charlotte, NC', city: 'Charlotte', state: 'NC', since: 2019, members: 268, revenueYtd: 402800, utilization: 69, rockReadyRate: 66, status: 'open', owner: 'D. Pham' },
  { id: 'fac-phoenix', name: 'Phoenix, AZ', city: 'Scottsdale', state: 'AZ', since: 2021, members: 243, revenueYtd: 371600, utilization: 66, rockReadyRate: 61, status: 'open', owner: 'J. Maldonado' },
]

export const HOME_FACILITY = FACILITIES[4] // Dawsonville

export const TIERS: Tier[] = [
  { id: 'rookie', name: 'Rookie', price: 79, color: 'ice', members: 41, benefits: ['2 group classes / wk', 'Open cage Sundays', 'Frozone player app', 'Rewards at 1x'] },
  { id: 'prospect', name: 'Prospect', price: 149, color: 'frost', members: 52, benefits: ['Unlimited group classes', '2 cage hrs / wk', 'Rock Ready evals quarterly', 'Video review (coach-approved)', 'Rewards at 1.5x'] },
  { id: 'allstar', name: 'All-Star', price: 249, color: 'gold', members: 24, benefits: ['Everything in Prospect', 'Weekly private lesson', 'Monthly Rock Ready eval', 'Wellness & workload tracking', 'Rewards at 2x'] },
  { id: 'franchise', name: 'Franchise', price: 399, color: 'clay', members: 7, benefits: ['Everything in All-Star', 'College Bound program', 'Showcase-readiness report', 'Device data ingestion (Rapsodo/TrackMan)', 'Rewards at 3x'] },
]

const FIRST = ['Tyler', 'Maya', 'Jaden', 'Sofia', 'Cole', 'Ava', 'Diego', 'Riley', 'Owen', 'Zoe', 'Eli', 'Nora', 'Luis', 'Quinn', 'Brody', 'Isla', 'Mason', 'Lena', 'Drew', 'Camila', 'Beckett', 'Harper', 'Nico', 'June', 'Wyatt', 'Remi', 'Sawyer', 'Tessa', 'Ari', 'Mila', 'Hudson', 'Skye', 'Gavin', 'Paige', 'Knox', 'Ruby']
const LAST = ['Whitman', 'Ortiz', 'Calhoun', 'Nakamura', 'Pruitt', 'Vega', 'Sloan', 'Okafor', 'Lindqvist', 'Marsh', 'Devereaux', 'Hahn', 'Castillo', 'Bryce', 'Ngo', 'Ferraro', 'Whitaker', 'Soto', 'Kemp', 'Alvarez', 'Booker', 'Strand', 'McCray', 'Iverson']
const POSITIONS = ['SS', 'C', '2B', 'CF', '3B', 'P', '1B', 'RF', 'LF', 'UTIL']

const INDEX_DEFS: { key: RockIndexKey; label: string }[] = [
  { key: 'strength', label: 'Strength Index' },
  { key: 'grip', label: 'Grip Index' },
  { key: 'batSpeed', label: 'Bat Speed' },
  { key: 'armStrength', label: 'Arm Strength' },
  { key: 'speed', label: 'Speed' },
  { key: 'fielding', label: 'Fielding' },
  { key: 'baseballIQ', label: 'Baseball IQ' },
]

const gradeFor = (s: number) => (s >= 90 ? 'A' : s >= 80 ? 'A-' : s >= 72 ? 'B+' : s >= 64 ? 'B' : s >= 55 ? 'B-' : s >= 45 ? 'C+' : 'C')

const trendTo = (final: number, n = 8, vol = 6) => {
  const arr: number[] = []
  let v = final - ri(4, 14)
  for (let i = 0; i < n - 1; i++) {
    arr.push(Math.max(20, Math.min(99, Math.round(v))))
    v += (final - v) / (n - i) + (rnd() - 0.45) * vol
  }
  arr.push(final)
  return arr
}

const mkIndexes = (base: number): RockIndex[] =>
  INDEX_DEFS.map((d) => {
    const score = Math.max(22, Math.min(98, base + ri(-14, 14)))
    return { ...d, score, grade: gradeFor(score), trend: trendTo(score) }
  })

const AGE_GROUPS: [number, number, string, string][] = [
  [5, 7, '6U', 'Born to Play'],
  [8, 10, '9U', 'Foundations'],
  [11, 13, '12U', 'Player Development'],
  [14, 16, '15U', 'Performance'],
  [16, 18, '17U', 'College Bound'],
]

export const PLAYERS: Player[] = []
export const FAMILIES: Family[] = []

// Tyler Whitman — the demo player (deliberate, not random)
const tylerIndexes = mkIndexes(70)
tylerIndexes[0].score = 81; tylerIndexes[0].grade = 'A-'; tylerIndexes[0].trend = trendTo(81)
tylerIndexes[1].score = 64; tylerIndexes[1].grade = 'B'; tylerIndexes[1].trend = trendTo(64)
tylerIndexes[2].score = 77; tylerIndexes[2].grade = 'B+'; tylerIndexes[2].trend = trendTo(77)
PLAYERS.push({
  id: 'p-tyler', name: 'Tyler Whitman', age: 12, ageGroup: '12U', position: 'SS', jersey: 7,
  tier: 'prospect', familyId: 'fam-whitman', hue: 200, composite: 74, compositeTrend: [61, 63, 62, 66, 68, 71, 70, 74],
  indexes: tylerIndexes, streakDays: 11, program: 'Player Development', flags: {},
})
FAMILIES.push({
  id: 'fam-whitman', parentName: 'Jess Whitman', playerIds: ['p-tyler'], tier: 'prospect',
  status: 'active', storedBalance: 142.5, rewardPoints: 2380, joined: 'Feb 2026', phone: '(706) 555-0142',
})

let pid = 0
for (let i = 0; i < 60; i++) {
  const [lo, hi, group, program] = AGE_GROUPS[i % AGE_GROUPS.length]
  const age = ri(lo, hi)
  const first = FIRST[(i * 7) % FIRST.length]
  const last = LAST[(i * 5 + 3) % LAST.length]
  const tier = (['rookie', 'prospect', 'prospect', 'allstar', 'rookie', 'franchise'] as const)[i % 6]
  const base = ri(40, 86)
  const composite = Math.max(25, Math.min(97, base + ri(-5, 5)))
  const id = `p-${++pid}`
  const famId = `fam-${pid}`
  PLAYERS.push({
    id, name: `${first} ${last}`, age, ageGroup: group, position: pick(POSITIONS),
    jersey: ri(1, 44), tier, familyId: famId, hue: ri(0, 359), composite,
    compositeTrend: trendTo(composite), indexes: mkIndexes(base),
    streakDays: ri(0, 21), program,
    flags: i % 11 === 3 ? { unpaid: true } : i % 13 === 5 ? { gearMissing: 'cleats' } : i % 17 === 8 ? { waiver: true } : {},
  })
  FAMILIES.push({
    id: famId, parentName: `${pick(FIRST)} ${last}`, playerIds: [id], tier,
    status: i % 11 === 3 ? 'past_due' : i % 19 === 7 ? 'paused' : 'active',
    storedBalance: ri(0, 30) * 5, rewardPoints: ri(80, 5200),
    joined: `${pick(['Jan', 'Feb', 'Mar', 'Apr', 'May'])} 2026`, phone: `(706) 555-0${ri(100, 199)}`,
  })
}

export const STAFF: StaffMember[] = [
  { id: 'st-marcus', name: 'Marcus Rivera', role: 'Lead Instructor', rate: 34, clockedIn: true, hoursWeek: 26.5, hue: 18 },
  { id: 'st-aliyah', name: 'Aliyah Brooks', role: 'Hitting Instructor', rate: 28, clockedIn: true, hoursWeek: 22, hue: 280 },
  { id: 'st-sam', name: 'Sam Treadwell', role: 'Pitching Instructor', rate: 30, clockedIn: false, hoursWeek: 18.5, hue: 140 },
  { id: 'st-erin', name: 'Erin Vasquez', role: 'Front Desk', rate: 17, clockedIn: true, hoursWeek: 31, hue: 330 },
  { id: 'st-paul', name: 'Paul Whitfield', role: 'Co-Owner / Ops', rate: 0, clockedIn: false, hoursWeek: 40, hue: 210 },
]

const enroll = (n: number, mustHaveTyler = false) => {
  const ids = new Set<string>()
  if (mustHaveTyler) ids.add('p-tyler')
  while (ids.size < n) ids.add(PLAYERS[ri(1, PLAYERS.length - 1)].id)
  return [...ids]
}

export const CLASSES: ProgramClass[] = [
  { id: 'c-230cage', name: '2:30 Batting Cage Class', type: 'class', coachId: 'st-marcus', cage: 'Cage 2', day: 0, start: '14:30', durationMin: 60, capacity: 10, enrolled: enroll(9, true), price: 35 },
  { id: 'c-12udev', name: '12U Player Development', type: 'class', coachId: 'st-marcus', cage: 'Cage 1', day: 2, start: '17:00', durationMin: 90, capacity: 12, enrolled: enroll(11, true), price: 45 },
  { id: 'c-borntoplay', name: 'Born to Play (3–5)', type: 'class', coachId: 'st-aliyah', cage: 'Turf A', day: 1, start: '10:00', durationMin: 45, capacity: 8, enrolled: enroll(7), price: 25 },
  { id: 'c-pitchlab', name: 'Pitch Lab 15U', type: 'class', coachId: 'st-sam', cage: 'Lane B', day: 3, start: '18:30', durationMin: 75, capacity: 6, enrolled: enroll(6), price: 55 },
  { id: 'c-privlesson', name: 'Private — T. Whitman', type: 'lesson', coachId: 'st-marcus', cage: 'Cage 3', day: 4, start: '16:00', durationMin: 30, capacity: 1, enrolled: ['p-tyler'], price: 75 },
  { id: 'c-eliteinfield', name: 'Elite Infield Camp', type: 'camp', coachId: 'st-aliyah', cage: 'Turf A', day: 5, start: '09:00', durationMin: 180, capacity: 16, enrolled: enroll(14), price: 120 },
  { id: 'c-collegeprep', name: 'College Bound Workshop', type: 'class', coachId: 'st-sam', cage: 'Classroom', day: 5, start: '13:00', durationMin: 60, capacity: 12, enrolled: enroll(8), price: 0 },
  { id: 'c-rental18', name: 'Cage Rental — Ortiz', type: 'rental', coachId: 'st-erin', cage: 'Cage 4', day: 0, start: '18:00', durationMin: 60, capacity: 4, enrolled: enroll(2), price: 40 },
  { id: 'c-9ufound', name: '9U Foundations', type: 'class', coachId: 'st-aliyah', cage: 'Cage 2', day: 1, start: '17:30', durationMin: 60, capacity: 10, enrolled: enroll(10), price: 35 },
  { id: 'c-velo', name: 'Velo Development 17U', type: 'class', coachId: 'st-sam', cage: 'Lane A', day: 2, start: '19:00', durationMin: 60, capacity: 8, enrolled: enroll(7), price: 50 },
]

export const CAGES = ['Cage 1', 'Cage 2', 'Cage 3', 'Cage 4', 'Lane A', 'Lane B', 'Turf A']

const R = (id: string, title: string, pillar: Resource['pillar'], type: Resource['type'], description: string, meta: string, tags: string[], views = ri(40, 900), status: Resource['status'] = 'published'): Resource =>
  ({ id, title, pillar, type, description, meta, views, status, tags, updated: `${pick(['Mar', 'Apr', 'May', 'Jun'])} ${ri(2, 28)}` })

export const RESOURCES: Resource[] = [
  // Instruction
  R('r-rotational', 'Rotational Hitting: The Frozen Ropes Method', 'instruction', 'video', 'The core hitting philosophy — hips lead, hands inside, line drives over launch angle.', '18 min', ['hitting', 'fundamentals']),
  R('r-tee-progressions', 'Tee Progressions Ladder (6U–17U)', 'instruction', 'drill', 'Nine-station tee ladder that scales from Born to Play through College Bound.', '9 stations', ['hitting', 'drills', 'tee']),
  R('r-grip-strength', 'Grip Index Training Protocol', 'instruction', 'pdf', 'Rice bucket, bar hangs, and plate pinches — the grip work behind the Grip Index.', '6 pages', ['strength', 'grip', 'rock-ready']),
  R('r-late-swing', 'Fixing the Late Swing', 'instruction', 'video', 'Diagnosing late contact: load timing, stride direction, and the wall drill.', '11 min', ['hitting', 'timing']),
  R('r-catch-throw', 'Catch & Throw Foundations', 'instruction', 'video', 'Four-seam grips, footwork triangles, and exchange speed for 9U–12U.', '14 min', ['fielding', 'throwing']),
  R('r-bullpen-card', 'Bullpen Session Card', 'instruction', 'pdf', 'Structured 32-pitch bullpen with intent tags and recovery notes.', '2 pages', ['pitching']),
  R('r-mental-game', 'Lecture: The Mental Side of Two Strikes', 'instruction', 'lecture', 'Approach, breathing, and the shrink-the-zone routine.', '24 min', ['mental', 'approach']),
  R('r-wall-drill', 'The Wall Drill', 'instruction', 'drill', 'Kill casting in two weeks. Bat barrel stays inside the ball — or hits the wall.', '5 min setup', ['hitting', 'timing', 'drills']),
  R('r-rice-bucket', 'Rice Bucket Circuit', 'instruction', 'drill', 'Five-minute forearm and grip circuit; pairs with the Grip Index protocol.', '5 min', ['grip', 'strength', 'drills']),
  R('r-exchange', 'Quick Exchange Drill', 'instruction', 'drill', 'Glove-to-hand exchange under 0.9s. Mirror work plus partner toss.', '10 min', ['fielding', 'drills']),
  R('r-stride-box', 'Stride Direction Box', 'instruction', 'drill', 'Chalk-box stride constraint to stop flying open against breaking balls.', '8 min', ['hitting', 'drills', 'timing']),
  R('r-longtoss', 'Long Toss Program (Arm Care)', 'instruction', 'pdf', 'Progressive distance ladder with workload caps by age — pairs with workload tracking.', '4 pages', ['throwing', 'arm-care']),
  // Operations
  R('r-blueprint', 'The Blueprint (Master Operating Doc)', 'operations', 'spreadsheet', 'The complete facility financial model: revenue lines, expense benchmarks, equipment budgets.', '11 tabs', ['blueprint', 'finance'], 1240),
  R('r-opening-checklist', 'Daily Opening & Closing Checklist', 'operations', 'pdf', 'Front desk, cages, turf, retail float, and safety walk — the daily rhythm.', '3 pages', ['operations', 'checklist']),
  R('r-hiring-guide', 'Hiring & Onboarding Instructors', 'operations', 'pdf', 'Where to find coaches, what to pay, and the 30-day onboarding plan.', '9 pages', ['staff', 'hiring']),
  R('r-insurance', 'Insurance & Waiver Standards', 'operations', 'pdf', 'Required coverage levels and the waiver flow every member must complete.', '5 pages', ['legal', 'safety']),
  R('r-equipment-budget', 'Equipment Budget Calculator', 'operations', 'spreadsheet', 'How much to spend on bats, balls, screens, and turf — by facility size.', '4 tabs', ['blueprint', 'equipment']),
  R('r-maintenance', 'Turf & Netting Maintenance Schedule', 'operations', 'pdf', 'Quarterly inspection and replacement cycles that keep insurance valid.', '4 pages', ['facilities', 'safety']),
  // Programs
  R('r-borntoplay-curr', 'Born to Play Curriculum (Ages 3–5)', 'programs', 'pdf', 'Eight-week movement-first introduction. Where the cradle-to-grave journey begins.', '16 pages', ['born-to-play', 'curriculum'], 870),
  R('r-12u-block', '12U Player Development Block', 'programs', 'pdf', 'Twelve-week periodized plan: hitting, fielding, arm care, and Rock Ready checkpoints.', '14 pages', ['curriculum', '12u']),
  R('r-camps-playbook', 'School-Break Camp Playbook', 'programs', 'pdf', 'Staffing ratios, daily schedules, and pricing for holiday and summer camps.', '12 pages', ['camps', 'revenue']),
  R('r-collegebound-guide', 'College Bound Program Guide', 'programs', 'pdf', 'The recruiting curriculum: timelines, video standards, and the family conversation.', '22 pages', ['college-bound', 'recruiting'], 760),
  R('r-rockready-manual', 'Rock Ready Evaluation Manual', 'programs', 'pdf', 'How to run evals: index definitions, scoring rubrics, and trend conversations with parents.', '18 pages', ['rock-ready', 'evals'], 1050),
  // Marketing
  R('r-grand-opening', 'Grand Opening Playbook', 'marketing', 'pdf', 'The 6-week launch sequence that filled Dawsonville to 124 members.', '10 pages', ['launch', 'local']),
  R('r-promo-videos', 'Promotional Video Library', 'marketing', 'video', 'Brand-approved spots for social, local TV, and in-facility screens.', '9 videos', ['brand', 'video'], 640),
  R('r-social-calendar', 'Social Media Content Calendar', 'marketing', 'spreadsheet', '90 days of post templates — wins, drills, member spotlights, Boom-call takeaways.', '3 tabs', ['social']),
  R('r-referral', 'Member Referral Program Kit', 'marketing', 'pdf', 'Reward-points-powered referrals: the offer, the assets, the math.', '6 pages', ['referrals', 'rewards']),
  R('r-email-templates', 'Seasonal Email Templates', 'marketing', 'pdf', 'Registration pushes, camp announcements, and win-back sequences.', '8 pages', ['email']),
  R('r-brand-standards', 'Brand Standards & Logo Kit', 'marketing', 'pdf', 'Colors, type, and how the frozen rope mark is used. Never stretch the rope.', '12 pages', ['brand'], 310, 'published'),
  R('r-pricing-draft', 'FY27 Pricing Strategy (Draft)', 'operations', 'spreadsheet', 'Next year’s membership matrix modeling — HQ eyes only for now.', '5 tabs', ['blueprint', 'pricing'], 28, 'draft'),
]

export const DRILLS: Drill[] = [
  { id: 'd-wall', resourceId: 'r-wall-drill', title: 'The Wall Drill', focus: ['casting', 'swing path', 'late contact'], ages: '9U–17U', equipment: 'Tee, wall or net screen', duration: '8 min', description: 'Set up a bat-length from the wall. Casting hits the wall; inside hands don’t. Three sets of eight with intent.' },
  { id: 'd-stride', resourceId: 'r-stride-box', title: 'Stride Direction Box', focus: ['timing', 'flying open', 'late contact'], ages: '9U–15U', equipment: 'Chalk, tee', duration: '8 min', description: 'Chalk a stride box toward the pitcher. Land inside it on every swing. Fixes pull-off against off-speed.' },
  { id: 'd-rice', resourceId: 'r-rice-bucket', title: 'Rice Bucket Circuit', focus: ['grip', 'forearm strength'], ages: 'All', equipment: '5-gal bucket of rice', duration: '5 min', description: 'Open-close, rotations, digs. Two rounds. The fastest path to a better Grip Index.' },
  { id: 'd-exchange', resourceId: 'r-exchange', title: 'Quick Exchange', focus: ['fielding', 'exchange speed'], ages: '9U–17U', equipment: 'Glove, partner', duration: '10 min', description: 'Mirror exchanges, then partner toss. Goal: glove-to-release under 0.9 seconds.' },
  { id: 'd-tee-ladder', resourceId: 'r-tee-progressions', title: 'Tee Progressions Ladder', focus: ['swing path', 'contact point', 'fundamentals'], ages: '6U–17U', equipment: 'Tee, ball bucket', duration: '15 min', description: 'Nine stations from low-inside to high-away. Earn the next station with three line drives.' },
  { id: 'd-longtoss', resourceId: 'r-longtoss', title: 'Long Toss Ladder', focus: ['arm strength', 'arm care'], ages: '12U+', equipment: 'Open field', duration: '20 min', description: 'Distance ladder on the arm-care program. Respect the workload cap — quality throws only.' },
]

export const SESSION_NOTES: SessionNote[] = [
  { id: 'sn-1', playerId: 'p-tyler', coachId: 'st-marcus', date: 'Tue Jun 9', focus: 'Timing vs. off-speed', workedOn: 'Tyler’s load was drifting late against change-ups. We reset his trigger earlier and ran the Stride Direction Box — contact jumped from 4/10 to 8/10 hard contact by the last round.', homework: ['d-stride', 'd-rice'], nextFocus: 'Keep the early trigger against live arm Friday. Grip work nightly — that index is the one holding back his composite.', sentToParent: true },
  { id: 'sn-2', playerId: 'p-tyler', coachId: 'st-marcus', date: 'Fri Jun 5', focus: 'Swing path — casting', workedOn: 'Wall drill, three rounds. First round he clipped the wall five times; third round, clean. Barrel is staying inside noticeably longer.', homework: ['d-wall'], nextFocus: 'Off-speed timing — bring it together with the stride box Tuesday.', sentToParent: true },
  { id: 'sn-3', playerId: 'p-tyler', coachId: 'st-marcus', date: 'Tue Jun 2', focus: 'Rock Ready eval — Q2', workedOn: 'Quarterly eval. Composite up 4 to 74. Strength Index 81 (A-) — best on the 12U board. Grip Index 64 is the gap.', homework: ['d-rice'], nextFocus: 'Grip protocol nightly for three weeks, re-test July 1.', sentToParent: true },
]

const obs = (id: string, text: string, confidence: number, status: AiObservation['status'] = 'pending'): AiObservation => ({ id, text, confidence, status })

export const VIDEOS: SessionVideo[] = [
  { id: 'v-1', playerId: 'p-tyler', title: 'Cage 3 — live BP, 24 swings', date: 'Tue Jun 9', durationSec: 312, status: 'review', hue: 200, observations: [
    obs('o-1', 'Hands drop ~2" during load on pitches 14–19 (fatigue pattern)', 0.87),
    obs('o-2', 'Stride direction improved vs. Jun 5 session — landing inside the box 9/10', 0.93),
    obs('o-3', 'Possible early hip fire on outside pitches', 0.61),
  ] },
  { id: 'v-2', playerId: 'p-tyler', title: 'Stride box drill — 3 rounds', date: 'Fri Jun 5', durationSec: 248, status: 'shared', hue: 152, coachComment: 'Watch round three — this is what landing closed looks like. Do this every time.', observations: [
    obs('o-4', 'Front-side stays closed through contact on 11/12 swings', 0.91, 'confirmed'),
    obs('o-5', 'Bat path on plane +12% vs. last session', 0.84, 'confirmed'),
  ] },
  { id: 'v-3', playerId: 'p-1', title: 'Pitch Lab — bullpen 32', date: 'Mon Jun 8', durationSec: 421, status: 'review', hue: 20, observations: [
    obs('o-6', 'Release point drifting arm-side after pitch 20', 0.78),
    obs('o-7', 'Glove-side pull on breaking balls', 0.69),
  ] },
  { id: 'v-4', playerId: 'p-7', title: 'Infield camp — exchange reps', date: 'Sat Jun 6', durationSec: 198, status: 'processing', hue: 280, observations: [] },
  { id: 'v-5', playerId: 'p-tyler', title: 'Tee ladder — station 7', date: 'Sat May 30', durationSec: 154, status: 'shared', hue: 45, coachComment: 'Station 7 earned. Watch how the barrel stays through the high-away lane.', observations: [obs('o-8', 'Contact point consistency 86% (up from 71%)', 0.9, 'confirmed')] },
]

export const PRODUCTS: Product[] = [
  { id: 'pr-1', name: 'FR Pro Batting Gloves', category: 'pro-shop', price: 34.99, points: 3500, stock: 18, hue: 200 },
  { id: 'pr-2', name: 'Frozen Ropes Hoodie', category: 'pro-shop', price: 54.99, points: 5500, stock: 11, hue: 215 },
  { id: 'pr-3', name: 'Practice Tee (Pro)', category: 'pro-shop', price: 89.99, points: 9000, stock: 6, hue: 28 },
  { id: 'pr-4', name: 'FR Snapback Cap', category: 'pro-shop', price: 27.99, points: 2800, stock: 24, hue: 195 },
  { id: 'pr-5', name: 'Training Balls (dz)', category: 'pro-shop', price: 39.99, points: 4000, stock: 14, hue: 60 },
  { id: 'pr-6', name: 'Grip Trainer Kit', category: 'pro-shop', price: 24.99, points: 2500, stock: 9, hue: 320 },
  { id: 'pr-7', name: 'Gatorade', category: 'concessions', price: 3.5, points: 350, stock: 48, hue: 85 },
  { id: 'pr-8', name: 'Protein Bar', category: 'concessions', price: 4.25, points: 425, stock: 36, hue: 35 },
  { id: 'pr-9', name: 'Sunflower Seeds', category: 'concessions', price: 2.5, points: 250, stock: 52, hue: 50 },
  { id: 'pr-10', name: 'Water', category: 'concessions', price: 2.0, points: 200, stock: 60, hue: 190 },
  { id: 'pr-11', name: 'Cage Rental — 30 min', category: 'cage-time', price: 25, points: 2500, stock: 999, hue: 230 },
  { id: 'pr-12', name: 'Cage Rental — 60 min', category: 'cage-time', price: 40, points: 4000, stock: 999, hue: 245 },
]

export const SALES: Sale[] = [
  { id: 's-1041', time: '11:42 AM', items: [{ productId: 'pr-7', qty: 2 }, { productId: 'pr-9', qty: 1 }], total: 9.5, tender: 'balance', memberName: 'Whitman' },
  { id: 's-1040', time: '11:18 AM', items: [{ productId: 'pr-12', qty: 1 }], total: 40, tender: 'card', memberName: 'Ortiz' },
  { id: 's-1039', time: '10:55 AM', items: [{ productId: 'pr-1', qty: 1 }], total: 34.99, tender: 'points', memberName: 'Vega' },
  { id: 's-1038', time: '10:31 AM', items: [{ productId: 'pr-8', qty: 1 }, { productId: 'pr-10', qty: 1 }], total: 6.25, tender: 'cash' },
  { id: 's-1037', time: '9:58 AM', items: [{ productId: 'pr-2', qty: 1 }, { productId: 'pr-4', qty: 1 }], total: 82.98, tender: 'card', memberName: 'Calhoun' },
]

export const INVOICES: Invoice[] = [
  { id: 'inv-2841', familyId: 'fam-whitman', date: 'Jun 1', description: 'Prospect membership — June', amount: 149, status: 'paid' },
  { id: 'inv-2790', familyId: 'fam-whitman', date: 'May 28', description: 'Private lesson pack (4)', amount: 280, status: 'paid' },
  { id: 'inv-2731', familyId: 'fam-whitman', date: 'May 1', description: 'Prospect membership — May', amount: 149, status: 'paid' },
  { id: 'inv-2698', familyId: 'fam-whitman', date: 'Apr 22', description: 'Elite Infield Camp', amount: 120, status: 'paid' },
  { id: 'inv-2645', familyId: 'fam-whitman', date: 'Apr 1', description: 'Prospect membership — April', amount: 149, status: 'paid' },
]

export const REWARD_EVENTS: RewardEvent[] = [
  { id: 'rw-1', date: 'Jun 9', facility: 'Dawsonville, GA', description: 'June membership payment', points: 224 },
  { id: 'rw-2', date: 'Jun 9', facility: 'Dawsonville, GA', description: 'Concessions purchase', points: 14 },
  { id: 'rw-3', date: 'May 31', facility: 'Tampa, FL', description: 'Pro Shop — travel weekend', points: 53 },
  { id: 'rw-4', date: 'May 28', facility: 'Dawsonville, GA', description: 'Lesson pack purchase', points: 420 },
  { id: 'rw-5', date: 'May 24', facility: 'Dawsonville, GA', description: 'Redeemed: FR Snapback Cap', points: -2800 },
  { id: 'rw-6', date: 'May 12', facility: 'Dawsonville, GA', description: '11-day practice streak bonus', points: 150 },
  { id: 'rw-7', date: 'May 1', facility: 'Dawsonville, GA', description: 'May membership payment', points: 224 },
]

export const COLLEGES: College[] = [
  { id: 'col-1', name: 'Vanderbilt University', division: 'D1', region: 'Southeast', state: 'TN', enrollment: 7100, academics: 96, baseball: 98, tuition: 63000, fit: 58 },
  { id: 'col-2', name: 'University of Georgia', division: 'D1', region: 'Southeast', state: 'GA', enrollment: 30700, academics: 84, baseball: 90, tuition: 12080, fit: 71 },
  { id: 'col-3', name: 'Georgia Tech', division: 'D1', region: 'Southeast', state: 'GA', enrollment: 18400, academics: 92, baseball: 88, tuition: 12852, fit: 66 },
  { id: 'col-4', name: 'Kennesaw State', division: 'D1', region: 'Southeast', state: 'GA', enrollment: 43200, academics: 64, baseball: 74, tuition: 7440, fit: 88 },
  { id: 'col-5', name: 'Mercer University', division: 'D1', region: 'Southeast', state: 'GA', enrollment: 9000, academics: 78, baseball: 76, tuition: 41000, fit: 81 },
  { id: 'col-6', name: 'Georgia College', division: 'D2', region: 'Southeast', state: 'GA', enrollment: 7000, academics: 70, baseball: 72, tuition: 9700, fit: 92 },
  { id: 'col-7', name: 'Valdosta State', division: 'D2', region: 'Southeast', state: 'GA', enrollment: 12300, academics: 58, baseball: 78, tuition: 6800, fit: 90 },
  { id: 'col-8', name: 'Columbus State', division: 'D2', region: 'Southeast', state: 'GA', enrollment: 7800, academics: 60, baseball: 75, tuition: 7100, fit: 89 },
  { id: 'col-9', name: 'Emory University', division: 'D3', region: 'Southeast', state: 'GA', enrollment: 7100, academics: 95, baseball: 80, tuition: 60800, fit: 62 },
  { id: 'col-10', name: 'Berry College', division: 'D3', region: 'Southeast', state: 'GA', enrollment: 2200, academics: 76, baseball: 82, tuition: 41700, fit: 85 },
  { id: 'col-11', name: 'Clemson University', division: 'D1', region: 'Southeast', state: 'SC', enrollment: 22500, academics: 82, baseball: 92, tuition: 15558, fit: 69 },
  { id: 'col-12', name: 'Coastal Carolina', division: 'D1', region: 'Southeast', state: 'SC', enrollment: 10600, academics: 62, baseball: 91, tuition: 12310, fit: 80 },
  { id: 'col-13', name: 'College of Charleston', division: 'D1', region: 'Southeast', state: 'SC', enrollment: 10300, academics: 72, baseball: 79, tuition: 12978, fit: 84 },
  { id: 'col-14', name: 'UNC Wilmington', division: 'D1', region: 'Southeast', state: 'NC', enrollment: 18000, academics: 74, baseball: 81, tuition: 7317, fit: 83 },
  { id: 'col-15', name: 'Davidson College', division: 'D1', region: 'Southeast', state: 'NC', enrollment: 1900, academics: 93, baseball: 70, tuition: 58000, fit: 60 },
  { id: 'col-16', name: 'Wake Forest', division: 'D1', region: 'Southeast', state: 'NC', enrollment: 5400, academics: 91, baseball: 95, tuition: 64000, fit: 57 },
  { id: 'col-17', name: 'University of Tampa', division: 'D2', region: 'Southeast', state: 'FL', enrollment: 10000, academics: 68, baseball: 94, tuition: 30000, fit: 78 },
  { id: 'col-18', name: 'Florida Southern', division: 'D2', region: 'Southeast', state: 'FL', enrollment: 3200, academics: 66, baseball: 86, tuition: 39000, fit: 79 },
  { id: 'col-19', name: 'Vassar College', division: 'D3', region: 'Northeast', state: 'NY', enrollment: 2450, academics: 94, baseball: 64, tuition: 67000, fit: 55 },
  { id: 'col-20', name: 'SUNY Cortland', division: 'D3', region: 'Northeast', state: 'NY', enrollment: 6800, academics: 65, baseball: 85, tuition: 7070, fit: 82 },
  { id: 'col-21', name: 'Tufts University', division: 'D3', region: 'Northeast', state: 'MA', enrollment: 6700, academics: 95, baseball: 78, tuition: 67000, fit: 59 },
  { id: 'col-22', name: 'Trinity University', division: 'D3', region: 'South', state: 'TX', enrollment: 2600, academics: 86, baseball: 84, tuition: 50000, fit: 72 },
  { id: 'col-23', name: 'Dallas Baptist', division: 'D1', region: 'South', state: 'TX', enrollment: 4400, academics: 67, baseball: 89, tuition: 35000, fit: 75 },
  { id: 'col-24', name: 'UC San Diego', division: 'D1', region: 'West', state: 'CA', enrollment: 33000, academics: 89, baseball: 80, tuition: 15300, fit: 68 },
]

export const PROSPECTS: Prospect[] = [
  { id: 'pp-1', name: 'Hannah & Greg Lawson', market: 'Franklin, TN', stage: 'sneak-peek', value: 100000, note: 'Toured Chester. Two kids in travel ball. Wants the Blueprint numbers.', days: 4 },
  { id: 'pp-2', name: 'Devon Carter', market: 'Columbus, OH', stage: 'toured', value: 100000, note: 'Ex-MiLB. Strong instructor network, needs ops support most.', days: 9 },
  { id: 'pp-3', name: 'Priya Raman', market: 'Cary, NC', stage: 'lead', value: 100000, note: 'Inbound from website. PE background — asked about unit economics first.', days: 2 },
  { id: 'pp-4', name: 'The Castellanos Group', market: 'Miami, FL', stage: 'lead', value: 300000, note: 'Multi-unit interest (3 sites). Wants HQ call before touring.', days: 6 },
  { id: 'pp-5', name: 'Walt & June Harmon', market: 'Boise, ID', stage: 'committed', value: 100000, note: 'Signed LOI. Turf install quote in hand — targeting October open.', days: 1 },
  { id: 'pp-6', name: 'Marcus Lee', market: 'Aurora, CO', stage: 'sneak-peek', value: 100000, note: 'Sneak Peek sent Jun 8. Opened it 6 times. Follow up Thursday.', days: 3 },
  { id: 'pp-7', name: 'Renee Okada', market: 'Sacramento, CA', stage: 'toured', value: 100000, note: 'HR exec like Dana — send the Dawsonville launch story.', days: 12 },
]

export const BOOM_CALLS: BoomCall[] = [
  { id: 'b-jun', date: 'Jun 25, 2026', theme: 'Summer Camp Capacity', topics: ['Camp staffing ratios that hold margin', 'Dawsonville launch: first 120 days', 'Rewards redemption patterns across the network', 'Social collab: July content calendar'], attendance: 0, recorded: false, takeaway: '' },
  { id: 'b-may', date: 'May 28, 2026', theme: 'The Referral Engine', topics: ['Referral kit results: Chester +31 members', 'Points-funded referrals vs. discounts', 'Front-desk scripts that convert tours'], attendance: 9, recorded: true, takeaway: 'Points-funded referrals beat discounts in every market that ran both. Kit v2 ships in the Library this week.' },
  { id: 'b-apr', date: 'Apr 30, 2026', theme: 'Rock Ready as a Sales Tool', topics: ['Eval-day open houses', 'Talking trends with parents, not scores', 'Tampa’s re-test cadence'], attendance: 8, recorded: true, takeaway: 'Facilities that run eval-day open houses convert 40%+ of walk-ins. Trend conversations beat score conversations.' },
  { id: 'b-mar', date: 'Mar 26, 2026', theme: 'Spring Retail Reset', topics: ['Pro Shop planograms', 'Stored balance as retention', 'Concessions margin targets'], attendance: 9, recorded: true, takeaway: 'Stored-balance families renew at 94% vs. 78% without. Push balance top-ups at every register.' },
]

const M = (actual: number, benchmark: number, months = 6) => {
  const a: number[] = []
  const b: number[] = []
  for (let i = 0; i < months; i++) {
    a.push(Math.round(actual * (0.72 + i * 0.06) * (0.92 + rnd() * 0.16)))
    b.push(Math.round(benchmark * (0.78 + i * 0.05)))
  }
  return { actual: a, benchmark: b }
}

export const BLUEPRINT: BlueprintLine[] = [
  { category: 'Memberships', group: 'revenue', ...M(21000, 19000) },
  { category: 'Lessons & Classes', group: 'revenue', ...M(11500, 12500) },
  { category: 'Camps & Clinics', group: 'revenue', ...M(4800, 5200) },
  { category: 'Cage Rentals', group: 'revenue', ...M(3900, 3600) },
  { category: 'Pro Shop & Concessions', group: 'revenue', ...M(2600, 3100) },
  { category: 'Payroll', group: 'expense', ...M(14200, 14800) },
  { category: 'Rent & Utilities', group: 'expense', ...M(9800, 9500) },
  { category: 'Equipment (bats, balls, screens)', group: 'expense', ...M(1900, 1600) },
  { category: 'Marketing', group: 'expense', ...M(1450, 1800) },
  { category: 'Insurance', group: 'expense', ...M(1100, 1150) },
]

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

export const THREADS: MessageThread[] = [
  { id: 'th-1', with: 'Coach Marcus Rivera', withRole: 'Lead Instructor', messages: [
    { from: 'them', text: 'Jess — great session Tuesday. Tyler’s timing work is paying off. Session note is in your feed with two homework drills.', time: 'Tue 6:12 PM' },
    { from: 'me', text: 'We saw! He did the rice bucket twice already without being asked. Miracle.', time: 'Tue 8:40 PM' },
    { from: 'them', text: 'Ha — that grip index is going to move. Friday we go live arm. Have him bring the gray bat.', time: 'Tue 8:52 PM' },
    { from: 'me', text: 'Will do. Quick one — is the July re-test on the 1st or the 8th?', time: 'Wed 9:15 AM' },
    { from: 'them', text: 'July 1, 4pm, Cage 1. It’s on your schedule now.', time: 'Wed 9:31 AM' },
  ] },
  { id: 'th-2', with: 'Front Desk — Dawsonville', withRole: 'Facility', messages: [
    { from: 'them', text: 'Hi Jess! Your stored balance is $142.50. Want us to auto-reload at $50? Most families turn this on.', time: 'Mon 1:04 PM' },
    { from: 'me', text: 'Yes please — $50 reload when it drops under $25.', time: 'Mon 1:22 PM' },
    { from: 'them', text: 'Done! You’ll get a receipt each time. See Tyler at 2:30 ✔', time: 'Mon 1:25 PM' },
  ] },
  { id: 'th-3', with: 'College Bound Desk', withRole: 'Frozen Ropes USA', messages: [
    { from: 'them', text: 'Tyler is 4–5 years from recruiting windows, but families who start the academic profile early get the best fits. His Journey page shows the College Bound milestones when you’re ready.', time: 'May 20 11:00 AM' },
  ] },
]

export const REP_LOGS: RepLog[] = [
  { id: 'rl-1', date: 'Jun 11', focus: 'Stride box', reps: 24, quality: 4 },
  { id: 'rl-2', date: 'Jun 10', focus: 'Rice bucket', reps: 2, quality: 5 },
  { id: 'rl-3', date: 'Jun 9', focus: 'Tee — station 7', reps: 30, quality: 3 },
  { id: 'rl-4', date: 'Jun 8', focus: 'Wall drill', reps: 24, quality: 4 },
  { id: 'rl-5', date: 'Jun 6', focus: 'Stride box', reps: 20, quality: 3 },
  { id: 'rl-6', date: 'Jun 5', focus: 'Rice bucket', reps: 2, quality: 4 },
  { id: 'rl-7', date: 'Jun 4', focus: 'Tee — station 6', reps: 36, quality: 2 },
]

export const WELLNESS: WellnessEntry[] = [
  { week: 'May 11', sleepHrs: 8.1, meals: 64, throwingLoad: 210, loadLimit: 280, soreness: 2 },
  { week: 'May 18', sleepHrs: 7.6, meals: 70, throwingLoad: 245, loadLimit: 280, soreness: 2 },
  { week: 'May 25', sleepHrs: 8.4, meals: 72, throwingLoad: 198, loadLimit: 280, soreness: 1 },
  { week: 'Jun 1', sleepHrs: 7.9, meals: 75, throwingLoad: 262, loadLimit: 280, soreness: 3 },
  { week: 'Jun 8', sleepHrs: 8.6, meals: 81, throwingLoad: 231, loadLimit: 280, soreness: 2 },
]

export const JOURNEY: JourneyStage[] = [
  { id: 'j-1', name: 'Born to Play', ages: '3–5', status: 'done', highlight: 'First glove, first games, movement-first foundation.' },
  { id: 'j-2', name: 'Foundations', ages: '6–10', status: 'done', highlight: 'Catch & throw mechanics. First Rock Ready eval at age 9 — composite 52.' },
  { id: 'j-3', name: 'Player Development', ages: '11–13', status: 'current', highlight: 'Composite 74 and climbing. Strength Index leads the 12U board.' },
  { id: 'j-4', name: 'Performance', ages: '14–16', status: 'next', highlight: 'Velo development, workload management, showcase-readiness checkpoints.' },
  { id: 'j-5', name: 'College Bound', ages: '16–18', status: 'future', highlight: 'Verified metrics, video standards, academic + athletic fit matching.' },
]

export const COACH_ID = 'st-marcus'
export const TYLER = PLAYERS[0]
export const WHITMAN = FAMILIES[0]

export const playerById = (id: string) => PLAYERS.find((p) => p.id === id)
export const familyById = (id: string) => FAMILIES.find((f) => f.id === id)
export const classById = (id: string) => CLASSES.find((c) => c.id === id)
export const resourceById = (id: string) => RESOURCES.find((r) => r.id === id)
export const drillById = (id: string) => DRILLS.find((d) => d.id === id)
export const productById = (id: string) => PRODUCTS.find((p) => p.id === id)
export const staffById = (id: string) => STAFF.find((s) => s.id === id)
export const facilityById = (id: string) => FACILITIES.find((f) => f.id === id)
export const tierById = (id: string) => TIERS.find((t) => t.id === id)

export const PILLARS: { id: 'instruction' | 'operations' | 'programs' | 'marketing'; name: string; tagline: string }[] = [
  { id: 'instruction', name: 'Instruction', tagline: 'The Frozen Ropes method — drills, lectures, and the swing.' },
  { id: 'operations', name: 'Operations', tagline: 'Run the building: the Blueprint, staffing, safety, money.' },
  { id: 'programs', name: 'Programs', tagline: 'Curricula from Born to Play through College Bound.' },
  { id: 'marketing', name: 'Marketing', tagline: 'Fill the cages: launch playbooks, social, referrals.' },
]

// AI Drill Finder — canned semantic matches (demo inference)
export const DRILL_FINDER_PRESETS: { query: string; matches: { drillId: string; score: number; why: string }[] }[] = [
  {
    query: '9-year-old swinging late on fastballs',
    matches: [
      { drillId: 'd-stride', score: 0.94, why: 'Late contact usually starts with a late or open stride — constrain it first.' },
      { drillId: 'd-wall', score: 0.88, why: 'Shortens the path: a casted barrel is a slow barrel.' },
      { drillId: 'd-tee-ladder', score: 0.74, why: 'Inside-lane stations rebuild the contact point out front.' },
    ],
  },
  {
    query: 'weak grip, ball dying off the bat',
    matches: [
      { drillId: 'd-rice', score: 0.96, why: 'Grip Index work — the fastest lever on exit velocity for youth hitters.' },
      { drillId: 'd-tee-ladder', score: 0.71, why: 'Pair grip gains with barrel-control stations.' },
    ],
  },
  {
    query: 'slow glove-to-hand on double plays',
    matches: [
      { drillId: 'd-exchange', score: 0.95, why: 'Directly trains exchange speed under 0.9s.' },
      { drillId: 'd-tee-ladder', score: 0.42, why: 'Lower relevance — hitting-side drill.' },
    ],
  },
]
