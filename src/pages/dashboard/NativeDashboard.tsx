import { useState, type ReactNode } from 'react'
import { Banknote, HandCoins, TrendingUp, Users } from 'lucide-react'
import { useDashboardQuery, type DashboardDto, type DashboardPeriod } from '@/entities/dashboard'
import { ColumnChart, Legend, LineChart, StackedBars } from '@/shared/charts'
import { compact } from '@/shared/charts/scale'
import { useT } from '@/shared/i18n'
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

const ChartLoading = () => {
  const t = useT()
  return (
    <div className="grid h-72 place-items-center">
      <Loader size={32} label={t('Loading chart')} />
    </div>
  )
}

type DayRow = { x: string; y: number }
/** `label` and `dateLabel` arrive translated */
const dayTable = (
  rows: DayRow[],
  label: string,
  format: (v: number) => string,
  dateLabel: string,
) => (
  <div className="max-h-96 overflow-y-auto">
    <DataTable
      columns={[
        {
          id: 'date',
          header: dateLabel,
          cell: (r) => <span className="num">{formatDate(r.x)}</span>,
        },
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
  const t = useT()
  const [tab, setTab] = useState('overview')
  const [period, setPeriod] = useState<DashboardPeriod>(LAST_90_DAYS)
  const query = useDashboardQuery(period)
  const data = query.data

  return (
    <>
      <PageHeader
        title={t('Dashboard')}
        description={t('Investors, deposits, investments and dividends for the selected period.')}
      />
      <FilterBar
        active={period.from !== LAST_90_DAYS.from || period.to !== LAST_90_DAYS.to}
        onReset={() => setPeriod(LAST_90_DAYS)}
      >
        <DateRangeFilter label={t('Date')} from={period.from} to={period.to} onChange={setPeriod} />
      </FilterBar>

      {query.isError && !data ? (
        <EmptyState
          variant="error"
          title={t("Couldn't load the dashboard")}
          description={t('Something went wrong on our side or the connection dropped.')}
          action={
            <Button variant="secondary" loading={query.isFetching} onClick={() => query.refetch()}>
              {t('Try again')}
            </Button>
          }
        />
      ) : (
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'overview', label: t('Overview') },
            { value: 'investments', label: t('Investments & dividends') },
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
  const t = useT()
  const k = data?.kpis
  const registrations = data?.registrations_per_day.map((d) => ({ x: d.date, y: d.count })) ?? []
  const rates = [
    {
      name: t('Niyat rate'),
      color: 'var(--color-chart-1)',
      points: data?.usd_rate_per_day.map((d) => ({ x: d.date, y: d.niyat })) ?? [],
    },
    {
      name: t('Central Bank rate'),
      color: 'var(--color-chart-muted)',
      points: data?.usd_rate_per_day.map((d) => ({ x: d.date, y: d.central_bank })) ?? [],
    },
  ]
  const ready = (node: ReactNode) => (data ? node : <ChartLoading />)

  return (
    <>
      <KpiGrid>
        <KpiCard
          label={t('Total investors')}
          icon={Users}
          tone="accent"
          display={k && formatNumber(k.investors)}
        />
        <KpiCard
          label={t('Total deposits, UZS')}
          icon={Banknote}
          tone="info"
          display={k && compact(k.deposits_uzs)}
          exact={k && formatMoney(k.deposits_uzs, 'UZS')}
        />
        <KpiCard
          label={t('Total investments')}
          icon={TrendingUp}
          tone="success"
          display={k && `$${compact(k.investments_usd)}`}
          exact={k && usd(k.investments_usd)}
        />
        <KpiCard
          label={t('Total dividends')}
          icon={HandCoins}
          tone="accent"
          display={k && `$${compact(k.dividends_usd)}`}
          exact={k && usd(k.dividends_usd)}
        />
      </KpiGrid>
      <div className="flex flex-col gap-6">
        <ChartCard
          title={t('Registrations per day')}
          description={t('New investors signing up')}
          chart={ready(
            <ColumnChart
              data={registrations}
              label={t('Registrations')}
              formatValue={formatNumber}
              formatDate={formatDate}
            />,
          )}
          table={dayTable(registrations, t('Registrations'), formatNumber, t('Date'))}
        />
        <ChartCard
          title={t('USD rate per day')}
          description={t("UZS per USD: Niyat's rate against the Central Bank's, on one axis")}
          aside={<Legend mark="line" items={rates} />}
          chart={ready(
            <LineChart
              series={rates}
              label={t('USD rate per day')}
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
                    header: t('Date'),
                    cell: (r) => <span className="num">{formatDate(r.date)}</span>,
                  },
                  {
                    id: 'niyat',
                    header: t('Niyat rate'),
                    align: 'right',
                    cell: (r) => uzsRate(r.niyat),
                  },
                  {
                    id: 'cb',
                    header: t('Central Bank rate'),
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
          title={t('Investors')}
          description={t('Latest registrations in the period')}
          table={
            <DataTable
              columns={investorColumns(t)}
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

const investorColumns = (
  t: ReturnType<typeof useT>,
): Column<DashboardDto['latest_investors'][number]>[] => [
  {
    id: 'name',
    header: t('Full name'),
    cell: (r) => <span className="font-medium">{r.full_name}</span>,
  },
  {
    id: 'phone',
    header: t('Phone'),
    cell: (r) => <span className="num">{r.phone ? formatPhone(r.phone) : '—'}</span>,
  },
  {
    id: 'status',
    header: t('Identification'),
    cell: (r) =>
      r.is_identified ? (
        <Badge tone="success">{t('Identified')}</Badge>
      ) : (
        <Badge tone="warning">{t('Not identified')}</Badge>
      ),
  },
  {
    id: 'registered',
    header: t('Registered'),
    align: 'right',
    cell: (r) => formatDateTime(r.created_time),
  },
]

function Investments({ data }: { data?: DashboardDto }) {
  const t = useT()
  const tariffs = data?.by_tariff ?? []
  const investments = data?.investments_per_day.map((d) => ({ x: d.date, y: d.amount_usd })) ?? []
  const split = (
    [
      ['dividends_usd', 'Dividends', usd],
      ['investors', 'Investors with investments', formatNumber],
      ['investments_usd', 'Investments', usd],
    ] as const
  ).map(([key, label, format]) => ({
    label: t(label),
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
        title={t('Split by tariff')}
        description={t('Share of each tariff in dividends, investors and investments')}
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
                header: t('Tariff'),
                cell: (r) => (
                  <span className="font-medium">
                    <TariffName name={r.tariff} />
                  </span>
                ),
              },
              {
                id: 'div',
                header: t('Dividends'),
                align: 'right',
                cell: (r) => usd(r.dividends_usd),
              },
              {
                id: 'inv',
                header: t('Investors'),
                align: 'right',
                cell: (r) => formatNumber(r.investors),
              },
              {
                id: 'amt',
                header: t('Investments'),
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
        title={t('Investments per day')}
        description={t('Amount invested (USD)')}
        chart={
          data ? (
            <ColumnChart
              data={investments}
              label={t('Invested')}
              formatValue={usd}
              formatDate={formatDate}
            />
          ) : (
            <ChartLoading />
          )
        }
        table={dayTable(investments, t('Invested'), usd, t('Date'))}
      />
      <ChartCard
        title={t('Investments')}
        description={t('Latest purchases in the period')}
        table={
          <DataTable
            columns={[
              {
                id: 'name',
                header: t('Investor'),
                cell: (r) => <span className="font-medium">{r.full_name}</span>,
              },
              { id: 'tariff', header: t('Tariff'), cell: (r) => <TariffName name={r.tariff} /> },
              {
                id: 'phone',
                header: t('Phone'),
                cell: (r) => <span className="num">{r.phone ? formatPhone(r.phone) : '—'}</span>,
              },
              {
                id: 'passport',
                header: t('Passport'),
                cell: (r) => <span className="num">{r.passport ?? '—'}</span>,
              },
              {
                id: 'tx',
                header: t('Transaction ID'),
                cell: (r) => <span className="num">{r.transaction_id ?? '—'}</span>,
              },
              {
                id: 'created',
                header: t('Created'),
                align: 'right',
                cell: (r) => formatDateTime(r.created_time),
              },
              { id: 'rate', header: t('Rate'), align: 'right', cell: (r) => formatAmount(r.rate) },
              {
                id: 'usd',
                header: t('Amount (USD)'),
                align: 'right',
                cell: (r) => usd(r.amount_usd),
              },
              {
                id: 'uzs',
                header: t('Amount (UZS)'),
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
        title={t('Dividends')}
        description={t('Latest accruals in the period')}
        table={
          <DataTable
            columns={[
              {
                id: 'name',
                header: t('Investor'),
                cell: (r) => <span className="font-medium">{r.full_name}</span>,
              },
              { id: 'tariff', header: t('Tariff'), cell: (r) => <TariffName name={r.tariff} /> },
              {
                id: 'period',
                header: t('Period end'),
                align: 'right',
                cell: (r) => formatDate(r.to_date),
              },
              {
                id: 'usd',
                header: t('Amount (USD)'),
                align: 'right',
                cell: (r) => usd(r.amount_usd),
              },
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
