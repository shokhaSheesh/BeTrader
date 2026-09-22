import { ArrowLeftRight, LayoutDashboard, Settings, Users, type LucideIcon } from 'lucide-react'
import { ROUTES } from '@/shared/config/routes'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Users', to: ROUTES.users, icon: Users },
  { label: 'Transactions', to: ROUTES.transactions, icon: ArrowLeftRight },
  { label: 'Settings', to: ROUTES.settings, icon: Settings },
]
