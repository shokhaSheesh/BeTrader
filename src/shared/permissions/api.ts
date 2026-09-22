import { authHttp, http } from '@/shared/api/http'
import { UCODE_ROOT_MENU_ID } from '@/shared/config/ucode'

export type Action = 'read' | 'create' | 'update' | 'delete'
export type TablePermission = Record<Action, boolean>

interface RolePermissionResponse {
  data: {
    data: {
      name: string
      tables: {
        slug: string
        label: string
        record_permissions: Record<'read' | 'write' | 'update' | 'delete', string>
      }[]
    }
  }
}

/**
 * GET /v2/role-permission/detailed/{project}/{role} (auth API): record rights per table.
 * u-code's "write" is our "create".
 */
export async function getRolePermissions(projectId: string, roleId: string) {
  const { data } = await authHttp.get<RolePermissionResponse>(
    `/role-permission/detailed/${projectId}/${roleId}`,
  )
  const yes = (v: string | undefined) => v === 'Yes'
  const tables = new Map<string, TablePermission & { label: string }>()
  for (const t of data.data.data.tables) {
    const p = t.record_permissions
    tables.set(t.slug, {
      label: t.label,
      read: yes(p.read),
      create: yes(p.write),
      update: yes(p.update),
      delete: yes(p.delete),
    })
  }
  return { roleName: data.data.data.name, tables }
}

export interface MenuNode {
  id: string
  type: string
  parentId: string
  tableSlug: string | null
  label: string
}

interface MenuListResponse {
  data: {
    menus: {
      id: string
      type: string
      label?: string
      attributes?: { label_en?: string }
      data?: { table?: { slug?: string } }
    }[]
  }
}

/** The u-code menu tree (Menu API: GET /v3/menus?parent_id=…), walked folder by folder. */
export async function getMenuTree(projectId: string): Promise<MenuNode[]> {
  const nodes: MenuNode[] = []
  const walk = async (parentId: string, depth: number): Promise<void> => {
    const { data } = await http.get<MenuListResponse>('/v3/menus', {
      params: { parent_id: parentId, 'project-id': projectId },
    })
    // An empty folder comes back as `menus: null`, not [].
    const children = (data.data.menus ?? []).map((m) => ({
      id: m.id,
      type: m.type,
      parentId,
      tableSlug: m.data?.table?.slug || null,
      label: m.attributes?.label_en || m.label || m.type,
    }))
    nodes.push(...children)
    if (depth < 3)
      await Promise.all(
        children.filter((c) => c.type === 'FOLDER').map((c) => walk(c.id, depth + 1)),
      )
  }
  await walk(UCODE_ROOT_MENU_ID, 0)
  return nodes
}

interface MenuPermissionResponse {
  data: { menus: { id: string; permission?: { read?: boolean } }[] | null }
}

/** GET /v2/menu-permission/detailed/{project}/{role}/{parent} for the root and every folder: menu visibility. */
export async function getMenuVisibility(projectId: string, roleId: string, folderIds: string[]) {
  const visible = new Map<string, boolean>()
  await Promise.all(
    [UCODE_ROOT_MENU_ID, ...folderIds].map(async (parentId) => {
      const { data } = await authHttp.get<MenuPermissionResponse>(
        `/menu-permission/detailed/${projectId}/${roleId}/${parentId}`,
      )
      // A hidden menu comes back with an empty permission `{}`, not `read: false`: only an explicit true is visible.
      for (const m of data.data.menus ?? []) visible.set(m.id, m.permission?.read === true)
    }),
  )
  return visible
}
