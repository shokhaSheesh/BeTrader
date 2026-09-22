import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTableFields } from './ucode'

/**
 * Backend-defined labels for a table's select options.
 * `optionLabel('status', 'invest')` → "Investment". Unknown values are shown as-is, never invented.
 */
export function useTableFields(slug: string) {
  const query = useQuery({
    queryKey: ['ucode-fields', slug],
    queryFn: () => getTableFields(slug),
    staleTime: 10 * 60_000,
  })

  const fields = query.data
  const optionLabel = useCallback(
    (fieldSlug: string, value: string) =>
      fields?.find((f) => f.slug === fieldSlug)?.options.find((o) => o.value === value)?.label ??
      value,
    [fields],
  )

  return { ...query, optionLabel }
}
