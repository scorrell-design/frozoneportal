import type { LucideIcon } from 'lucide-react'
import {
  BarChart3, BookOpen, CalendarDays, ClipboardList, Clock, DollarSign, Dumbbell,
  GraduationCap, Heart, Home, Landmark, LayoutGrid, LibraryBig, MapPin,
  Megaphone, MessageSquare, Route, ShoppingBag, Sparkles, Star, Store, Trophy,
  Users, Video, Wallet,
} from 'lucide-react'
import type { Role } from './types'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  mobile?: boolean // include in mobile bottom bar
}

export const NAV_CONFIG: Record<Exclude<Role, 'prospect'>, NavItem[]> = {
  owner: [
    { to: '/owner', label: 'Dashboard', icon: Home, mobile: true },
    { to: '/owner/library', label: 'Frozone Library', icon: LibraryBig, mobile: true },
    { to: '/owner/blueprint', label: 'The Blueprint', icon: BarChart3 },
    { to: '/owner/members', label: 'Members', icon: Users, mobile: true },
    { to: '/owner/calendar', label: 'Programs & Cages', icon: CalendarDays, mobile: true },
    { to: '/owner/pos', label: 'Point of Sale', icon: Store },
    { to: '/owner/staff', label: 'Staff & Timeclock', icon: Clock },
    { to: '/owner/rewards', label: 'Rewards', icon: Star },
    { to: '/owner/boom', label: 'Boom Calls', icon: Megaphone },
  ],
  coach: [
    { to: '/coach', label: 'Today', icon: Home, mobile: true },
    { to: '/coach/schedule', label: 'My Schedule', icon: CalendarDays, mobile: true },
    { to: '/coach/players', label: 'My Players', icon: Users, mobile: true },
    { to: '/coach/video', label: 'Video Review', icon: Video, mobile: true },
    { to: '/coach/notes', label: 'Session Notes', icon: ClipboardList },
    { to: '/coach/drills', label: 'Drill Library', icon: Dumbbell },
  ],
  player: [
    { to: '/player', label: 'Home', icon: Home, mobile: true },
    { to: '/player/development', label: 'My Development', icon: BarChart3, mobile: true },
    { to: '/player/reps', label: 'Quality Reps', icon: Dumbbell, mobile: true },
    { to: '/player/videos', label: 'My Videos', icon: Video },
    { to: '/player/drills', label: 'My Drills', icon: ClipboardList, mobile: true },
    { to: '/player/schedule', label: 'Schedule', icon: CalendarDays },
    { to: '/player/journey', label: 'My Journey', icon: Route },
    { to: '/player/rewards', label: 'Rewards', icon: Trophy },
  ],
  parent: [
    { to: '/parent', label: 'Home', icon: Home, mobile: true },
    { to: '/parent/progress', label: "Tyler's Progress", icon: BarChart3, mobile: true },
    { to: '/parent/wellness', label: 'Wellness', icon: Heart },
    { to: '/parent/messages', label: 'Messages', icon: MessageSquare, mobile: true },
    { to: '/parent/schedule', label: 'Schedule & Booking', icon: CalendarDays, mobile: true },
    { to: '/parent/billing', label: 'Billing', icon: Wallet },
    { to: '/parent/shop', label: 'Pro Shop', icon: ShoppingBag },
    { to: '/parent/recruiting', label: 'College Bound', icon: GraduationCap },
  ],
  hq: [
    { to: '/hq', label: 'Network', icon: LayoutGrid, mobile: true },
    { to: '/hq/facilities', label: 'Facilities', icon: MapPin, mobile: true },
    { to: '/hq/content', label: 'Content CMS', icon: BookOpen, mobile: true },
    { to: '/hq/matrix', label: 'Membership Matrix', icon: Landmark },
    { to: '/hq/pipeline', label: 'License Pipeline', icon: DollarSign, mobile: true },
    { to: '/hq/boom', label: 'Boom Calls', icon: Megaphone },
    { to: '/hq/rewards', label: 'Network Rewards', icon: Sparkles },
  ],
}
