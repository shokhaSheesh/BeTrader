import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation, type Location } from 'react-router'
import { usePermissions, type Action, type Resource } from '@/shared/permissions'
import { Button, ButtonLink, EmptyState, PageLoader } from '@/shared/ui'
import { useIsAuthenticated } from '@/shared/session/store'
import { ROUTES } from '@/shared/config/routes'
import { useT } from '@/shared/i18n'

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

/**
 * Page-level permission check (DESIGN.md §6): list/detail need the page to be visible,
 * create/edit need the matching table right. Denied → a "No access" state, never a blank page.
 */
export function RequireAccess({
  resource,
  action,
  children,
}: {
  resource: Resource
  action: Action
  children: ReactNode
}) {
  const t = useT()
  const permissions = usePermissions()
  if (permissions.isPending) return <PageLoader />
  if (permissions.isError) {
    return (
      <div className="rounded-md border border-line bg-surface">
        <EmptyState
          variant="error"
          title={t("Couldn't load your permissions")}
          description={t('The connection dropped or the server failed.')}
          action={
            <Button
              variant="secondary"
              loading={permissions.isFetching}
              onClick={() => permissions.refetch()}
            >
              {t('Try again')}
            </Button>
          }
        />
      </div>
    )
  }
  const allowed =
    action === 'read'
      ? permissions.canSee(resource)
      : !!resource.table && permissions.can(resource.table, action)
  if (!allowed) {
    return (
      <div className="rounded-md border border-line bg-surface">
        <EmptyState
          variant="no-results"
          title={t("You don't have access to this page")}
          description={
            permissions.roleName
              ? t(
                  "Your role ({role}) isn't allowed to {action} this. Ask an administrator if you need it.",
                  { role: permissions.roleName, action: action === 'read' ? 'open' : action },
                )
              : t(
                  "Your role isn't allowed to {action} this. Ask an administrator if you need it.",
                  {
                    action: action === 'read' ? 'open' : action,
                  },
                )
          }
          action={
            <ButtonLink to={ROUTES.dashboard} variant="secondary">
              {t('Go to dashboard')}
            </ButtonLink>
          }
        />
      </div>
    )
  }
  return <>{children}</>
}
