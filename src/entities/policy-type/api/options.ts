import { useLocalized } from '@/shared/i18n'
import { usePolicyTypesQuery } from './queries'

/** All policy types (a handful) as picker options, labelled in the interface language. */
export function usePolicyTypeOptions() {
  const query = usePolicyTypesQuery({ page: 1, pageSize: 100 })
  const pick = useLocalized()
  return {
    ...query,
    options: (query.data?.items ?? []).map((t) => ({
      value: t.id,
      label: pick(t.labelEn, t.labelRu) ?? t.id,
    })),
  }
}

/**
 * Policy type id → label in the interface language. A single-record read of a linked table doesn't join the policy
 * type (`policy_Type_id_data` comes back empty), so detail and edit pages look the name up here.
 */
export function usePolicyTypeLabel() {
  const { options } = usePolicyTypeOptions()
  return (id: string | null | undefined) =>
    (id && options.find((o) => o.value === id)?.label) || null
}
