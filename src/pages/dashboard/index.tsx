import { useState } from 'react'
import { Banknote, HandCoins, TrendingUp, Users } from 'lucide-react'
import { ColumnChart, Legend, LineChart, StackedBars } from '@/shared/charts'
import { compact } from '@/shared/charts/scale'
import {
  formatAmount,
  formatDate,
  formatDateTime,
  formatMoney,
  formatNumber,
  formatPhone,
} from '@/shared/lib/format'
import * as mock from '@/shared/mocks/analytics'
import {
  Badge,
  DataTable,
  DateRangeFilter,
  FilterBar,
  KpiCard,
  KpiGrid,
  PageHeader,
  TabPanel,
  Tabs,
  type Column,
} from '@/shared/ui'
import { ChartCard } from '@/widgets/chart-card'

// Mock dashboard replacing the Yandex DataLens one (docs/DASHBOARDS.md). Numbers are invented: see shared/mocks.
const mockBadge = <Badge tone="warning">Mock data</Badge>
const inRange = (from: string | null, to: string | null) => (d: { x: string }) =>
  (!from || d.x >= from) && (!to || d.x <= to)
const usd = (v: number) => formatMoney(v, 'USD')
const rate = (v: number) => `${formatAmount(v)} UZS`

type DayRow = { x: string; y: number }
const dayColumns = (label: string, format: (v: number) => string): Column<DayRow>[] => [
  { id: 'date', header: 'Date', cell: (r) => <span className="num">{formatDate(r.x)}</span> },
  { id: 'value', header: label, align: 'right', cell: (r) => format(r.y) },
]
const dayTable = (rows: DayRow[], label: string, format: (v: number) => string) => (
  <div className="max-h-96 overflow-y-auto">
    <DataTable
      columns={dayColumns(label, format)}
      rows={[...rows].reverse()}
      getRowId={(r) => r.x}
    />
  </div>
)

