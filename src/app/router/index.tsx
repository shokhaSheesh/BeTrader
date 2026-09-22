/* oxlint-disable react/only-export-components -- route config module, not an HMR boundary */
import { lazy, Suspense, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react'
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'
import { NAVIGATION } from '@/shared/config/navigation'
import { RECORDS, ROUTES } from '@/shared/config/routes'
import { AdminLayout } from '@/widgets/layout/AdminLayout'
import { GuestRoute, ProtectedRoute } from './guards'

const LoginPage = lazy(() => import('@/pages/login'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))
const PlaceholderPage = lazy(() => import('@/pages/placeholder'))

/** Built pages by path. Any navigation path missing here renders PlaceholderPage. */
const PAGES: Partial<Record<string, LazyExoticComponent<ComponentType>>> = {
  [ROUTES.dashboard]: lazy(() => import('@/pages/dashboard')),
  [ROUTES.projects.list]: lazy(() => import('@/pages/projects')),
  [ROUTES.projects.types]: lazy(() => import('@/pages/project-types')),
  [ROUTES.projects.investors]: lazy(() => import('@/pages/project-investors')),
  [ROUTES.investors.list]: lazy(() => import('@/pages/investors')),
  [ROUTES.investors.accounts]: lazy(() => import('@/pages/accounts')),
  [ROUTES.investors.cards]: lazy(() => import('@/pages/cards')),
  [ROUTES.finance.orders]: lazy(() => import('@/pages/orders')),
  [ROUTES.finance.transactions]: lazy(() => import('@/pages/transactions')),
  [ROUTES.finance.dividends]: lazy(() => import('@/pages/dividends')),
  [ROUTES.finance.currencyRates]: lazy(() => import('@/pages/currency-rates')),
  [ROUTES.finance.currencyPercent]: lazy(() => import('@/pages/currency-percent')),
  [ROUTES.finance.transactionPolicy]: lazy(() => import('@/pages/transaction-policy')),
  [ROUTES.finance.financialModeling]: lazy(() => import('@/pages/financial-modeling')),
  [ROUTES.compliance.amlBlacklist]: lazy(() => import('@/pages/aml-blacklist')),
  [ROUTES.compliance.investorScore]: lazy(() => import('@/pages/investor-score')),
  [ROUTES.compliance.rbaMatrix]: lazy(() => import('@/pages/rba-matrix')),
  [ROUTES.compliance.strSar]: lazy(() => import('@/pages/str-sar')),
  [ROUTES.compliance.policyTypes]: lazy(() => import('@/pages/policy-types')),
  [ROUTES.content.news]: lazy(() => import('@/pages/news')),
  [ROUTES.content.faq]: lazy(() => import('@/pages/faq')),
  [ROUTES.content.documents]: lazy(() => import('@/pages/documents')),
  [ROUTES.content.aboutUs]: lazy(() => import('@/pages/about-us')),
  [ROUTES.content.contactInfo]: lazy(() => import('@/pages/contact-info')),
  [ROUTES.communication.notifications]: lazy(() => import('@/pages/notifications')),
  [ROUTES.communication.smsTemplates]: lazy(() => import('@/pages/sms-templates')),
  [ROUTES.communication.maintenance]: lazy(() => import('@/pages/maintenance')),
  [ROUTES.analytics.dividends]: lazy(() => import('@/pages/analytics-dividends')),
  [ROUTES.analytics.tariffs]: lazy(() => import('@/pages/analytics-tariffs')),
}

/** Detail / create / edit pages per record type. */
const RECORD_PAGES: {
  routes: (typeof RECORDS)[keyof typeof RECORDS]
  detail?: LazyExoticComponent<ComponentType>
  create?: LazyExoticComponent<ComponentType>
  edit?: LazyExoticComponent<ComponentType>
}[] = [
  {
    routes: RECORDS.projects,
    detail: lazy(() => import('@/pages/projects/DetailPage')),
    create: lazy(() => import('@/pages/projects/CreatePage')),
    edit: lazy(() => import('@/pages/projects/EditPage')),
  },
  {
    routes: RECORDS.projectTypes,
    detail: lazy(() => import('@/pages/project-types/DetailPage')),
    create: lazy(() => import('@/pages/project-types/CreatePage')),
    edit: lazy(() => import('@/pages/project-types/EditPage')),
  },
  {
    routes: RECORDS.projectInvestors,
    detail: lazy(() => import('@/pages/project-investors/DetailPage')),
    create: lazy(() => import('@/pages/project-investors/CreatePage')),
    edit: lazy(() => import('@/pages/project-investors/EditPage')),
  },
  {
    routes: RECORDS.investors,
    detail: lazy(() => import('@/pages/investors/DetailPage')),
    create: lazy(() => import('@/pages/investors/CreatePage')),
    edit: lazy(() => import('@/pages/investors/EditPage')),
  },
  {
    routes: RECORDS.accounts,
    detail: lazy(() => import('@/pages/accounts/DetailPage')),
    create: lazy(() => import('@/pages/accounts/CreatePage')),
    edit: lazy(() => import('@/pages/accounts/EditPage')),
  },
  {
    routes: RECORDS.cards,
    detail: lazy(() => import('@/pages/cards/DetailPage')),
    create: lazy(() => import('@/pages/cards/CreatePage')),
    edit: lazy(() => import('@/pages/cards/EditPage')),
  },
  {
    routes: RECORDS.orders,
    detail: lazy(() => import('@/pages/orders/DetailPage')),
    create: lazy(() => import('@/pages/orders/CreatePage')),
    edit: lazy(() => import('@/pages/orders/EditPage')),
  },
  {
    routes: RECORDS.transactions,
    detail: lazy(() => import('@/pages/transactions/DetailPage')),
  },
  {
    routes: RECORDS.dividends,
    detail: lazy(() => import('@/pages/dividends/DetailPage')),
    create: lazy(() => import('@/pages/dividends/CreatePage')),
    edit: lazy(() => import('@/pages/dividends/EditPage')),
  },
  {
    routes: RECORDS.currencyRates,
    detail: lazy(() => import('@/pages/currency-rates/DetailPage')),
    create: lazy(() => import('@/pages/currency-rates/CreatePage')),
    edit: lazy(() => import('@/pages/currency-rates/EditPage')),
  },
  {
    routes: RECORDS.currencyPercent,
    detail: lazy(() => import('@/pages/currency-percent/DetailPage')),
    create: lazy(() => import('@/pages/currency-percent/CreatePage')),
    edit: lazy(() => import('@/pages/currency-percent/EditPage')),
  },
  {
    routes: RECORDS.transactionPolicy,
    detail: lazy(() => import('@/pages/transaction-policy/DetailPage')),
    create: lazy(() => import('@/pages/transaction-policy/CreatePage')),
    edit: lazy(() => import('@/pages/transaction-policy/EditPage')),
  },
  {
    routes: RECORDS.financialModeling,
    detail: lazy(() => import('@/pages/financial-modeling/DetailPage')),
    create: lazy(() => import('@/pages/financial-modeling/CreatePage')),
    edit: lazy(() => import('@/pages/financial-modeling/EditPage')),
  },
  {
    routes: RECORDS.amlBlacklist,
    detail: lazy(() => import('@/pages/aml-blacklist/DetailPage')),
    create: lazy(() => import('@/pages/aml-blacklist/CreatePage')),
    edit: lazy(() => import('@/pages/aml-blacklist/EditPage')),
  },
  {
    routes: RECORDS.investorScore,
    detail: lazy(() => import('@/pages/investor-score/DetailPage')),
    create: lazy(() => import('@/pages/investor-score/CreatePage')),
    edit: lazy(() => import('@/pages/investor-score/EditPage')),
  },
  {
    routes: RECORDS.rbaMatrix,
    detail: lazy(() => import('@/pages/rba-matrix/DetailPage')),
    create: lazy(() => import('@/pages/rba-matrix/CreatePage')),
    edit: lazy(() => import('@/pages/rba-matrix/EditPage')),
  },
  {
    routes: RECORDS.strSar,
    detail: lazy(() => import('@/pages/str-sar/DetailPage')),
    create: lazy(() => import('@/pages/str-sar/CreatePage')),
    edit: lazy(() => import('@/pages/str-sar/EditPage')),
  },
  {
    routes: RECORDS.policyTypes,
    detail: lazy(() => import('@/pages/policy-types/DetailPage')),
    create: lazy(() => import('@/pages/policy-types/CreatePage')),
    edit: lazy(() => import('@/pages/policy-types/EditPage')),
  },
  {
    routes: RECORDS.news,
    detail: lazy(() => import('@/pages/news/DetailPage')),
    create: lazy(() => import('@/pages/news/CreatePage')),
    edit: lazy(() => import('@/pages/news/EditPage')),
  },
  {
    routes: RECORDS.faq,
    detail: lazy(() => import('@/pages/faq/DetailPage')),
    create: lazy(() => import('@/pages/faq/CreatePage')),
    edit: lazy(() => import('@/pages/faq/EditPage')),
  },
  {
    routes: RECORDS.documents,
    detail: lazy(() => import('@/pages/documents/DetailPage')),
    create: lazy(() => import('@/pages/documents/CreatePage')),
    edit: lazy(() => import('@/pages/documents/EditPage')),
  },
  {
    routes: RECORDS.notifications,
    detail: lazy(() => import('@/pages/notifications/DetailPage')),
    create: lazy(() => import('@/pages/notifications/CreatePage')),
    edit: lazy(() => import('@/pages/notifications/EditPage')),
  },
  {
    routes: RECORDS.smsTemplates,
    detail: lazy(() => import('@/pages/sms-templates/DetailPage')),
    create: lazy(() => import('@/pages/sms-templates/CreatePage')),
    edit: lazy(() => import('@/pages/sms-templates/EditPage')),
  },
  // Settings page (one record): the list route shows it, so only edit is needed.
  { routes: RECORDS.aboutUs, edit: lazy(() => import('@/pages/about-us/EditPage')) },
  // Settings page (one record): the list route shows it, so only edit is needed.
  { routes: RECORDS.contactInfo, edit: lazy(() => import('@/pages/contact-info/EditPage')) },
  // Settings page (one record): the list route shows it, so only edit is needed.
  { routes: RECORDS.maintenance, edit: lazy(() => import('@/pages/maintenance/EditPage')) },
]

const recordRoutes: RouteObject[] = RECORD_PAGES.flatMap(
  ({ routes, detail: Detail, create: Create, edit: Edit }) => [
    ...(Create ? [{ path: routes.patterns.create, element: <Create /> }] : []),
    ...(Detail ? [{ path: routes.patterns.detail, element: <Detail /> }] : []),
    ...(Edit ? [{ path: routes.patterns.edit, element: <Edit /> }] : []),
  ],
)

const withSuspense = (node: ReactNode) => <Suspense fallback={null}>{node}</Suspense>

function pageRoute(path: string, title: string): RouteObject {
  const Page = PAGES[path]
  return { path, element: withSuspense(Page ? <Page /> : <PlaceholderPage title={title} />) }
}

const sectionRoutes: RouteObject[] = NAVIGATION.flatMap((entry) => {
  if (entry.kind === 'link') return [pageRoute(entry.to, entry.label)]

  const routes = entry.items.map((item) => pageRoute(item.to, item.label))
  const rootIsPage = entry.items.some((item) => item.to === entry.root)
  if (!rootIsPage) {
    routes.push({ path: entry.root, element: <Navigate to={entry.items[0].to} replace /> })
  }
  return routes
})

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [{ path: ROUTES.login, element: withSuspense(<LoginPage />) }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.dashboard} replace /> },
          ...sectionRoutes,
          ...recordRoutes,
        ],
      },
    ],
  },
  { path: '*', element: withSuspense(<NotFoundPage />) },
])
