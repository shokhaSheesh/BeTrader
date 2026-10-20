import { usePolicyTypesQuery } from './queries'

/** All policy types (a handful) as picker options, labelled in English. */
export function usePolicyTypeOptions() {
  const query = usePolicyTypesQuery({ page: 1, pageSize: 100 })
  return {
    ...query,
    options: (query.data?.items ?? []).map((t) => ({ value: t.id, label: t.labelEn ?? t.id })),
  }
}

/**
 * Policy type id → English label. A single-record read of a linked table doesn't join the policy
 * type (`policy_Type_id_data` comes back empty), so detail and edit pages look the name up here.
 */
export function usePolicyTypeLabel() {
  const { options } = usePolicyTypeOptions()
  return (id: string | null | undefined) =>
    (id && options.find((o) => o.value === id)?.label) || null
}
