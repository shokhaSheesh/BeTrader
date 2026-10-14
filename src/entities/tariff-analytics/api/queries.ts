import { useQuery } from '@tanstack/react-query'
import { runAggregation } from '@/shared/api/ucode'
import { depositsQuery, grandTotalQuery, totalsQuery, type Period } from '../model/queries'
import {
  groupByInvestor,
  sortDeposits,
  toDeposit,
  toTotals,
  type TariffTotals,
} from '../model/types'

/** The aggregation runs against `orders`: the role needs read on it. */
export const TARIFF_ANALYTICS_TABLE = 'orders'

export function useTariffAnalyticsQuery(period: Period, search: string) {
  return useQuery({
    queryKey: ['tariff-analytics', period, search],
    queryFn: async () => {
      const [deposits, totals, grand] = await Promise.all([
        runAggregation<Parameters<typeof toDeposit>[0]>(
          TARIFF_ANALYTICS_TABLE,
          depositsQuery(period, search),
        ),
        runAggregation<Parameters<typeof toTotals>[0]>(
          TARIFF_ANALYTICS_TABLE,
          totalsQuery(period, search),
        ),
        runAggregation<Parameters<typeof toTotals>[0]>(
          TARIFF_ANALYTICS_TABLE,
          grandTotalQuery(period, search),
        ),
      ])
      const rows = sortDeposits(deposits.map(toDeposit))
      const perTariff = new Map<string, TariffTotals>(
        totals.map((t) => [t.project_name ?? '—', toTotals(t)]),
      )
      return {
        investors: groupByInvestor(rows),
        /** Every deposit, as the Excel export lists them: one row each */
        deposits: rows,
        // Tariff columns come from the totals, in the order the backend returned them.
        tariffs: totals.map((t) => t.project_name ?? '—'),
        // English name → the Russian one, which the Excel export uses for its column groups
        tariffLabels: new Map(
          totals.map((t) => [t.project_name ?? '—', t.project_name_ru ?? t.project_name ?? '—']),
        ),
        totals: perTariff,
        grand: grand[0] ? toTotals(grand[0]) : null,
      }
    },
  })
}
