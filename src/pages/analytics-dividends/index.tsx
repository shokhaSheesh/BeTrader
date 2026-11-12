import { ExternalLink } from 'lucide-react'
import { useDividendAnalyticsQuery, type DividendAnalyticsRow } from '@/entities/dividend-analytics'
import { DASHBOARDS, metabaseUrl } from '@/shared/config/dashboards'
import { MOCK_MODE } from '@/shared/config/mock'
import { useListParams } from '@/shared/hooks/useListParams'
import { useT } from '@/shared/i18n'
import { formatMoney } from '@/shared/lib/format'
import {
  Button,
  DataTable,
  DateRangeFilter,
  FilterBar,
  ListEmptyState,
  PageHeader,
  Pagination,
  type Column,
} from '@/shared/ui'
import { EmbeddedDashboard } from '@/widgets/embedded-dashboard'

const TITLE = 'Dividends per investor'
const usd = (v: number) => formatMoney(v, 'USD')

// Exactly the Metabase report's columns (docs/DASHBOARDS.md): nothing added.
const columns = (t: ReturnType<typeof useT>): Column<DividendAnalyticsRow>[] => [
  {
    id: 'name',
    header: t('Full name'),
    skeleton: 'w-48',
    cell: (r) => <span className="font-medium">{r.full_name}</span>,
  },
  {
    id: 'pinfl',
    header: 'PINFL',
    skeleton: 'w-32',
    cell: (r) => <span className="num">{r.pinfl ?? '—'}</span>,
  },
  {
    id: 'amount',
    header: t('Dividend amount'),
    align: 'right',
    cell: (r) => usd(r.dividend_amount),
  },
  { id: 'taxable', header: t('Taxable base'), align: 'right', cell: (r) => usd(r.taxable_base) },
  { id: 'tax', header: t('Tax withheld'), align: 'right', cell: (r) => usd(r.tax_withheld) },
]

/** Demo mode draws the report natively from the mock backend; the real backend keeps the Metabase embed. */
export default function AnalyticsDividendsPage() {
  const t = useT()
  const list = useListParams(['from', 'to'])
  const range = { from: list.filter('from'), to: list.filter('to') }
  const src = metabaseUrl(DASHBOARDS.dividends, range)

  return (
    <>
      <PageHeader
        title={t('Dividends analytics')}
        description={t('Dividends, taxable base and tax withheld per investor.')}
        actions={
          !MOCK_MODE && (
            <Button
              variant="secondary"
              icon={ExternalLink}
              onClick={() => window.open(src, '_blank', 'noopener,noreferrer')}
            >
              {t('Open full screen')}
            </Button>
          )
        }
      />

      <FilterBar active={list.hasFilters} onReset={list.resetAll}>
        <DateRangeFilter
          label={t('Period')}
          from={range.from}
          to={range.to}
          onChange={({ from, to }) => list.setFilters({ from, to })}
        />
      </FilterBar>

      {MOCK_MODE ? (
        <DividendsTable list={list} range={range} />
      ) : (
        <EmbeddedDashboard src={src} title={t(TITLE)} />
      )}
    </>
  )
}

function DividendsTable({
  list,
  range,
}: {
  list: ReturnType<typeof useListParams>
  range: { from: string | null; to: string | null }
}) {
  const t = useT()
  const query = useDividendAnalyticsQuery({ ...range, page: list.page, pageSize: list.pageSize })
  return (
    <DataTable
      columns={columns(t)}
      rows={query.data?.items}
      getRowId={(r) => r.investors_id}
      loading={query.isPending}
      fetching={query.isFetching}
      loadingLabel={t('Loading dividends')}
      emptyState={
        <ListEmptyState
          noun="dividends"
          isError={query.isError}
          retrying={query.isFetching}
          onRetry={() => query.refetch()}
          search=""
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
  )
}
