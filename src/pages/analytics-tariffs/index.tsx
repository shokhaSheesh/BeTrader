import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { useTariffAnalyticsQuery, type TariffTotals } from '@/entities/tariff-analytics'
import { exportTariffReport } from '@/features/tariff-export'
import { toast } from '@/shared/lib/toast'
import { useListParams } from '@/shared/hooks/useListParams'
import { parseIsoDate, toIsoDate } from '@/shared/lib/date'
import { formatAmount, formatMoney, formatNumber } from '@/shared/lib/format'
import {
  Button,
  Dash,
  DateRangeFilter,
  EmptyState,
  FilterBar,
  PageHeader,
  PageLoader,
  SearchInput,
} from '@/shared/ui'

// Rebuilt from u-code's "Analytics by tariff" microfrontend; same SQL, our design (docs/API.md).
const SUB_COLUMNS = ['Deposit date', 'Investment (USD)', 'Deposit (UZS)', 'Rate', 'Dividends (USD)']
const th = 'h-10 px-4 text-xs font-medium whitespace-nowrap text-fg-muted'
const td = 'h-12 px-4 whitespace-nowrap align-top'
const sticky = 'sticky left-0 z-[1] bg-surface shadow-[inset_-1px_0_0_var(--color-line)]'

const year = new Date().getFullYear()
const DEFAULT_FROM = toIsoDate(year, 0, 1)
const DEFAULT_TO = toIsoDate(year, 11, 31)

/** The dividend window the SQL needs: `to` is exclusive, so add a day. */
function toPeriod(from: string, to: string) {
  const end = parseIsoDate(to)!
  // Through a real Date so month and year ends roll over (31 Dec → 1 Jan).
  const next = new Date(end.y, end.m, end.d + 1)
  return { from, to: toIsoDate(next.getFullYear(), next.getMonth(), next.getDate()) }
}

const money = (v: number | null | undefined, currency: 'USD' | 'UZS') =>
  // The column header states the currency, so UZS cells stay plain and the table reads cleanly.
  // Sums are shown whole, as the report does: a tiyin on a billion sums is noise.
  v != null ? (
    <span className="num">{currency === 'USD' ? formatMoney(v, 'USD') : formatNumber(v, 0)}</span>
  ) : (
    <Dash />
  )
const rate = (v: number | null | undefined) =>
  v != null ? <span className="num">{formatAmount(v)}</span> : <Dash />
/** "2026-09-24 10:46" as the backend formats it → "24.09.2026 10:46". */
const depositDate = (value: string | null) => {
  const m = value && /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}:\d{2})/.exec(value)
  return m ? <span className="num">{`${m[3]}.${m[2]}.${m[1]} ${m[4]}`}</span> : <Dash />
}

function TotalCells({ totals }: { totals: TariffTotals | undefined }) {
  return (
    <>
      <td className={`${td} text-fg-muted`}>
        {totals?.investors != null ? `${totals.investors} investors` : <Dash />}
      </td>
      <td className={`${td} text-right`}>{money(totals?.investmentUsd, 'USD')}</td>
      <td className={`${td} text-right`}>{money(totals?.investmentUzs, 'UZS')}</td>
      <td className={`${td} text-right`}>{rate(totals?.rate)}</td>
      <td className={`${td} text-right`}>{money(totals?.dividendUsd, 'USD')}</td>
    </>
  )
}

