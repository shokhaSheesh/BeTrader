import { useState } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import type { ListParams, TableFilters } from '@/shared/api/ucode'
import { useT } from '@/shared/i18n'
import type { Paginated } from '@/shared/types/api'
import { DataTable, EmptyState, Pagination, type Column } from '@/shared/ui'

interface RelatedTableProps<T> {
  /** The table's list hook, e.g. useDividendsQuery */
  useList: (params: ListParams) => UseQueryResult<Paginated<T>>
  /** The link to the open record, e.g. `{ projects_id: id }`: the backend filters */
  filters: TableFilters
  order?: ListParams['order']
  columns: Column<T>[]
  getRowId: (row: T) => string
  /** Opens the row's own detail page */
  onRowClick?: (row: T) => void
  /** Header labels still loading (the table's schema) */
  labelsPending?: boolean
}

/**
 * A detail page tab listing the records linked to the open one, as u-code's detail views do
 * (Project → its investors and dividends, Investor → accounts, holdings, transactions).
 */
export function RelatedTable<T>({
  useList,
  filters,
  order,
  columns,
  getRowId,
  onRowClick,
  labelsPending,
}: RelatedTableProps<T>) {
  const t = useT()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const query = useList({ page, pageSize, filters, order })

  return (
    <DataTable
      columns={columns}
      rows={query.data?.items}
      getRowId={getRowId}
      onRowClick={onRowClick}
      loading={query.isPending || labelsPending}
      fetching={query.isFetching}
      skeletonRows={5}
      emptyState={
        query.isError ? (
          <EmptyState
            variant="error"
            title={t('Couldn’t load the records')}
            description={t('The connection dropped or the server failed.')}
          />
        ) : (
          <EmptyState
            variant="empty"
            title={t('No linked records yet')}
            description={t('Records linked to this one will appear here.')}
          />
        )
      }
      footer={
        query.data && (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={query.data.total}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
          />
        )
      }
    />
  )
}
