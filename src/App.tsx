import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import SneakPeek from './pages/SneakPeek'

// Owner
const OwnerDashboard = lazy(() => import('./pages/owner/Dashboard'))
const Library = lazy(() => import('./pages/owner/Library'))
const PillarBrowse = lazy(() => import('./pages/owner/PillarBrowse'))
const ResourceDetail = lazy(() => import('./pages/owner/ResourceDetail'))
const Blueprint = lazy(() => import('./pages/owner/Blueprint'))
const Members = lazy(() => import('./pages/owner/Members'))
const MemberDetail = lazy(() => import('./pages/owner/MemberDetail'))
const OwnerCalendar = lazy(() => import('./pages/owner/Calendar'))
const Pos = lazy(() => import('./pages/owner/Pos'))
const Staff = lazy(() => import('./pages/owner/Staff'))
const OwnerRewards = lazy(() => import('./pages/owner/Rewards'))
const OwnerBoom = lazy(() => import('./pages/owner/Boom'))

// Coach
const CoachDashboard = lazy(() => import('./pages/coach/Dashboard'))
const CoachSchedule = lazy(() => import('./pages/coach/Schedule'))
const ClassRoster = lazy(() => import('./pages/coach/ClassRoster'))
const CoachPlayers = lazy(() => import('./pages/coach/Players'))
const PlayerDevelopment = lazy(() => import('./pages/coach/PlayerDevelopment'))
const VideoReview = lazy(() => import('./pages/coach/VideoReview'))
const SessionNotes = lazy(() => import('./pages/coach/SessionNotes'))
const CoachDrills = lazy(() => import('./pages/coach/Drills'))

// Player
const PlayerHome = lazy(() => import('./pages/player/Home'))
const MyDevelopment = lazy(() => import('./pages/player/Development'))
const QualityReps = lazy(() => import('./pages/player/Reps'))
const MyVideos = lazy(() => import('./pages/player/Videos'))
const MyDrills = lazy(() => import('./pages/player/Drills'))
const PlayerSchedule = lazy(() => import('./pages/player/Schedule'))
const Journey = lazy(() => import('./pages/player/Journey'))
const PlayerRewards = lazy(() => import('./pages/player/Rewards'))

// Parent
const ParentHome = lazy(() => import('./pages/parent/Home'))
const Progress = lazy(() => import('./pages/parent/Progress'))
const Wellness = lazy(() => import('./pages/parent/Wellness'))
const Messages = lazy(() => import('./pages/parent/Messages'))
const ParentSchedule = lazy(() => import('./pages/parent/Schedule'))
const Billing = lazy(() => import('./pages/parent/Billing'))
const Shop = lazy(() => import('./pages/parent/Shop'))
const Recruiting = lazy(() => import('./pages/parent/Recruiting'))

// HQ
const HqDashboard = lazy(() => import('./pages/hq/Dashboard'))
const Facilities = lazy(() => import('./pages/hq/Facilities'))
const FacilityDetail = lazy(() => import('./pages/hq/FacilityDetail'))
const ContentCms = lazy(() => import('./pages/hq/ContentCms'))
const Matrix = lazy(() => import('./pages/hq/Matrix'))
const Pipeline = lazy(() => import('./pages/hq/Pipeline'))
const HqBoom = lazy(() => import('./pages/hq/Boom'))
const HqRewards = lazy(() => import('./pages/hq/Rewards'))

function Loading() {
  return (
    <div className="flex h-48 items-center justify-center" role="status" aria-label="Loading">
      <svg width="64" height="40" viewBox="0 0 72 48" fill="none" aria-hidden>
        <path d="M8 24 H64" stroke="var(--color-frost-400)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="240" className="animate-rope" />
        <circle cx="64" cy="24" r="3" fill="var(--color-frost-400)" />
      </svg>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sneak-peek" element={<SneakPeek />} />

        <Route element={<AppShell role="owner" />}>
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/owner/library" element={<Library />} />
          <Route path="/owner/library/:pillar" element={<PillarBrowse />} />
          <Route path="/owner/library/resource/:id" element={<ResourceDetail />} />
          <Route path="/owner/blueprint" element={<Blueprint />} />
          <Route path="/owner/members" element={<Members />} />
          <Route path="/owner/members/:id" element={<MemberDetail />} />
          <Route path="/owner/calendar" element={<OwnerCalendar />} />
          <Route path="/owner/pos" element={<Pos />} />
          <Route path="/owner/staff" element={<Staff />} />
          <Route path="/owner/rewards" element={<OwnerRewards />} />
          <Route path="/owner/boom" element={<OwnerBoom />} />
        </Route>

        <Route element={<AppShell role="coach" />}>
          <Route path="/coach" element={<CoachDashboard />} />
          <Route path="/coach/schedule" element={<CoachSchedule />} />
          <Route path="/coach/classes/:id" element={<ClassRoster />} />
          <Route path="/coach/players" element={<CoachPlayers />} />
          <Route path="/coach/players/:id" element={<PlayerDevelopment />} />
          <Route path="/coach/video" element={<VideoReview />} />
          <Route path="/coach/notes" element={<SessionNotes />} />
          <Route path="/coach/drills" element={<CoachDrills />} />
        </Route>

        <Route element={<AppShell role="player" />}>
          <Route path="/player" element={<PlayerHome />} />
          <Route path="/player/development" element={<MyDevelopment />} />
          <Route path="/player/reps" element={<QualityReps />} />
          <Route path="/player/videos" element={<MyVideos />} />
          <Route path="/player/drills" element={<MyDrills />} />
          <Route path="/player/schedule" element={<PlayerSchedule />} />
          <Route path="/player/journey" element={<Journey />} />
          <Route path="/player/rewards" element={<PlayerRewards />} />
        </Route>

        <Route element={<AppShell role="parent" />}>
          <Route path="/parent" element={<ParentHome />} />
          <Route path="/parent/progress" element={<Progress />} />
          <Route path="/parent/wellness" element={<Wellness />} />
          <Route path="/parent/messages" element={<Messages />} />
          <Route path="/parent/schedule" element={<ParentSchedule />} />
          <Route path="/parent/billing" element={<Billing />} />
          <Route path="/parent/shop" element={<Shop />} />
          <Route path="/parent/recruiting" element={<Recruiting />} />
        </Route>

        <Route element={<AppShell role="hq" />}>
          <Route path="/hq" element={<HqDashboard />} />
          <Route path="/hq/facilities" element={<Facilities />} />
          <Route path="/hq/facilities/:id" element={<FacilityDetail />} />
          <Route path="/hq/content" element={<ContentCms />} />
          <Route path="/hq/matrix" element={<Matrix />} />
          <Route path="/hq/pipeline" element={<Pipeline />} />
          <Route path="/hq/boom" element={<HqBoom />} />
          <Route path="/hq/rewards" element={<HqRewards />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
