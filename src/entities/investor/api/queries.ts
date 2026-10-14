import { useInfiniteQuery } from '@tanstack/react-query'
import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import { getTableItems, type ListParams } from '@/shared/api/ucode'
import type { Paging } from '@/shared/ui'
import { formatPhone } from '@/shared/lib/format'
import { toInvestor, type InvestorDto } from '../model/types'

export const INVESTORS_TABLE = 'investors'

export const useInvestorsQuery = (params: ListParams) =>
  useTableListQuery(INVESTORS_TABLE, params, toInvestor)

export const useInvestorQuery = (id: string | undefined) =>
  useTableItemQuery(INVESTORS_TABLE, id, toInvestor)

const OPTIONS_PAGE = 20

/**
 * Server-side search over investors (10k+ rows) for pickers and the investor filter.
 * Loads 20 at a time; `paging` fetches the next 20 as the list scrolls to its end.
 */
export function useInvestorOptions(search: string) {
  const term = search.trim() || undefined
  const query = useInfiniteQuery({
    queryKey: [INVESTORS_TABLE, 'options', term ?? ''],
    queryFn: ({ pageParam }) =>
      getTableItems<InvestorDto>(INVESTORS_TABLE, {
        page: pageParam,
        pageSize: OPTIONS_PAGE,
        search: term,
      }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page * last.limit < last.total ? last.page + 1 : undefined),
  })
  // A record can shift between pages while scrolling: keep each investor once
  const byId = new Map<string, { value: string; label: string }>()
  for (const dto of query.data?.pages.flatMap((p) => p.items) ?? []) {
    const i = toInvestor(dto)
    byId.set(i.id, {
      value: i.id,
      label: [i.fullName || '—', i.phone && formatPhone(i.phone)].filter(Boolean).join(' · '),
    })
  }
  return {
    options: [...byId.values()],
    /** The first page of a search is loading (the next pages show their own loader) */
    isFetching: query.isFetching && !query.isFetchingNextPage,
    paging: {
      hasMore: !!query.hasNextPage,
      loadingMore: query.isFetchingNextPage,
      onLoadMore: () => void query.fetchNextPage(),
    } satisfies Paging,
  }
}
