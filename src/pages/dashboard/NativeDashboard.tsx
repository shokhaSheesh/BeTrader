import { useState, type ReactNode } from 'react'
import { Banknote, HandCoins, TrendingUp, Users } from 'lucide-react'
import { useDashboardQuery, type DashboardDto, type DashboardPeriod } from '@/entities/dashboard'
import { ColumnChart, Legend, LineChart, StackedBars } from '@/shared/charts'
import { compact } from '@/shared/charts/scale'
import { toIsoDate } from '@/shared/lib/date'
import {
  formatAmount,
  formatDate,
  formatDateTime,
  formatMoney,
  formatNumber,
  formatPhone,
} from '@/shared/lib/format'
import {
  Badge,
  Button,
  DataTable,
  DateRangeFilter,
  EmptyState,
  FilterBar,
  KpiCard,
  KpiGrid,
  Loader,
  PageHeader,
  TabPanel,
  Tabs,
  type Column,
} from '@/shared/ui'
import { ChartCard } from '@/widgets/chart-card'

// The DataLens dashboard's widgets (docs/DASHBOARDS.md), drawn with our own charts.
// Numbers come from GET /v1/analytics/dashboard; nothing is totalled here.

const usd = (v: number) => formatMoney(v, 'USD')
const uzsRate = (v: number) => `${formatAmount(v)} UZS`

/** Color follows the tariff, never its rank (DESIGN.md §5 "Charts") */
const TARIFF_COLORS: Record<string, string> = {
  'High-yield': '#94C22F',
  Halal: '#14A08C',
  Conservative: '#4B5FC0',
}
const tariffColor = (name: string | null) =>
  (name && TARIFF_COLORS[name]) || 'var(--color-chart-muted)'

const TariffName = ({ name }: { name: string | null }) => (
  <span className="flex items-center gap-2">
    <span className="size-2.5 shrink-0 rounded-xs" style={{ background: tariffColor(name) }} />
    {name ?? '—'}
  </span>
)

const ChartLoading = () => (
  <div className="grid h-72 place-items-center">
    <Loader size={32} label="Loading chart" />
  </div>
)

type DayRow = { x: string; y: number }
const dayTable = (rows: DayRow[], label: string, format: (v: number) => string) => (
  <div className="max-h-96 overflow-y-auto">
    <DataTable
      columns={[
        { id: 'date', header: 'Date', cell: (r) => <span className="num">{formatDate(r.x)}</span> },
        { id: 'value', header: label, align: 'right', cell: (r) => format(r.y) },
      ]}
      rows={[...rows].reverse()}
      getRowId={(r) => r.x}
    />
  </div>
)

/** The period the dashboard opens with: daily bars stay readable */
const LAST_90_DAYS: DashboardPeriod = (() => {
  const d = new Date()
  d.setDate(d.getDate() - 89)
  const today = new Date()
  return {
    from: toIsoDate(d.getFullYear(), d.getMonth(), d.getDate()),
    to: toIsoDate(today.getFullYear(), today.getMonth(), today.getDate()),
  }
})()

export function NativeDashboard() {
  const [tab, setTab] = useState('overview')
  const [period, setPeriod] = useState<DashboardPeriod>(LAST_90_DAYS)
  const query = useDashboardQuery(period)
  const data = query.data

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Investors, deposits, investments and dividends for the selected period."
      />
      <FilterBar
        active={period.from !== LAST_90_DAYS.from || period.to !== LAST_90_DAYS.to}
        onReset={() => setPeriod(LAST_90_DAYS)}
      >
        <DateRangeFilter label="Date" from={period.from} to={period.to} onChange={setPeriod} />
      </FilterBar>

      {query.isError && !data ? (
        <EmptyState
          variant="error"
          title="Couldn't load the dashboard"
          description="Something went wrong on our side or the connection dropped."
          action={
            <Button variant="secondary" loading={query.isFetching} onClick={() => query.refetch()}>
              Try again
            </Button>
          }
        />
      ) : (
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'overview', label: 'Overview' },
            { value: 'investments', label: 'Investments & dividends' },
          ]}
        >
          <TabPanel value="overview">
            <Overview data={data} />
          </TabPanel>
          <TabPanel value="investments">
            <Investments data={data} />
          </TabPanel>
        </Tabs>
      )}
    </>
  )
}

