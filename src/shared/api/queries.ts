import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTableItem,
  deleteTableItem,
  getTableItem,
  getTableItems,
  RecordNotFoundError,
  updateTableItem,
  type ListParams,
} from './ucode'

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

// Writes. Each one refetches the table's lists and records, so every screen shows the result.

type Values = Record<string, unknown>

export function useCreateItemMutation(slug: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (values: Values) => createTableItem(slug, values),
    onSuccess: () => client.invalidateQueries({ queryKey: [slug] }),
  })
}

export function useUpdateItemMutation(slug: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Values }) =>
      updateTableItem(slug, id, values),
    onSuccess: () => client.invalidateQueries({ queryKey: [slug] }),
  })
}

export function useDeleteItemMutation(slug: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTableItem(slug, id),
    // The deleted record's own query would 404 on refetch: drop it, refresh the lists
    onSuccess: (_, id) => {
      client.removeQueries({ queryKey: [slug, 'item', id] })
      return client.invalidateQueries({ queryKey: [slug, 'list'] })
    },
  })
}
