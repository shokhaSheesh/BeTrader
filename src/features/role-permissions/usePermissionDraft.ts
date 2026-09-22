import { useState } from 'react'
import type { Action, TablePermission } from '@/shared/permissions'

export type PermissionTables = Map<string, TablePermission & { label: string }>

/** Local, unsaved edits to a permission matrix (toggle one cell or a whole column). */
export function usePermissionDraft(initial: PermissionTables | undefined) {
  const [draft, setDraft] = useState<PermissionTables | null>(null)
  const tables = draft ?? initial
  return {
    tables,
    toggle: (slug: string, action: Action) => {
      if (!tables) return
      const next: PermissionTables = new Map(tables)
      const t = next.get(slug)!
      next.set(slug, { ...t, [action]: !t[action] })
      setDraft(next)
    },
    setColumn: (action: Action, value: boolean) => {
      if (!tables) return
      setDraft(new Map([...tables].map(([slug, t]) => [slug, { ...t, [action]: value }])))
    },
  }
}
