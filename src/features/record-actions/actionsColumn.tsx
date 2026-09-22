import type { Column } from '@/shared/ui'
import { PermittedRowActions } from './PermittedRowActions'

export interface ActionsColumnOptions<T> {
  /** Backend table: Edit and Delete appear only if the role may update / delete it */
  table: string
  onView: (row: T) => void
  onEdit: (row: T) => void
  onDelete: (row: T) => void
}

/** The ⋯ column every list page ends with: View, plus Edit and Delete when the role allows them. */
export function actionsColumn<T>(options: ActionsColumnOptions<T>): Column<T> {
  return {
    id: 'actions',
    header: 'Actions',
    hideHeader: true,
    align: 'right',
    width: 'w-14',
    skeleton: 'w-6',
    cell: (row) => <PermittedRowActions row={row} {...options} />,
  }
}
