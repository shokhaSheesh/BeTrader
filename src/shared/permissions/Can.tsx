import type { ReactNode } from 'react'
import type { Action } from './api'
import { usePermissions } from './usePermissions'

/** Renders children only when the signed-in role may do `action` on `table` (hides, never disables). */
export function Can({
  table,
  action,
  children,
}: {
  table: string
  action: Action
  children: ReactNode
}) {
  const { can } = usePermissions()
  return can(table, action) ? <>{children}</> : null
}
