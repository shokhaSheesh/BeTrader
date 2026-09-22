import { formatMoney } from '@/shared/lib/format'
import { dividendsPerInvestor } from '@/shared/mocks/analytics'
import { Badge, DataTable, PageHeader } from '@/shared/ui'
import { ChartCard } from '@/widgets/chart-card'

// Mock of the Metabase "Dividends per investor" report (docs/DASHBOARDS.md). Numbers are invented.
const usd = (v: number) => formatMoney(v, 'USD')
const totals = dividendsPerInvestor.reduce(
  (t, r) => ({ sum: t.sum + r.sum, taxable: t.taxable + r.taxable, tax: t.tax + r.tax }),
  { sum: 0, taxable: 0, tax: 0 },
)

export default function AnalyticsDividendsPage() {
  return (
    <>
      <PageHeader
        title="Dividends analytics"
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <Badge tone="warning">Mock data</Badge> Dividends, taxable base and tax withheld per
            investor.
          </span>
        }
      />
      <ChartCard
        mock
        title="Dividends per investor"
        aside={
          <span className="num text-fg-muted">
            Total {usd(totals.sum)} · tax {usd(totals.tax)}
          </span>
        }
        table={
          <DataTable
            columns={[
              {
                id: 'name',
                header: 'Full name',
                cell: (r) => <span className="font-medium">{r.name}</span>,
              },
              { id: 'pinfl', header: 'PINFL', cell: (r) => <span className="num">{r.pinfl}</span> },
              { id: 'sum', header: 'Dividends', align: 'right', cell: (r) => usd(r.sum) },
              {
                id: 'taxable',
                header: 'Taxable base',
                align: 'right',
                cell: (r) => usd(r.taxable),
              },
              { id: 'tax', header: 'Tax withheld', align: 'right', cell: (r) => usd(r.tax) },
            ]}
            rows={dividendsPerInvestor}
            getRowId={(r) => r.id}
          />
        }
      />
    </>
  )
}
