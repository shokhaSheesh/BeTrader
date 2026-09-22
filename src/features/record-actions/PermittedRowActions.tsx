import { Eye, Pencil, Trash2 } from 'lucide-react'
import { usePermissions } from '@/shared/permissions'
import { RowActions } from '@/shared/ui'
import type { ActionsColumnOptions } from './actionsColumn'

/** View always; Edit and Delete only when the signed-in role may update / delete the table. */
export function PermittedRowActions<T>({
  row,
  table,
  onView,
  onEdit,
  onDelete,
}: ActionsColumnOptions<T> & { row: T }) {
  const { can } = usePermissions()
  return (
    <RowActions
      actions={[
        { label: 'View', icon: Eye, onSelect: () => onView(row) },
        ...(can(table, 'update')
          ? [{ label: 'Edit', icon: Pencil, onSelect: () => onEdit(row) }]
          : []),
        ...(can(table, 'delete')
          ? [{ label: 'Delete', icon: Trash2, onSelect: () => onDelete(row), danger: true }]
          : []),
      ]}
    />
  )
}
