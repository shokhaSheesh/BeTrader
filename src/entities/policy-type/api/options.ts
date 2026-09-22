import { usePolicyTypesQuery } from './queries'

/** All policy types (a handful) as picker options, labelled in English. */
export function usePolicyTypeOptions() {
  const query = usePolicyTypesQuery({ page: 1, pageSize: 100 })
  return {
    ...query,
    options: (query.data?.items ?? []).map((t) => ({ value: t.id, label: t.labelEn ?? t.id })),
  }
}
