import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UCODE_ROOT_MENU_ID } from '@/shared/config/ucode'
import { useSessionStore } from '@/shared/session/store'
import {
  getMenuTree,
  getMenuVisibility,
  getRolePermissions,
  type Action,
  type MenuNode,
} from './api'

/** What a page or button is about: a backend table, or (Dashboard, Analytics) a u-code menu link. */
export interface Resource {
  table?: string
  menuId?: string
}

async function loadPermissions(projectId: string, roleId: string) {
  const [role, tree] = await Promise.all([
    getRolePermissions(projectId, roleId),
    getMenuTree(projectId),
  ])
  const folders = tree.filter((n) => n.type === 'FOLDER').map((n) => n.id)
  const menuVisible = await getMenuVisibility(projectId, roleId, folders)
  return { ...role, tree, menuVisible }
}

/**
 * The signed-in role's permissions (DESIGN.md §6). Source of truth is the backend:
 * table rights from role-permission, visibility from the Menu API. Cached for 5 minutes.
 */
export function usePermissions() {
  const roleId = useSessionStore((s) => s.session?.roleId)
  return useRoleAccess(roleId)
}

/** Access of any role: the same rules the app enforces, so the Roles page shows exactly what a role gets. */
export function useRoleAccess(roleId: string | undefined) {
  const projectId = useSessionStore((s) => s.session?.projectId)
  const query = useQuery({
    queryKey: ['permissions', projectId, roleId],
    queryFn: () => loadPermissions(projectId!, roleId!),
    enabled: !!roleId && !!projectId,
    staleTime: 5 * 60_000,
  })
  const data = query.data

  /** A menu is visible when it and every folder above it are readable by the role. */
  const menuPathVisible = useCallback(
    (node: MenuNode | undefined) => {
      if (!data) return false
      for (let n = node; n; n = data.tree.find((p) => p.id === n!.parentId)) {
        if (data.menuVisible.get(n.id) !== true) return false
        if (n.parentId === UCODE_ROOT_MENU_ID) return true
      }
      return false
    },
    [data],
  )

  const can = useCallback(
    (table: string, action: Action) => {
      const t = data?.tables.get(table)
      return !!t && t[action]
    },
    [data],
  )

  /** Should a page appear (sidebar, route)? Table read right AND its menu being visible to the role. */
  const canSee = useCallback(
    ({ table, menuId }: Resource) => {
      if (!data) return false
      if (menuId) return menuPathVisible(data.tree.find((n) => n.id === menuId))
      if (!table || !can(table, 'read')) return false
      const nodes = data.tree.filter((n) => n.tableSlug === table)
      return nodes.length === 0 || nodes.some(menuPathVisible) // tables outside the menu follow the table right alone
    },
    [data, can, menuPathVisible],
  )

  return { ...query, roleName: data?.roleName, tables: data?.tables, can, canSee }
}
