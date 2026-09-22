import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import {
  CURRENCY_PERCENT_TABLE,
  useCurrencyPercentsQuery,
  type CurrencyPercent,
} from '@/entities/currency-percent'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { useListParams } from '@/shared/hooks/useListParams'
import {
  ButtonLink,
  DataTable,
  DateTimeCell,
  ListEmptyState,
  OptionsCell,
  PageHeader,
  Pagination,
  PercentCell,
  type Column,
} from '@/shared/ui'

function buildColumns(
  label: (f: string) => string,
  opt: (v: string) => string,
): Column<CurrencyPercent>[] {
  return [
    {
      id: 'type',
      header: label('type'),
      skeleton: 'w-24',
      cell: (c) => <OptionsCell values={c.type} label={opt} />,
    },
    {
      id: 'percent',
      header: label('percent'),
      align: 'right',
      skeleton: 'w-10',
      cell: (c) => <PercentCell value={c.percent} />,
    },
    {
      id: 'created_at',
      header: 'Created',
      align: 'right',
      skeleton: 'w-32',
      cell: (c) => <DateTimeCell value={c.createdAt} />,
    },
    {
      id: 'updated_at',
      header: 'Last updated',
      align: 'right',
      skeleton: 'w-32',
      cell: (c) => <DateTimeCell value={c.updatedAt} />,
    },
  ]
}

// Three rows (currency, transaction and insurance percent): no filters or search needed.
export default function CurrencyPercentPage() {
  const list = useListParams()
  const fields = useTableFields(CURRENCY_PERCENT_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<CurrencyPercent | null>(null)
  const query = useCurrencyPercentsQuery({ page: list.page, pageSize: list.pageSize })

  return (
    <>
      <PageHeader
        title="Currency percent"
        description="Percentages applied to currency conversion, transactions and insurance."
        actions={
          <ButtonLink to={RECORDS.currencyPercent.create} icon={Plus}>
            Add percent
          </ButtonLink>
        }
      />
      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel, (v) => fields.optionLabel('type', v)),
          actionsColumn<CurrencyPercent>({
            onView: (c) => navigate(RECORDS.currencyPercent.detail(c.id)),
            onEdit: (c) => navigate(RECORDS.currencyPercent.edit(c.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(c) => c.id}
        onRowClick={(c) => navigate(RECORDS.currencyPercent.detail(c.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        skeletonRows={3}
        loadingLabel="Loading percentages"
        emptyState={
          <ListEmptyState
            noun="percentages"
            isError={query.isError}
            retrying={query.isFetching}
            onRetry={() => query.refetch()}
            search=""
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
        noun="percent"
        target={
          toDelete && {
            name:
              toDelete.type.map((t) => fields.optionLabel('type', t)).join(', ') || 'This percent',
          }
        }
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
