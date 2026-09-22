import { Navigate, Outlet, useLocation, type Location } from 'react-router'
import { useIsAuthenticated } from '@/shared/session/store'
import { ROUTES } from '@/shared/config/routes'

export function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }
  return <Outlet />
}

export function GuestRoute() {
  const isAuthenticated = useIsAuthenticated()
  const from = (useLocation().state as { from?: Location } | null)?.from
  return isAuthenticated ? <Navigate to={from?.pathname ?? ROUTES.dashboard} replace /> : <Outlet />
}
