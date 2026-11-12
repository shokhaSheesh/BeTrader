import { Eye, Pencil, Trash2 } from 'lucide-react'
import { usePermissions } from '@/shared/permissions'
import { useT } from '@/shared/i18n'
import { RowActions } from '@/shared/ui'
import type { ActionsColumnOptions } from './actionsColumn'

/** View always; Edit and Delete only when the signed-in role may update / delete the table (and the page offers delete). */
export function PermittedRowActions<T>({
  row,
  table,
  onView,
  onEdit,
  onDelete,
}: ActionsColumnOptions<T> & { row: T }) {
  const { can } = usePermissions()
  const t = useT()
  return (
    <RowActions
      actions={[
        { label: t('View'), icon: Eye, onSelect: () => onView(row) },
        ...(can(table, 'update')
          ? [{ label: t('Edit'), icon: Pencil, onSelect: () => onEdit(row) }]
          : []),
        ...(onDelete && can(table, 'delete')
          ? [{ label: t('Delete'), icon: Trash2, onSelect: () => onDelete(row), danger: true }]
          : []),
      ]}
    />
  )
}
