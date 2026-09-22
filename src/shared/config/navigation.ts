import {
  KeyRound,
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
import type { Resource } from '@/shared/permissions'
import { ROUTES } from './routes'

export interface NavLeaf {
  label: string
  to: string
  icon: LucideIcon
  /** What the page shows: decides sidebar visibility and route access (DESIGN.md §6) */
  resource: Resource
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
  {
    kind: 'link',
    label: 'Dashboard',
    to: ROUTES.dashboard,
    resource: { menuId: '0ee1c323-a290-4616-a0db-c343a5bff302' },
    icon: LayoutDashboard,
  },
  {
    kind: 'group',
    label: 'Projects',
    icon: BriefcaseBusiness,
    root: ROUTES.projects.root,
    items: [
      {
        label: 'Projects',
        to: ROUTES.projects.list,
        resource: { table: 'projects' },
        icon: FolderKanban,
      },
      {
        label: 'Project types',
        to: ROUTES.projects.types,
        resource: { table: 'project_types' },
        icon: Shapes,
      },
      {
        label: 'Project investors',
        to: ROUTES.projects.investors,
        resource: { table: 'project_investors' },
        icon: UsersRound,
      },
    ],
  },
  {
    kind: 'group',
    label: 'Investors',
    icon: Users,
    root: ROUTES.investors.root,
    items: [
      {
        label: 'Investors',
        to: ROUTES.investors.list,
        resource: { table: 'investors' },
        icon: Users,
      },
      {
        label: 'Accounts',
        to: ROUTES.investors.accounts,
        resource: { table: 'account' },
        icon: Landmark,
      },
      {
        label: 'Cards',
        to: ROUTES.investors.cards,
        resource: { table: 'investor_cards' },
        icon: CreditCard,
      },
    ],
  },
  {
    kind: 'group',
    label: 'Finance',
    icon: Wallet,
    root: ROUTES.finance.root,
    items: [
      {
        label: 'Orders',
        to: ROUTES.finance.orders,
        resource: { table: 'orders' },
        icon: ClipboardList,
      },
      {
        label: 'Transactions',
        to: ROUTES.finance.transactions,
        resource: { table: 'transactions' },
        icon: ArrowLeftRight,
      },
      {
        label: 'Dividends',
        to: ROUTES.finance.dividends,
        resource: { table: 'dividend' },
        icon: HandCoins,
      },
      {
        label: 'Currency rates',
        to: ROUTES.finance.currencyRates,
        resource: { table: 'currency_rates' },
        icon: TrendingUp,
      },
      {
        label: 'Currency percent',
        to: ROUTES.finance.currencyPercent,
        resource: { table: 'currency_percent' },
        icon: Percent,
      },
      {
        label: 'Transaction policy',
        to: ROUTES.finance.transactionPolicy,
        resource: { table: 'transaction_policy' },
        icon: ScrollText,
      },
      {
        label: 'Financial modeling',
        to: ROUTES.finance.financialModeling,
        resource: { table: 'financial_modeling' },
        icon: Calculator,
      },
    ],
  },
  {
    kind: 'group',
    label: 'Compliance',
    icon: ShieldCheck,
    root: ROUTES.compliance.root,
    items: [
      {
        label: 'AML blacklist',
        to: ROUTES.compliance.amlBlacklist,
        resource: { table: 'black_list' },
        icon: Ban,
      },
      {
        label: 'Investor score',
        to: ROUTES.compliance.investorScore,
        resource: { table: 'investor_score' },
        icon: Gauge,
      },
      {
        label: 'RBA matrix',
        to: ROUTES.compliance.rbaMatrix,
        resource: { table: 'rba_matrix' },
        icon: Grid3x3,
      },
      {
        label: 'STR/SAR',
        to: ROUTES.compliance.strSar,
        resource: { table: 'str_sar' },
        icon: FileWarning,
      },
      {
        label: 'Policy types',
        to: ROUTES.compliance.policyTypes,
        resource: { table: 'policy_Type' },
        icon: FileCheck,
      },
    ],
  },
  {
    kind: 'group',
    label: 'Content',
    icon: FileText,
    root: ROUTES.content.root,
    items: [
      { label: 'News', to: ROUTES.content.news, resource: { table: 'news' }, icon: Newspaper },
      { label: 'FAQ', to: ROUTES.content.faq, resource: { table: 'faq' }, icon: CircleHelp },
      {
        label: 'Documents',
        to: ROUTES.content.documents,
        resource: { table: 'documents' },
        icon: Files,
      },
      {
        label: 'About us',
        to: ROUTES.content.aboutUs,
        resource: { table: 'about_us' },
        icon: Info,
      },
      {
        label: 'Contact info',
        to: ROUTES.content.contactInfo,
        resource: { table: 'contact_info' },
        icon: Phone,
      },
    ],
  },
  {
    kind: 'group',
    label: 'Communication',
    icon: Megaphone,
    root: ROUTES.communication.root,
    items: [
      {
        label: 'Notifications',
        to: ROUTES.communication.notifications,
        resource: { table: 'notification' },
        icon: Bell,
      },
      {
        label: 'SMS templates',
        to: ROUTES.communication.smsTemplates,
        resource: { table: 'sms_template' },
        icon: MessageSquareText,
      },
      {
        label: 'Maintenance works',
        to: ROUTES.communication.maintenance,
        resource: { table: 'maintenance_works' },
        icon: Wrench,
      },
    ],
  },
  {
    kind: 'group',
    label: 'Referrals',
    icon: Link2,
    root: ROUTES.referrals.root,
    items: [
      {
        label: 'Referral links',
        to: ROUTES.referrals.links,
        resource: { table: 'referral_links' },
        icon: Link,
      },
      {
        label: 'Link settings',
        to: ROUTES.referrals.settings,
        resource: { table: 'link_settings' },
        icon: Settings2,
      },
    ],
  },
  {
    kind: 'group',
    label: 'Analytics',
    icon: ChartColumn,
    root: ROUTES.analytics.root,
    items: [
      {
        label: 'Dividends',
        to: ROUTES.analytics.dividends,
        resource: { menuId: '11074988-7d86-427a-91c3-3472c1db7b08' },
        icon: ChartPie,
      },
      {
        label: 'By tariff',
        to: ROUTES.analytics.tariffs,
        resource: { menuId: '479855ef-96d8-4888-b7ba-44b4d8652d55' },
        icon: ChartColumnBig,
      },
    ],
  },
  {
    kind: 'group',
    label: 'Integrations',
    icon: Plug,
    root: ROUTES.integrations.root,
    items: [
      {
        label: 'Bitrix leads',
        to: ROUTES.integrations.bitrixLeads,
        resource: { table: 'bitrix_leads' },
        icon: Inbox,
      },
    ],
  },
  {
    kind: 'group',
    label: 'Staff',
    icon: IdCard,
    root: ROUTES.staff.root,
    items: [
      {
        label: 'Employees',
        to: ROUTES.staff.employees,
        resource: { table: 'employee' },
        icon: UserCog,
      },
      {
        label: 'Roles & permissions',
        to: ROUTES.staff.roles,
        resource: { table: 'role' },
        icon: KeyRound,
      },
    ],
  },
]
