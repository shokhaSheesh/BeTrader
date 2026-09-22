import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { formatPhone } from '@/shared/lib/format'
import { toInvestor } from '../model/types'

export const INVESTORS_TABLE = 'investors'

export const useInvestorsQuery = (params: ListParams) =>
  useTableListQuery(INVESTORS_TABLE, params, toInvestor)

export const useInvestorQuery = (id: string | undefined) =>
  useTableItemQuery(INVESTORS_TABLE, id, toInvestor)

/** Server-side search over investors (10k+ rows) for pickers. */
export function useInvestorOptions(search: string) {
  const query = useInvestorsQuery({ page: 1, pageSize: 20, search: search.trim() || undefined })
  const options = (query.data?.items ?? []).map((i) => ({
    value: i.id,
    label: [i.fullName || '—', i.phone && formatPhone(i.phone)].filter(Boolean).join(' · '),
  }))
  return { ...query, options }
}
