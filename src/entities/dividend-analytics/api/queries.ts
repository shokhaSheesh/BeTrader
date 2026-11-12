import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { http } from '@/shared/api/http'

/** One investor's line of the Metabase "Dividends per investor" report (docs/DASHBOARDS.md). */
export interface DividendAnalyticsRow {
  investors_id: string
  full_name: string
  pinfl: string | null
  dividend_amount: number
  taxable_base: number
  tax_withheld: number
}

interface Params {
  from: string | null
  to: string | null
  page: number
  pageSize: number
}

/**
 * GET /v1/analytics/dividends?from=&to=&offset=&limit=: the report's rows for a period,
 * computed by the backend. u-code has no such endpoint yet (the live report is SQL inside
 * Metabase): it's the contract we ask the backend team for. In demo mode the mock backend
 * answers it; with the real backend the page shows the Metabase embed instead.
 */
export function useDividendAnalyticsQuery({ from, to, page, pageSize }: Params) {
  return useQuery({
    queryKey: ['dividend-analytics', from, to, page, pageSize],
    queryFn: async () => {
      const { data } = await http.get<{
        data: { count: number; response: DividendAnalyticsRow[] }
      }>('/v1/analytics/dividends', {
        params: {
          from: from ?? undefined,
          to: to ?? undefined,
          offset: (page - 1) * pageSize,
          limit: pageSize,
        },
      })
      return { items: data.data.response, total: data.data.count }
    },
    placeholderData: keepPreviousData,
  })
}