export default function DashboardPage() {
  const [tab, setTab] = useState('overview')
  const [range, setRange] = useState<{ from: string | null; to: string | null }>({
    from: null,
    to: null,
  })
  const pick = inRange(range.from, range.to)

  const registrations = mock.registrationsPerDay.filter(pick)
  const investments = mock.investmentsPerDay.filter(pick)
  const rates = [
    { name: 'Niyat rate', color: 'var(--color-chart-1)', points: mock.usdRates.niyat.filter(pick) },
    {
      name: 'Central Bank rate',
      color: 'var(--color-chart-muted)',
      points: mock.usdRates.centralBank.filter(pick),
    },
  ]

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            {mockBadge} Charts and numbers are placeholders until the backend provides analytics
            endpoints.
          </span>
        }
      />

      {/* One filter row above everything it scopes */}
      <FilterBar
        active={!!(range.from || range.to)}
        onReset={() => setRange({ from: null, to: null })}
      >
        <DateRangeFilter label="Date" from={range.from} to={range.to} onChange={setRange} />
      </FilterBar>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'overview', label: 'Overview' },
          { value: 'investments', label: 'Investments & dividends' },
        ]}
      >
        <TabPanel value="overview">
          <KpiGrid>
            <KpiCard
              label="Total investors"
              icon={Users}
              tone="accent"
              display={formatNumber(mock.kpis.totalInvestors)}
              footnote={mockBadge}
            />
            <KpiCard
              label="Total deposits"
              icon={Banknote}
              tone="info"
              display={`${compact(mock.kpis.totalDepositsUzs)} UZS`}
              exact={formatMoney(mock.kpis.totalDepositsUzs, 'UZS')}
              footnote={mockBadge}
            />
            <KpiCard
              label="Total investments"
              icon={TrendingUp}
              tone="success"
              display={`$${compact(mock.kpis.totalInvestmentsUsd)}`}
              exact={usd(mock.kpis.totalInvestmentsUsd)}
              footnote={mockBadge}
            />
            <KpiCard
              label="Total dividends"
              icon={HandCoins}
              tone="accent"
              display={usd(mock.kpis.totalDividendsUsd)}
              footnote={mockBadge}
            />
          </KpiGrid>
          <div className="flex flex-col gap-6">
            <ChartCard
              mock
              title="Registrations per day"
              description="New investors signing up"
              chart={
                <ColumnChart
                  data={registrations}
                  label="Registrations"
                  formatValue={formatNumber}
                  formatDate={formatDate}
                />
              }
              table={dayTable(registrations, 'Registrations', formatNumber)}
            />
            <ChartCard
              mock
              title="USD rate per day"
              description="UZS per USD: Niyat's rate against the Central Bank's, on one axis"
              aside={<Legend mark="line" items={rates} />}
              chart={
                <LineChart
                  series={rates}
                  label="USD rate per day"
                  formatValue={rate}
                  formatDate={formatDate}
                />
              }
              table={
                <div className="max-h-96 overflow-y-auto">
                  <DataTable
                    columns={[
                      {
                        id: 'date',
                        header: 'Date',
                        cell: (r) => <span className="num">{formatDate(r.x)}</span>,
                      },
                      {
                        id: 'niyat',
                        header: 'Niyat rate',
                        align: 'right',
                        cell: (r) => rate(r.niyat),
                      },
                      {
                        id: 'cb',
                        header: 'Central Bank rate',
                        align: 'right',
                        cell: (r) => rate(r.cb),
                      },
                    ]}
                    rows={rates[0].points
                      .map((p, i) => ({ x: p.x, niyat: p.y, cb: rates[1].points[i].y }))
                      .reverse()}
                    getRowId={(r) => r.x}
                  />
                </div>
              }
            />
            <ChartCard
              mock
              title="Investors"
              description="Latest registrations"
              table={
                <DataTable
                  columns={[
                    {
                      id: 'name',
                      header: 'Full name',
                      cell: (r) => <span className="font-medium">{r.name}</span>,
                    },
                    {
                      id: 'phone',
                      header: 'Phone',
                      cell: (r) => <span className="num">{formatPhone(r.phone)}</span>,
                    },
                    {
                      id: 'status',
                      header: 'Identification',
                      cell: (r) =>
                        r.identified ? (
                          <Badge tone="success">Identified</Badge>
                        ) : (
                          <Badge tone="warning">Not identified</Badge>
                        ),
                    },
                    {
                      id: 'registered',
                      header: 'Registered',
                      align: 'right',
                      cell: (r) => formatDateTime(r.registered),
                    },
                  ]}
                  rows={mock.investorsTable}
                  getRowId={(r) => r.id}
                />
              }
            />
          </div>
        </TabPanel>

        <TabPanel value="investments">
          <div className="flex flex-col gap-6">
            <ChartCard
              mock
              title="Split by tariff"
              description="Share of each tariff in dividends, investors and investments"
              aside={
                <Legend
                  mark="rect"
                  items={mock.TARIFFS.map((t) => ({ name: t.name, color: t.color }))}
                />
              }
              chart={
                <StackedBars
                  rows={[
                    { key: 'dividendsUsd', label: 'Dividends', format: usd },
                    { key: 'investors', label: 'Investors with investments', format: formatNumber },
                    { key: 'investmentsUsd', label: 'Investments', format: usd },
                  ].map(({ key, label, format }) => {
                    const values = mock.tariffSplit[key as keyof typeof mock.tariffSplit]
                    const total = Object.values(values).reduce((a, b) => a + b, 0)
                    return {
                      label,
                      total: format(total),
                      segments: mock.TARIFFS.map((t) => ({
                        name: t.name,
                        color: t.color,
                        value: values[t.key],
                        display: format(values[t.key]),
                      })),
                    }
                  })}
                />
              }
              table={
                <DataTable
                  columns={[
                    {
                      id: 'tariff',
                      header: 'Tariff',
                      cell: (r) => (
                        <span className="flex items-center gap-2 font-medium">
                          <span className="size-2.5 rounded-xs" style={{ background: r.color }} />
                          {r.name}
                        </span>
                      ),
                    },
                    {
                      id: 'div',
                      header: 'Dividends',
                      align: 'right',
                      cell: (r) => usd(mock.tariffSplit.dividendsUsd[r.key]),
                    },
                    {
                      id: 'inv',
                      header: 'Investors',
                      align: 'right',
                      cell: (r) => formatNumber(mock.tariffSplit.investors[r.key]),
                    },
                    {
                      id: 'amt',
                      header: 'Investments',
                      align: 'right',
                      cell: (r) => usd(mock.tariffSplit.investmentsUsd[r.key]),
                    },
                  ]}
                  rows={[...mock.TARIFFS]}
                  getRowId={(r) => r.key}
                />
              }
            />
            <ChartCard
              mock
              title="Investments per day"
              description="Amount invested (USD)"
              chart={
                <ColumnChart
                  data={investments}
                  label="Invested"
                  formatValue={usd}
                  formatDate={formatDate}
                />
              }
              table={dayTable(investments, 'Invested', usd)}
            />
            <ChartCard
              mock
              title="Investments"
              description="Latest purchases, by tariff"
              table={
                <DataTable
                  columns={[
                    {
                      id: 'name',
                      header: 'Investor',
                      cell: (r) => <span className="font-medium">{r.name}</span>,
                    },
                    {
                      id: 'tariff',
                      header: 'Tariff',
                      cell: (r) => (
                        <span className="flex items-center gap-2">
                          <span
                            className="size-2.5 rounded-xs"
                            style={{ background: r.tariffColor }}
                          />
                          {r.tariff}
                        </span>
                      ),
                    },
                    {
                      id: 'phone',
                      header: 'Phone',
                      cell: (r) => <span className="num">{formatPhone(r.phone)}</span>,
                    },
                    {
                      id: 'passport',
                      header: 'Passport',
                      cell: (r) => <span className="num">{r.passport}</span>,
                    },
                    {
                      id: 'tx',
                      header: 'Transaction ID',
                      cell: (r) => <span className="num">{r.transactionId}</span>,
                    },
                    {
                      id: 'created',
                      header: 'Created',
                      align: 'right',
                      cell: (r) => formatDateTime(r.created),
                    },
                    {
                      id: 'rate',
                      header: 'Rate',
                      align: 'right',
                      cell: (r) => formatAmount(r.rate),
                    },
                    { id: 'usd', header: 'Amount (USD)', align: 'right', cell: (r) => usd(r.usd) },
                    {
                      id: 'uzs',
                      header: 'Amount (UZS)',
                      align: 'right',
                      cell: (r) => formatMoney(r.uzs, 'UZS'),
                    },
                  ]}
                  rows={mock.investmentsTable}
                  getRowId={(r) => r.id}
                />
              }
            />
            <ChartCard
              mock
              title="Dividends"
              description="Latest accruals"
              table={
                <DataTable
                  columns={[
                    {
                      id: 'name',
                      header: 'Investor',
                      cell: (r) => <span className="font-medium">{r.name}</span>,
                    },
                    {
                      id: 'tariff',
                      header: 'Tariff',
                      cell: (r) => (
                        <span className="flex items-center gap-2">
                          <span
                            className="size-2.5 rounded-xs"
                            style={{ background: r.tariffColor }}
                          />
                          {r.tariff}
                        </span>
                      ),
                    },
                    {
                      id: 'period',
                      header: 'Period',
                      align: 'right',
                      cell: (r) => formatDate(r.period),
                    },
                    { id: 'usd', header: 'Amount (USD)', align: 'right', cell: (r) => usd(r.usd) },
                  ]}
                  rows={mock.dividendsTable}
                  getRowId={(r) => r.id}
                />
              }
            />
          </div>
        </TabPanel>
      </Tabs>
    </>
  )
}
