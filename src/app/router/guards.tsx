import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/features/auth/model/store'
import { ROUTES } from '@/shared/config/routes'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => Boolean(s.accessToken))
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }
  return <Outlet />
}

export function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => Boolean(s.accessToken))
  return isAuthenticated ? <Navigate to={ROUTES.dashboard} replace /> : <Outlet />
}
