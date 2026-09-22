import {
  ArrowLeftRight,
  Ban,
  Bell,
  BriefcaseBusiness,
  Calculator,
  ChartColumn,
  ChartColumnBig,
  ChartPie,
  CircleHelp,
  ClipboardList,
  CreditCard,
  FileCheck,
  FileText,
  FileWarning,
  Files,
  FolderKanban,
  Gauge,
  Grid3x3,
  HandCoins,
  IdCard,
  Inbox,
  Info,
  Landmark,
  LayoutDashboard,
  Link,
  Link2,
  Megaphone,
  MessageSquareText,
  Newspaper,
  Percent,
  Phone,
  Plug,
  ScrollText,
  Settings2,
  Shapes,
  ShieldCheck,
  TrendingUp,
  UserCog,
  Users,
  UsersRound,
  Wallet,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from './routes'

export interface NavLeaf {
  label: string
  to: string
  icon: LucideIcon
}

export interface NavLinkEntry extends NavLeaf {
  kind: 'link'
}

export interface NavGroupEntry {
  kind: 'group'
  label: string
  icon: LucideIcon
  /** Section prefix; visiting it redirects to the first item. */
  root: string
  items: NavLeaf[]
}

export type NavEntry = NavLinkEntry | NavGroupEntry

/** Single source of truth for the sidebar and the router. */
export const NAVIGATION: NavEntry[] = [
  { kind: 'link', label: 'Dashboard', to: ROUTES.dashboard, icon: LayoutDashboard },
  {
    kind: 'group',
    label: 'Projects',
    icon: BriefcaseBusiness,
    root: ROUTES.projects.root,
    items: [
      { label: 'Projects', to: ROUTES.projects.list, icon: FolderKanban },
      { label: 'Project types', to: ROUTES.projects.types, icon: Shapes },
      { label: 'Project investors', to: ROUTES.projects.investors, icon: UsersRound },
    ],
  },
  {
    kind: 'group',
    label: 'Investors',
    icon: Users,
    root: ROUTES.investors.root,
    items: [
      { label: 'Investors', to: ROUTES.investors.list, icon: Users },
      { label: 'Accounts', to: ROUTES.investors.accounts, icon: Landmark },
      { label: 'Cards', to: ROUTES.investors.cards, icon: CreditCard },
    ],
  },
  {
    kind: 'group',
    label: 'Finance',
    icon: Wallet,
    root: ROUTES.finance.root,
    items: [
      { label: 'Orders', to: ROUTES.finance.orders, icon: ClipboardList },
      { label: 'Transactions', to: ROUTES.finance.transactions, icon: ArrowLeftRight },
      { label: 'Dividends', to: ROUTES.finance.dividends, icon: HandCoins },
      { label: 'Currency rates', to: ROUTES.finance.currencyRates, icon: TrendingUp },
      { label: 'Currency percent', to: ROUTES.finance.currencyPercent, icon: Percent },
      { label: 'Transaction policy', to: ROUTES.finance.transactionPolicy, icon: ScrollText },
      { label: 'Financial modeling', to: ROUTES.finance.financialModeling, icon: Calculator },
    ],
  },
  {
    kind: 'group',
    label: 'Compliance',
    icon: ShieldCheck,
    root: ROUTES.compliance.root,
    items: [
      { label: 'AML blacklist', to: ROUTES.compliance.amlBlacklist, icon: Ban },
      { label: 'Investor score', to: ROUTES.compliance.investorScore, icon: Gauge },
      { label: 'RBA matrix', to: ROUTES.compliance.rbaMatrix, icon: Grid3x3 },
      { label: 'STR/SAR', to: ROUTES.compliance.strSar, icon: FileWarning },
      { label: 'Policy types', to: ROUTES.compliance.policyTypes, icon: FileCheck },
    ],
  },
  {
    kind: 'group',
    label: 'Content',
    icon: FileText,
    root: ROUTES.content.root,
    items: [
      { label: 'News', to: ROUTES.content.news, icon: Newspaper },
      { label: 'FAQ', to: ROUTES.content.faq, icon: CircleHelp },
      { label: 'Documents', to: ROUTES.content.documents, icon: Files },
      { label: 'About us', to: ROUTES.content.aboutUs, icon: Info },
      { label: 'Contact info', to: ROUTES.content.contactInfo, icon: Phone },
    ],
  },
  {
    kind: 'group',
    label: 'Communication',
    icon: Megaphone,
    root: ROUTES.communication.root,
    items: [
      { label: 'Notifications', to: ROUTES.communication.notifications, icon: Bell },
      { label: 'SMS templates', to: ROUTES.communication.smsTemplates, icon: MessageSquareText },
      { label: 'Maintenance works', to: ROUTES.communication.maintenance, icon: Wrench },
    ],
  },
  {
    kind: 'group',
    label: 'Referrals',
    icon: Link2,
    root: ROUTES.referrals.root,
    items: [
      { label: 'Referral links', to: ROUTES.referrals.links, icon: Link },
      { label: 'Link settings', to: ROUTES.referrals.settings, icon: Settings2 },
    ],
  },
  {
    kind: 'group',
    label: 'Analytics',
    icon: ChartColumn,
    root: ROUTES.analytics.root,
    items: [
      { label: 'Dividends', to: ROUTES.analytics.dividends, icon: ChartPie },
      { label: 'By tariff', to: ROUTES.analytics.tariffs, icon: ChartColumnBig },
    ],
  },
  {
    kind: 'group',
    label: 'Integrations',
    icon: Plug,
    root: ROUTES.integrations.root,
    items: [{ label: 'Bitrix leads', to: ROUTES.integrations.bitrixLeads, icon: Inbox }],
  },
  {
    kind: 'group',
    label: 'Staff',
    icon: IdCard,
    root: ROUTES.staff.root,
    items: [{ label: 'Employees', to: ROUTES.staff.employees, icon: UserCog }],
  },
]
