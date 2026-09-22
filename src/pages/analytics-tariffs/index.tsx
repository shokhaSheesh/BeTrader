import { formatMoney } from '@/shared/lib/format'
import { TARIFFS, tariffPivot } from '@/shared/mocks/analytics'
import { Badge, Dash, PageHeader } from '@/shared/ui'
import { ChartCard } from '@/widgets/chart-card'

// Mock of the Metabase "Analytics by tariff" pivot (docs/DASHBOARDS.md). Numbers are invented.
// Totals are on here; the original had them off (docs/DASHBOARDS.md recommends turning them on).
const usd = (v: number) => formatMoney(v, 'USD')
const th = 'h-10 px-4 text-xs font-medium whitespace-nowrap text-fg-muted'
const td = 'h-12 px-4 whitespace-nowrap'

function columnTotals() {
  return Object.fromEntries(
    TARIFFS.map((t) => [
      t.key,
      tariffPivot.reduce(
        (acc, r) => ({
          investment: acc.investment + (r.cells[t.key]?.investment ?? 0),
          dividends: acc.dividends + (r.cells[t.key]?.dividends ?? 0),
        }),
        { investment: 0, dividends: 0 },
      ),
    ]),
  ) as Record<(typeof TARIFFS)[number]['key'], { investment: number; dividends: number }>
}

export default function AnalyticsTariffsPage() {
  const totals = columnTotals()
  const rowTotal = (r: (typeof tariffPivot)[number]) =>
    TARIFFS.reduce(
      (acc, t) => ({
        investment: acc.investment + (r.cells[t.key]?.investment ?? 0),
        dividends: acc.dividends + (r.cells[t.key]?.dividends ?? 0),
      }),
      { investment: 0, dividends: 0 },
    )
  const grand = TARIFFS.reduce(
    (acc, t) => ({
      investment: acc.investment + totals[t.key].investment,
      dividends: acc.dividends + totals[t.key].dividends,
    }),
    { investment: 0, dividends: 0 },
  )

  return (
    <>
      <PageHeader
        title="Analytics by tariff"
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <Badge tone="warning">Mock data</Badge> Each investor's investment and dividends per
            project.
          </span>
        }
      />
      <ChartCard
        mock
        title="Investor × project"
        description="Amounts in USD"
        table={
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-muted">
                  <th rowSpan={2} className={`${th} text-left`}>
                    Investor
                  </th>
                  <th rowSpan={2} className={`${th} text-left`}>
                    Percent
                  </th>
                  {TARIFFS.map((t) => (
                    <th
                      key={t.key}
                      colSpan={2}
                      className={`${th} border-l border-line text-center`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="size-2.5 rounded-xs" style={{ background: t.color }} />
                        {t.name}
                      </span>
                    </th>
                  ))}
                  <th colSpan={2} className={`${th} border-l border-line text-center`}>
                    Total
                  </th>
                </tr>
                <tr className="bg-surface-muted">
                  {[...TARIFFS.map((t) => t.key), 'total'].flatMap((k) => [
                    <th key={`${k}-i`} className={`${th} border-l border-line text-right`}>
                      Investment
                    </th>,
                    <th key={`${k}-d`} className={`${th} text-right`}>
                      Dividends
                    </th>,
                  ])}
                </tr>
              </thead>
              <tbody>
                {tariffPivot.map((r) => {
                  const rt = rowTotal(r)
                  return (
                    <tr key={r.id} className="border-t border-line hover:bg-surface-hover">
                      <td className={`${td} font-medium`}>{r.name}</td>
                      <td className={`${td} num`}>{r.percent}</td>
                      {TARIFFS.map((t) => (
                        <FragmentCells key={t.key} cell={r.cells[t.key]} />
                      ))}
                      <td className={`${td} num border-l border-line text-right font-medium`}>
                        {usd(rt.investment)}
                      </td>
                      <td className={`${td} num text-right font-medium`}>{usd(rt.dividends)}</td>
                    </tr>
                  )
                })}
                <tr className="border-t border-line bg-surface-muted font-semibold">
                  <td className={td} colSpan={2}>
                    Total
                  </td>
                  {TARIFFS.map((t) => (
                    <FragmentCells key={t.key} cell={totals[t.key]} />
                  ))}
                  <td className={`${td} num border-l border-line text-right`}>
                    {usd(grand.investment)}
                  </td>
                  <td className={`${td} num text-right`}>{usd(grand.dividends)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        }
      />
    </>
  )
}

function FragmentCells({ cell }: { cell: { investment: number; dividends: number } | null }) {
  return (
    <>
      <td className={`${td} num border-l border-line text-right`}>
        {cell ? usd(cell.investment) : <Dash />}
      </td>
      <td className={`${td} num text-right`}>{cell ? usd(cell.dividends) : <Dash />}</td>
    </>
  )
}
