import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import {
  INVESTOR_SCORE_TABLE,
  useInvestorScoresQuery,
  type InvestorScore,
} from '@/entities/investor-score'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { InvestorFilter } from '@/features/investor-filter'
import { equalsFilter } from '@/shared/api/filters'
import { formatPhone } from '@/shared/lib/format'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { useListParams } from '@/shared/hooks/useListParams'
import {
  ButtonLink,
  CodeCell,
  type Column,
  DataTable,
  DateTimeCell,
  FilterBar,
  ListEmptyState,
  NumberCell,
  PageHeader,
  Pagination,
  TextCell,
} from '@/shared/ui'

function buildColumns(label: (f: string) => string): Column<InvestorScore>[] {
  return [
    {
      id: 'investor',
      header: label('investors_id'),
      skeleton: 'w-44',
      cell: (r) => (
        <span className="font-medium">
          <TextCell value={r.investorName} />
        </span>
      ),
    },
    {
      id: 'phone',
      header: 'Phone',
      skeleton: 'w-32',
      cell: (r) => <CodeCell value={r.investorPhone && formatPhone(r.investorPhone)} />,
    },
    {
      id: 'score',
      header: label('score'),
      align: 'right',
      skeleton: 'w-10',
      cell: (r) => <NumberCell value={r.score} />,
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
  const list = useListParams(['investor'])
  const fields = useTableFields(INVESTOR_SCORE_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<InvestorScore | null>(null)
  const query = useInvestorScoresQuery({
    page: list.page,
    pageSize: list.pageSize,
    filters: { ...equalsFilter('investors_id', list.filter('investor')) },
  })

  return (
    <>
      <PageHeader
        title="Investor score"
        description="Risk scores assigned to investors."
        actions={
          <ButtonLink to={RECORDS.investorScore.create} icon={Plus}>
            Add score
          </ButtonLink>
        }
      />
      <FilterBar active={list.hasFilters} onReset={list.resetAll}>
        <InvestorFilter
          value={list.filter('investor')}
          onChange={(v) => list.setFilters({ investor: v })}
        />
      </FilterBar>
      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel),
          actionsColumn<InvestorScore>({
            onView: (r) => navigate(RECORDS.investorScore.detail(r.id)),
            onEdit: (r) => navigate(RECORDS.investorScore.edit(r.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.investorScore.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading investor scores"
        emptyState={
          <ListEmptyState
            noun="investor scores"
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
        noun="score"
        target={toDelete && { name: `The score of ${toDelete.investorName ?? 'this investor'}` }}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