export default function AnalyticsTariffsPage() {
  const list = useListParams(['from', 'to'])
  const from = list.filter('from') ?? DEFAULT_FROM
  const to = list.filter('to') ?? DEFAULT_TO
  const period = useMemo(() => toPeriod(from, to), [from, to])
  const query = useTariffAnalyticsQuery(period, list.search)
  const data = query.data
  const [exporting, setExporting] = useState(false)

  // The .xlsx is built in the browser from the rows already on screen (u-code's export does the same).
  const exportXlsx = async () => {
    if (!data) return
    setExporting(true)
    try {
      await exportTariffReport({
        deposits: data.deposits,
        tariffs: data.tariffs,
        tariffLabels: data.tariffLabels,
        totals: data.totals,
        grand: data.grand,
        from,
        to,
      })
    } catch {
      toast.error("Couldn't build the Excel file", 'Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Analytics by tariff"
        description="Each investor's deposits per tariff, with the dividends accrued in the selected period."
        actions={
          <Button
            variant="secondary"
            icon={Download}
            loading={exporting}
            disabled={!data?.investors.length}
            onClick={exportXlsx}
          >
            Excel
          </Button>
        }
      />

      <FilterBar active={!!list.search || list.hasFilters} onReset={list.resetAll}>
        <SearchInput
          value={list.searchInput}
          onChange={list.setSearchInput}
          placeholder="Search by investor name"
        />
        <DateRangeFilter
          label="Dividends period"
          from={from}
          to={to}
          onChange={({ from, to }) => list.setFilters({ from, to })}
        />
      </FilterBar>

      <div className="relative overflow-hidden rounded-md border border-line bg-surface">
        {query.isPending ? (
          <PageLoader label="Loading analytics" />
        ) : query.isError ? (
          <EmptyState
            variant="error"
            title="Couldn't load the report"
            description="Something went wrong on our side or the connection dropped."
            action={
              <Button
                variant="secondary"
                loading={query.isFetching}
                onClick={() => query.refetch()}
              >
                Try again
              </Button>
            }
          />
        ) : !data || data.investors.length === 0 ? (
          <EmptyState
            variant={list.search ? 'no-results' : 'empty'}
            title={list.search ? 'Nothing matches this search' : 'No deposits yet'}
            description={
              list.search
                ? `No investor found for “${list.search}”.`
                : 'Deposits appear here once investors buy into a project.'
            }
            action={
              list.search ? (
                <Button variant="secondary" onClick={list.resetAll}>
                  Reset search
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div
            className={`overflow-x-auto transition-opacity ${query.isFetching ? 'opacity-60' : ''}`}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-muted">
                  <th rowSpan={2} className={`${th} ${sticky} bg-surface-muted text-left`}>
                    Full name
                  </th>
                  <th rowSpan={2} className={`${th} text-left`}>
                    Percent
                  </th>
                  {data.tariffs.map((t) => (
                    <th
                      key={t}
                      colSpan={SUB_COLUMNS.length}
                      className={`${th} border-l border-line text-center`}
                    >
                      {t}
                    </th>
                  ))}
                </tr>
                <tr className="bg-surface-muted">
                  {data.tariffs.flatMap((t) =>
                    SUB_COLUMNS.map((c, i) => (
                      <th
                        key={`${t}-${c}`}
                        className={`${th} ${i === 0 ? 'border-l border-line text-left' : 'text-right'}`}
                      >
                        {c}
                      </th>
                    )),
                  )}
                </tr>
              </thead>
              <tbody>
                {data.investors.map((investor) =>
                  investor.blocks.flatMap((block, b) =>
                    block.deposits.map((deposit, d) => (
                      <tr
                        key={`${investor.fullName}-${block.tariff}-${d}`}
                        className={`group hover:bg-surface-hover ${b === 0 && d === 0 ? 'border-t border-line' : ''}`}
                      >
                        {b === 0 && d === 0 && (
                          <td
                            rowSpan={investor.lines}
                            className={`${td} ${sticky} font-medium transition-colors group-hover:bg-surface-hover`}
                          >
                            {investor.fullName ?? <Dash />}
                          </td>
                        )}
                        {/* The percent belongs to the tariff, so it spans that block's lines */}
                        {d === 0 && (
                          <td rowSpan={block.deposits.length} className={`${td} num text-fg-muted`}>
                            {block.percent ?? <Dash />}
                          </td>
                        )}
                        {data.tariffs.flatMap((t) => {
                          const own = t === block.tariff
                          const cell = (key: string, content: React.ReactNode, first = false) => (
                            <td
                              key={`${t}-${key}`}
                              className={`${td} ${first ? 'border-l border-line' : 'text-right'}`}
                            >
                              {own ? content : null}
                            </td>
                          )
                          return [
                            cell('date', depositDate(deposit.depositAt), true),
                            cell('usd', money(deposit.investmentUsd, 'USD')),
                            cell('uzs', money(deposit.investmentUzs, 'UZS')),
                            cell('rate', rate(deposit.rate)),
                            cell(
                              'div',
                              deposit.dividendUsd ? money(deposit.dividendUsd, 'USD') : <Dash />,
                            ),
                          ]
                        })}
                      </tr>
                    )),
                  ),
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-line bg-surface-muted font-semibold">
                  <td className={`${td} ${sticky} bg-surface-muted`}>Total</td>
                  <td className={`${td} text-fg-muted`}>
                    {data.grand?.investors != null ? `${data.grand.investors} investors` : <Dash />}
                  </td>
                  {data.tariffs.map((t) => (
                    <TotalCells key={t} totals={data.totals.get(t)} />
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
