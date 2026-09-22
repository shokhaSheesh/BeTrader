import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { RBA_MATRIX_TABLE, useRbaRulesQuery, type RbaRule } from '@/entities/rba-rule'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { Can } from '@/shared/permissions'
import { useListParams } from '@/shared/hooks/useListParams'
import {
  AmountCell,
  ButtonLink,
  type Column,
  DataTable,
  DateTimeCell,
  ListEmptyState,
  NumberCell,
  PageHeader,
  Pagination,
} from '@/shared/ui'

function buildColumns(label: (f: string) => string): Column<RbaRule>[] {
  return [
    // Amounts carry no currency and scores no stated meaning in the backend: shown plainly, not colored (DESIGN.md §0).
    {
      id: 'amount_from',
      header: label('amount_from'),
      align: 'right',
      cell: (r) => <AmountCell value={r.amountFrom} />,
    },
    {
      id: 'amount_to',
      header: label('amount_to'),
      align: 'right',
      cell: (r) => <AmountCell value={r.amountTo} />,
    },
    {
      id: 'score',
      header: label('score'),
      align: 'right',
      skeleton: 'w-10',
      cell: (r) => (
        <span className="font-medium">
          <NumberCell value={r.score} />
        </span>
      ),
    },
    {
      id: 'created_at',
      header: 'Created',
      align: 'right',
      skeleton: 'w-32',
      cell: (r) => <DateTimeCell value={r.createdAt} />,
    },
    {
      id: 'updated_at',
      header: 'Last updated',
      align: 'right',
      skeleton: 'w-32',
      cell: (r) => <DateTimeCell value={r.updatedAt} />,
    },
  ]
}

export default function Page() {
  const list = useListParams([])
  const fields = useTableFields(RBA_MATRIX_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<RbaRule | null>(null)
  const query = useRbaRulesQuery({
    page: list.page,
    pageSize: list.pageSize,
    order: { amount_from: 1 },
  })

  return (
    <>
      <PageHeader
        title="RBA matrix"
        description="Risk-based approach: the risk score given to each transaction amount band."
        actions={
          <Can table={RBA_MATRIX_TABLE} action="create">
            <ButtonLink to={RECORDS.rbaMatrix.create} icon={Plus}>
              Add risk band
            </ButtonLink>
          </Can>
        }
      />
      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel),
          actionsColumn<RbaRule>({
            table: RBA_MATRIX_TABLE,
            onView: (r) => navigate(RECORDS.rbaMatrix.detail(r.id)),
            onEdit: (r) => navigate(RECORDS.rbaMatrix.edit(r.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.rbaMatrix.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading risk bands"
        emptyState={
          <ListEmptyState
            noun="risk bands"
            isError={query.isError}
            retrying={query.isFetching}
            onRetry={() => query.refetch()}
            search={''}
            filtered={list.hasFilters}
            onResetSearch={list.resetAll}
          />
        }
        footer={
          query.data && (
            <Pagination
              page={list.page}
              pageSize={list.pageSize}
              total={query.data.total}
              onPageChange={list.setPage}
              onPageSizeChange={list.setPageSize}
            />
          )
        }
      />
      <DeleteRecordDialog
        noun="risk band"
        target={toDelete && { name: 'This risk band' }}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
