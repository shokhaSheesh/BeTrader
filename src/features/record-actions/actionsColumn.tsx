import { Eye, Pencil, Trash2 } from 'lucide-react'
import { RowActions, type Column } from '@/shared/ui'

interface ActionsColumnOptions<T> {
  onView: (row: T) => void
  onEdit: (row: T) => void
  onDelete: (row: T) => void
}

/** The ⋯ column every list page ends with: View, Edit, Delete. */
export function actionsColumn<T>({ onView, onEdit, onDelete }: ActionsColumnOptions<T>): Column<T> {
  return {
    id: 'actions',
    header: 'Actions',
    hideHeader: true,
    align: 'right',
    width: 'w-14',
    skeleton: 'w-6',
    cell: (row) => (
      <RowActions
        actions={[
          { label: 'View', icon: Eye, onSelect: () => onView(row) },
          { label: 'Edit', icon: Pencil, onSelect: () => onEdit(row) },
          { label: 'Delete', icon: Trash2, onSelect: () => onDelete(row), danger: true },
        ]}
      />
    ),
  }
}
