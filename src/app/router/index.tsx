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
}

/** Detail / create / edit pages per record type. */
const RECORD_PAGES: {
  routes: (typeof RECORDS)[keyof typeof RECORDS]
  detail: LazyExoticComponent<ComponentType>
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
]

const recordRoutes: RouteObject[] = RECORD_PAGES.flatMap(
  ({ routes, detail: Detail, create: Create, edit: Edit }) => [
    ...(Create ? [{ path: routes.patterns.create, element: <Create /> }] : []),
    { path: routes.patterns.detail, element: <Detail /> },
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
