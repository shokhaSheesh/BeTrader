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
import { Can } from '@/shared/permissions'
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
import { useT } from '@/shared/i18n'

function buildColumns(
  label: (f: string) => string,
  opt: (v: string) => string,
  t: (text: string) => string,
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
      header: t('Created'),
      align: 'right',
      skeleton: 'w-32',
      cell: (c) => <DateTimeCell value={c.createdAt} />,
    },
    {
      id: 'updated_at',
      header: t('Last updated'),
      align: 'right',
      skeleton: 'w-32',
      cell: (c) => <DateTimeCell value={c.updatedAt} />,
    },
  ]
}

// Three rows (currency, transaction and insurance percent): no filters or search needed.
export default function CurrencyPercentPage() {
  const t = useT()
  const list = useListParams()
  const fields = useTableFields(CURRENCY_PERCENT_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<CurrencyPercent | null>(null)
  const query = useCurrencyPercentsQuery({ page: list.page, pageSize: list.pageSize })

  return (
    <>
      <PageHeader
        title={t('Currency percent')}
        description={t('Percentages applied to currency conversion, transactions and insurance.')}
        actions={
          <Can table={CURRENCY_PERCENT_TABLE} action="create">
            <ButtonLink to={RECORDS.currencyPercent.create} icon={Plus}>
              {t('Add percent')}
            </ButtonLink>
          </Can>
        }
      />
      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel, (v) => fields.optionLabel('type', v), t),
          actionsColumn<CurrencyPercent>({
            table: CURRENCY_PERCENT_TABLE,
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
        loadingLabel={t('Loading percentages')}
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
        table={CURRENCY_PERCENT_TABLE}
        target={
          toDelete && {
            id: toDelete.id,
            // The backend function reads the type on delete (docs/API.md)
            data: { type: toDelete.type },
            name:
              toDelete.type.map((v) => fields.optionLabel('type', v)).join(', ') ||
              t('This percent'),
          }
        }
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