function Overview({ data }: { data?: DashboardDto }) {
  const k = data?.kpis
  const registrations = data?.registrations_per_day.map((d) => ({ x: d.date, y: d.count })) ?? []
  const rates = [
    {
      name: 'Niyat rate',
      color: 'var(--color-chart-1)',
      points: data?.usd_rate_per_day.map((d) => ({ x: d.date, y: d.niyat })) ?? [],
    },
    {
      name: 'Central Bank rate',
      color: 'var(--color-chart-muted)',
      points: data?.usd_rate_per_day.map((d) => ({ x: d.date, y: d.central_bank })) ?? [],
    },
  ]
  const ready = (node: ReactNode) => (data ? node : <ChartLoading />)

  return (
    <>
      <KpiGrid>
        <KpiCard
          label="Total investors"
          icon={Users}
          tone="accent"
          display={k && formatNumber(k.investors)}
        />
        <KpiCard
          label="Total deposits, UZS"
          icon={Banknote}
          tone="info"
          display={k && compact(k.deposits_uzs)}
          exact={k && formatMoney(k.deposits_uzs, 'UZS')}
        />
        <KpiCard
          label="Total investments"
          icon={TrendingUp}
          tone="success"
          display={k && `$${compact(k.investments_usd)}`}
          exact={k && usd(k.investments_usd)}
        />
        <KpiCard
          label="Total dividends"
          icon={HandCoins}
          tone="accent"
          display={k && `$${compact(k.dividends_usd)}`}
          exact={k && usd(k.dividends_usd)}
        />
      </KpiGrid>
      <div className="flex flex-col gap-6">
        <ChartCard
          title="Registrations per day"
          description="New investors signing up"
          chart={ready(
            <ColumnChart
              data={registrations}
              label="Registrations"
              formatValue={formatNumber}
              formatDate={formatDate}
            />,
          )}
          table={dayTable(registrations, 'Registrations', formatNumber)}
        />
        <ChartCard
          title="USD rate per day"
          description="UZS per USD: Niyat's rate against the Central Bank's, on one axis"
          aside={<Legend mark="line" items={rates} />}
          chart={ready(
            <LineChart
              series={rates}
              label="USD rate per day"
              formatValue={uzsRate}
              formatDate={formatDate}
            />,
          )}
          table={
            <div className="max-h-96 overflow-y-auto">
              <DataTable
                columns={[
                  {
                    id: 'date',
                    header: 'Date',
                    cell: (r) => <span className="num">{formatDate(r.date)}</span>,
                  },
                  {
                    id: 'niyat',
                    header: 'Niyat rate',
                    align: 'right',
                    cell: (r) => uzsRate(r.niyat),
                  },
                  {
                    id: 'cb',
                    header: 'Central Bank rate',
                    align: 'right',
                    cell: (r) => uzsRate(r.central_bank),
                  },
                ]}
                rows={[...(data?.usd_rate_per_day ?? [])].reverse()}
                getRowId={(r) => r.date}
                loading={!data}
              />
            </div>
          }
        />
        <ChartCard
          title="Investors"
          description="Latest registrations in the period"
          table={
            <DataTable
              columns={INVESTOR_COLUMNS}
              rows={data?.latest_investors ?? []}
              getRowId={(r) => r.guid}
              loading={!data}
            />
          }
        />
      </div>
    </>
  )
}

const INVESTOR_COLUMNS: Column<DashboardDto['latest_investors'][number]>[] = [
  {
    id: 'name',
    header: 'Full name',
    cell: (r) => <span className="font-medium">{r.full_name}</span>,
  },
  {
    id: 'phone',
    header: 'Phone',
    cell: (r) => <span className="num">{r.phone ? formatPhone(r.phone) : '—'}</span>,
  },
  {
    id: 'status',
    header: 'Identification',
    cell: (r) =>
      r.is_identified ? (
        <Badge tone="success">Identified</Badge>
      ) : (
        <Badge tone="warning">Not identified</Badge>
      ),
  },
  {
    id: 'registered',
    header: 'Registered',
    align: 'right',
    cell: (r) => formatDateTime(r.created_time),
  },
]

