export type Role = 'owner' | 'coach' | 'player' | 'parent' | 'hq' | 'prospect'

export type Pillar = 'instruction' | 'operations' | 'programs' | 'marketing'
export type ResourceType = 'video' | 'pdf' | 'spreadsheet' | 'drill' | 'lecture'

export interface Persona {
  role: Role
  name: string
  title: string
  initials: string
  blurb: string
  home: string
}

export interface Facility {
  id: string
  name: string
  city: string
  state: string
  since: number
  members: number
  revenueYtd: number
  utilization: number // 0-100
  rockReadyRate: number // 0-100
  status: 'open' | 'launching'
  owner: string
}

export type RockIndexKey =
  | 'strength'
  | 'grip'
  | 'batSpeed'
  | 'armStrength'
  | 'speed'
  | 'fielding'
  | 'baseballIQ'

export interface RockIndex {
  key: RockIndexKey
  label: string
  score: number // 0-100 percentile
  grade: string
  trend: number[] // last 8 evals
}

export interface Player {
  id: string
  name: string
  age: number
  ageGroup: string
  position: string
  jersey: number
  tier: TierId
  familyId: string
  hue: number // avatar hue
  composite: number
  compositeTrend: number[]
  indexes: RockIndex[]
  streakDays: number
  program: string
  flags: { unpaid?: boolean; gearMissing?: string; waiver?: boolean }
}

export type TierId = 'rookie' | 'prospect' | 'allstar' | 'franchise'

export interface Tier {
  id: TierId
  name: string
  price: number
  color: string
  benefits: string[]
  members: number
}

export interface Family {
  id: string
  parentName: string
  playerIds: string[]
  tier: TierId
  status: 'active' | 'past_due' | 'paused'
  storedBalance: number
  rewardPoints: number
  joined: string
  phone: string
}

export interface ProgramClass {
  id: string
  name: string
  type: 'class' | 'lesson' | 'camp' | 'rental'
  coachId: string
  cage: string
  day: number // 0=Mon
  start: string // "14:30"
  durationMin: number
  capacity: number
  enrolled: string[] // player ids
  price: number
}

export interface Resource {
  id: string
  title: string
  pillar: Pillar
  type: ResourceType
  description: string
  meta: string // "12 min" | "8 pages" | "3 tabs"
  views: number
  status: 'published' | 'draft' | 'archived'
  tags: string[]
  updated: string
}

export interface Drill {
  id: string
  resourceId: string
  title: string
  focus: string[]
  ages: string
  equipment: string
  duration: string
  description: string
}

export interface SessionNote {
  id: string
  playerId: string
  coachId: string
  date: string
  focus: string
  workedOn: string
  homework: string[] // drill ids
  nextFocus: string
  sentToParent: boolean
}

export interface AiObservation {
  id: string
  text: string
  confidence: number
  status: 'pending' | 'confirmed' | 'dismissed'
}

export interface SessionVideo {
  id: string
  playerId: string
  title: string
  date: string
  durationSec: number
  status: 'processing' | 'review' | 'shared'
  hue: number
  observations: AiObservation[]
  coachComment?: string
}

export interface Product {
  id: string
  name: string
  category: 'pro-shop' | 'concessions' | 'cage-time'
  price: number
  points: number
  stock: number
  hue: number
}

export interface Sale {
  id: string
  time: string
  items: { productId: string; qty: number }[]
  total: number
  tender: 'card' | 'cash' | 'balance' | 'points'
  memberName?: string
}

export interface Invoice {
  id: string
  familyId: string
  date: string
  description: string
  amount: number
  status: 'paid' | 'due' | 'failed'
}

export interface RewardEvent {
  id: string
  date: string
  facility: string
  description: string
  points: number // + earn, - redeem
}

export interface College {
  id: string
  name: string
  division: 'D1' | 'D2' | 'D3'
  region: string
  state: string
  enrollment: number
  academics: number // 0-100 selectivity index
  baseball: number // 0-100 program strength
  tuition: number
  fit: number // computed for Tyler
}

export interface Prospect {
  id: string
  name: string
  market: string
  stage: 'lead' | 'toured' | 'sneak-peek' | 'committed'
  value: number
  note: string
  days: number
}

export interface BoomCall {
  id: string
  date: string
  theme: string
  topics: string[]
  attendance: number
  recorded: boolean
  takeaway: string
}

export interface BlueprintLine {
  category: string
  group: 'revenue' | 'expense'
  actual: number[]
  benchmark: number[]
}

export interface StaffMember {
  id: string
  name: string
  role: string
  rate: number
  clockedIn: boolean
  hoursWeek: number
  hue: number
}

export interface MessageThread {
  id: string
  with: string
  withRole: string
  messages: { from: 'me' | 'them'; text: string; time: string }[]
}

export interface RepLog {
  id: string
  date: string
  focus: string
  reps: number
  quality: number // 1-5
}

export interface WellnessEntry {
  week: string
  sleepHrs: number
  meals: number // quality score 0-100
  throwingLoad: number // throws
  loadLimit: number
  soreness: number // 1-5
}

export interface JourneyStage {
  id: string
  name: string
  ages: string
  status: 'done' | 'current' | 'next' | 'future'
  highlight: string
}

export interface AttendanceMark {
  playerId: string
  status: 'present' | 'absent' | 'late' | null
}
