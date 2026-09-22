import type { ReactNode } from 'react'
import { useMinimumLoading } from '@/shared/hooks/useMinimumLoading'
import { cn } from '@/shared/lib/cn'
import { Skeleton } from './Skeleton'

export interface Column<T> {
  id: string
  header: string
  cell: (row: T) => ReactNode
  align?: 'left' | 'right'
  /** Tailwind width class, e.g. `w-40` */
  width?: string
  /** Shape of this column's skeleton bar */
  skeleton?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[] | undefined
  getRowId: (row: T) => string
  /** First load: no data yet → skeleton rows */
  loading?: boolean
  /** Refetch with data on screen → old rows dimmed + progress bar */
  fetching?: boolean
  /** Rendered instead of the body when there is nothing to show (EmptyState) */
  emptyState?: ReactNode
  footer?: ReactNode
  skeletonRows?: number
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  loading = false,
  fetching = false,
  emptyState,
  footer,
  skeletonRows = 8,
}: DataTableProps<T>) {
  const showSkeleton = useMinimumLoading(loading)
  const showFetching = useMinimumLoading(fetching && !loading)
  const isEmpty = !showSkeleton && (!rows || rows.length === 0)

  return (
    <div className="relative overflow-hidden rounded-md border border-line bg-surface">
      {showFetching && (
        <div
          className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden"
          role="progressbar"
          aria-label="Loading"
        >
          <div className="h-full w-1/3 animate-indeterminate bg-brand-deep" />
        </div>
      )}

      {isEmpty ? (
        emptyState
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-muted">
                {columns.map((col) => (
                  <th
                    key={col.id}
                    scope="col"
                    className={cn(
                      'h-10 px-4 text-xs font-medium whitespace-nowrap text-fg-muted',
                      col.align === 'right' ? 'text-right' : 'text-left',
                      col.width,
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className={cn('transition-opacity', showFetching && 'opacity-60')}
              aria-busy={showSkeleton || showFetching || undefined}
            >
              {showSkeleton
                ? Array.from({ length: skeletonRows }, (_, i) => (
                    <tr key={i} className="border-t border-line">
                      {columns.map((col) => (
                        <td key={col.id} className="h-14 px-4">
                          <Skeleton
                            className={cn(
                              'h-4',
                              col.skeleton ?? 'w-24',
                              col.align === 'right' && 'ml-auto',
                            )}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                : rows!.map((row) => (
                    <tr
                      key={getRowId(row)}
                      className="border-t border-line transition-colors hover:bg-surface-hover"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.id}
                          className={cn(
                            'h-14 px-4 whitespace-nowrap',
                            col.align === 'right' && 'num text-right',
                          )}
                        >
                          {col.cell(row)}
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}

      {footer && !isEmpty && <div className="border-t border-line">{footer}</div>}
    </div>
  )
}
