/* oxlint-disable react/only-export-components -- route config module, not an HMR boundary */
import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { ROUTES } from '@/shared/config/routes'
import { AdminLayout } from '@/widgets/layout/AdminLayout'
import { GuestRoute, ProtectedRoute } from './guards'

const LoginPage = lazy(() => import('@/pages/login'))
const DashboardPage = lazy(() => import('@/pages/dashboard'))
const UsersPage = lazy(() => import('@/pages/users'))
const TransactionsPage = lazy(() => import('@/pages/transactions'))
const SettingsPage = lazy(() => import('@/pages/settings'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))

const withSuspense = (node: ReactNode) => <Suspense fallback={null}>{node}</Suspense>

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
          { path: ROUTES.dashboard, element: withSuspense(<DashboardPage />) },
          { path: ROUTES.users, element: withSuspense(<UsersPage />) },
          { path: ROUTES.transactions, element: withSuspense(<TransactionsPage />) },
          { path: ROUTES.settings, element: withSuspense(<SettingsPage />) },
        ],
      },
    ],
  },
  { path: '*', element: withSuspense(<NotFoundPage />) },
])
