import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getTableItem, getTableItems, RecordNotFoundError, type ListParams } from './ucode'

/** List query for a u-code table, mapped to a front-end model. Keeps old rows while refetching. */
export function useTableListQuery<Dto, Model>(
  slug: string,
  params: ListParams,
  map: (dto: Dto) => Model,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    enabled: options.enabled ?? true,
    queryKey: [slug, 'list', params],
    queryFn: async () => {
      const result = await getTableItems<Dto>(slug, params)
      return { ...result, items: result.items.map(map) }
    },
    placeholderData: keepPreviousData,
  })
}

/** One record of a u-code table, mapped to a front-end model. */
export function useTableItemQuery<Dto, Model>(
  slug: string,
  id: string | undefined,
  map: (dto: Dto) => Model,
) {
  return useQuery({
    queryKey: [slug, 'item', id],
    queryFn: async () => map(await getTableItem<Dto>(slug, id!)),
    enabled: !!id,
    retry: (count, error) => !(error instanceof RecordNotFoundError) && count < 1,
  })
}
