import { useQuery } from '@tanstack/react-query'
import { getTableItems, type TableFilters } from './ucode'

/** A count computed by the backend: `count` of a filtered list, fetching a single row. */
export function useTableCount(slug: string, filters: TableFilters = {}) {
  return useQuery({
    queryKey: [slug, 'count', filters],
    queryFn: async () => (await getTableItems(slug, { page: 1, pageSize: 1, filters })).total,
    staleTime: 60_000,
  })
}
