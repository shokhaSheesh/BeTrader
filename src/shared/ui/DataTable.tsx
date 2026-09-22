import type { ReactNode } from 'react'
import { useMinimumLoading } from '@/shared/hooks/useMinimumLoading'
import { cn } from '@/shared/lib/cn'
import { Loader } from './Loader'
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
  /** Header text is for screen readers only (e.g. the actions column) */
  hideHeader?: boolean
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
  /** Makes rows clickable (e.g. open the detail page) */
  onRowClick?: (row: T) => void
  /** Screen-reader label for the first-load loader, e.g. "Loading projects" */
  loadingLabel?: string
}

// Wide tables scroll sideways; the first column (what the row is) and the actions column stay pinned.
// Pinned cells need their own background, and an inset shadow instead of a border (borders scroll away).
function pinClass(index: number, count: number, col: { id: string }, row: 'head' | 'body') {
  const bg =
    row === 'head'
      ? 'bg-surface-muted'
      : 'bg-surface transition-colors group-hover:bg-surface-hover'
  if (index === 0) return cn('sticky left-0 z-[1] shadow-[inset_-1px_0_0_var(--color-line)]', bg)
  if (index === count - 1 && col.id === 'actions')
    return cn('sticky right-0 z-[1] shadow-[inset_1px_0_0_var(--color-line)]', bg)
  return undefined
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
  onRowClick,
  loadingLabel,
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

      {showSkeleton && (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center pt-10"
          role="status"
        >
          <Loader label={loadingLabel} />
        </div>
      )}

      {isEmpty ? (
        emptyState
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-muted">
                {columns.map((col, index) => (
                  <th
                    key={col.id}
                    scope="col"
                    className={cn(
                      'h-10 px-4 text-xs font-medium whitespace-nowrap text-fg-muted',
                      col.align === 'right' ? 'text-right' : 'text-left',
                      col.width,
                      pinClass(index, columns.length, col, 'head'),
                    )}
                  >
                    {col.hideHeader ? (
                      <span className="sr-only">{col.header}</span>
                    ) : (
                      col.header || (
                        <Skeleton className={cn('h-3 w-12', col.align === 'right' && 'ml-auto')} />
                      )
                    )}
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
                    <tr key={i} className="group border-t border-line">
                      {columns.map((col, index) => (
                        <td
                          key={col.id}
                          className={cn('h-14 px-4', pinClass(index, columns.length, col, 'body'))}
                        >
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
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      className={cn(
                        'group border-t border-line transition-colors hover:bg-surface-hover',
                        onRowClick && 'cursor-pointer',
                      )}
                    >
                      {columns.map((col, index) => (
                        <td
                          key={col.id}
                          className={cn(
                            'h-14 px-4 whitespace-nowrap',
                            col.align === 'right' && 'num text-right',
                            pinClass(index, columns.length, col, 'body'),
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
