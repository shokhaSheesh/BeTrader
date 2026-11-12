import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { http } from '@/shared/api/http'
import type { DashboardDto, DashboardPeriod } from '../model/types'

/**
 * GET /v1/analytics/dashboard?from=&to=: everything the Dashboard shows, for one period.
 *
 * u-code has no such endpoint yet (the live numbers are SQL inside DataLens): this is the
 * contract we ask the backend team for (docs/DASHBOARDS.md). In demo mode the mock backend
 * answers it; with the real backend the Dashboard shows the DataLens embed instead.
 */
export function useDashboardQuery(period: DashboardPeriod) {
  return useQuery({
    queryKey: ['dashboard', period],
    queryFn: async () => {
      const { data } = await http.get<{ data: DashboardDto }>('/v1/analytics/dashboard', {
        params: { from: period.from ?? undefined, to: period.to ?? undefined },
      })
      return data.data
    },
    // A new period keeps the current numbers on screen until the new ones arrive
    placeholderData: keepPreviousData,
  })
}
