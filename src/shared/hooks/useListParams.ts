import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { PAGE_SIZES } from '@/shared/config/list'
import { useDebouncedValue } from './useDebouncedValue'

/**
 * Page, page size, search and filters stored in the URL (?page=2&q=ali&gender=male,female&from=2026-08-01),
 * so every filtered view can be shared as a link. `filterKeys` lists this page's filter params.
 */
export function useListParams(filterKeys: readonly string[] = []) {
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('page')) || 1)
  const sizeParam = Number(params.get('size'))
  const pageSize = (PAGE_SIZES as readonly number[]).includes(sizeParam) ? sizeParam : PAGE_SIZES[0]
  const search = params.get('q') ?? ''

  const [searchInput, setSearchInput] = useState(search)
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 350)

  const update = useCallback(
    (patch: Record<string, string | number | null>) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [key, value] of Object.entries(patch)) {
            if (value === null || value === '' || (key === 'page' && value === 1)) next.delete(key)
            else next.set(key, String(value))
          }
          return next
        },
        { replace: true },
      ),
    [setParams],
  )

  useEffect(() => {
    if (debouncedSearch !== search) update({ q: debouncedSearch, page: 1 })
  }, [debouncedSearch, search, update])

  const filter = (key: string) => params.get(key)
  const filterList = (key: string) => params.get(key)?.split(',').filter(Boolean) ?? []
  const hasFilters = filterKeys.some((key) => params.has(key))

  return {
    page,
    pageSize,
    search,
    searchInput,
    setSearchInput,
    setPage: (p: number) => update({ page: p }),
    setPageSize: (s: number) => update({ size: s === PAGE_SIZES[0] ? null : s, page: 1 }),
    resetSearch: () => {
      setSearchInput('')
      update({ q: null, page: 1 })
    },
    filter,
    filterList,
    /** Set one or more filter params; any change goes back to page 1. */
    setFilters: (patch: Record<string, string | string[] | null>) =>
      update({
        ...Object.fromEntries(
          Object.entries(patch).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') || null : v]),
        ),
        page: 1,
      }),
    hasFilters,
    /** Clears search and every filter of this page. */
    resetAll: () => {
      setSearchInput('')
      update({ q: null, page: 1, ...Object.fromEntries(filterKeys.map((k) => [k, null])) })
    },
  }
}