function Investments({ data }: { data?: DashboardDto }) {
  const tariffs = data?.by_tariff ?? []
  const investments = data?.investments_per_day.map((d) => ({ x: d.date, y: d.amount_usd })) ?? []
  const split = (
    [
      ['dividends_usd', 'Dividends', usd],
      ['investors', 'Investors with investments', formatNumber],
      ['investments_usd', 'Investments', usd],
    ] as const
  ).map(([key, label, format]) => ({
    label,
    total: format(tariffs.reduce((s, t) => s + t[key], 0)),
    segments: tariffs.map((t) => ({
      name: t.tariff,
      color: tariffColor(t.tariff),
      value: t[key],
      display: format(t[key]),
    })),
  }))

  return (
    <div className="flex flex-col gap-6">
      <ChartCard
        title="Split by tariff"
        description="Share of each tariff in dividends, investors and investments"
        aside={
          <Legend
            mark="rect"
            items={tariffs.map((t) => ({ name: t.tariff, color: tariffColor(t.tariff) }))}
          />
        }
        chart={data ? <StackedBars rows={split} /> : <ChartLoading />}
        table={
          <DataTable
            columns={[
              {
                id: 'tariff',
                header: 'Tariff',
                cell: (r) => (
                  <span className="font-medium">
                    <TariffName name={r.tariff} />
                  </span>
                ),
              },
              { id: 'div', header: 'Dividends', align: 'right', cell: (r) => usd(r.dividends_usd) },
              {
                id: 'inv',
                header: 'Investors',
                align: 'right',
                cell: (r) => formatNumber(r.investors),
              },
              {
                id: 'amt',
                header: 'Investments',
                align: 'right',
                cell: (r) => usd(r.investments_usd),
              },
            ]}
            rows={tariffs}
            getRowId={(r) => r.tariff}
            loading={!data}
          />
        }
      />
      <ChartCard
        title="Investments per day"
        description="Amount invested (USD)"
        chart={
          data ? (
            <ColumnChart
              data={investments}
              label="Invested"
              formatValue={usd}
              formatDate={formatDate}
            />
          ) : (
            <ChartLoading />
          )
        }
        table={dayTable(investments, 'Invested', usd)}
      />
      <ChartCard
        title="Investments"
        description="Latest purchases in the period"
        table={
          <DataTable
            columns={[
              {
                id: 'name',
                header: 'Investor',
                cell: (r) => <span className="font-medium">{r.full_name}</span>,
              },
              { id: 'tariff', header: 'Tariff', cell: (r) => <TariffName name={r.tariff} /> },
              {
                id: 'phone',
                header: 'Phone',
                cell: (r) => <span className="num">{r.phone ? formatPhone(r.phone) : '—'}</span>,
              },
              {
                id: 'passport',
                header: 'Passport',
                cell: (r) => <span className="num">{r.passport ?? '—'}</span>,
              },
              {
                id: 'tx',
                header: 'Transaction ID',
                cell: (r) => <span className="num">{r.transaction_id ?? '—'}</span>,
              },
              {
                id: 'created',
                header: 'Created',
                align: 'right',
                cell: (r) => formatDateTime(r.created_time),
              },
              { id: 'rate', header: 'Rate', align: 'right', cell: (r) => formatAmount(r.rate) },
              { id: 'usd', header: 'Amount (USD)', align: 'right', cell: (r) => usd(r.amount_usd) },
              {
                id: 'uzs',
                header: 'Amount (UZS)',
                align: 'right',
                cell: (r) => formatMoney(r.amount_uzs, 'UZS'),
              },
            ]}
            rows={data?.latest_investments ?? []}
            getRowId={(r) => r.guid}
            loading={!data}
          />
        }
      />
      <ChartCard
        title="Dividends"
        description="Latest accruals in the period"
        table={
          <DataTable
            columns={[
              {
                id: 'name',
                header: 'Investor',
                cell: (r) => <span className="font-medium">{r.full_name}</span>,
              },
              { id: 'tariff', header: 'Tariff', cell: (r) => <TariffName name={r.tariff} /> },
              {
                id: 'period',
                header: 'Period end',
                align: 'right',
                cell: (r) => formatDate(r.to_date),
              },
              { id: 'usd', header: 'Amount (USD)', align: 'right', cell: (r) => usd(r.amount_usd) },
            ]}
            rows={data?.latest_dividends ?? []}
            getRowId={(r) => r.guid}
            loading={!data}
          />
        }
      />
    </div>
  )
}
