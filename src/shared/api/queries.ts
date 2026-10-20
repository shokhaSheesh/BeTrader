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
// Also after a failure: a table's backend function can fail *after* u-code saved the change
// (seen on currency_percent), so the screens must show what really happened.

type Values = Record<string, unknown>

export function useCreateItemMutation(slug: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (values: Values) => createTableItem(slug, values),
    onSettled: () => client.invalidateQueries({ queryKey: [slug] }),
  })
}

export function useUpdateItemMutation(slug: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Values }) =>
      updateTableItem(slug, id, values),
    onSettled: () => client.invalidateQueries({ queryKey: [slug] }),
  })
}

export function useDeleteItemMutation(slug: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: Record<string, unknown> }) =>
      deleteTableItem(slug, id, data),
    // The deleted record's own query would 404 on refetch: drop it, refresh the lists
    onSuccess: (_, { id }) => client.removeQueries({ queryKey: [slug, 'item', id] }),
    onSettled: () => client.invalidateQueries({ queryKey: [slug, 'list'] }),
  })
}
