/* oxlint-disable react/only-export-components -- route config module, not an HMR boundary */
import { lazy, Suspense, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react'
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'
import { NAVIGATION } from '@/shared/config/navigation'
import { ROUTES } from '@/shared/config/routes'
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
}

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
        ],
      },
    ],
  },
  { path: '*', element: withSuspense(<NotFoundPage />) },
])
