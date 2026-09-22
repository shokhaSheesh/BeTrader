import { useTableListQuery } from '@/shared/api/queries'
import { formatPhone } from '@/shared/lib/format'

interface InvestorOptionDto {
  guid: string
  full_name: string | null
  phone: string | null
}

export const INVESTORS_TABLE = 'investors'

/** Server-side search over investors (10k+ rows) for pickers. */
export function useInvestorOptions(search: string) {
  const query = useTableListQuery(
    INVESTORS_TABLE,
    { page: 1, pageSize: 20, search: search.trim() || undefined },
    (dto: InvestorOptionDto) => ({
      value: dto.guid,
      label: [dto.full_name || '—', dto.phone && formatPhone(dto.phone)]
        .filter(Boolean)
        .join(' · '),
    }),
  )
  return { ...query, options: query.data?.items ?? [] }
}
