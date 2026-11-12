import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLanguage } from '@/shared/i18n'
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
  // Russian names come from the backend's schema too; where it has none, the English one shows
  const ru = useLanguage() === 'ru'
  const optionLabel = useCallback(
    (fieldSlug: string, value: string) => {
      const option = fields?.find((f) => f.slug === fieldSlug)?.options.find((o) => o.value === value)
      return (ru && option?.label_ru) || option?.label || value
    },
    [fields, ru],
  )

  /**
   * Backend label of a field (`attributes.label_en`), falling back to the slug.
   * Empty while the schema loads, so raw slugs never flash; components show a placeholder bar for ''.
   */
  const fieldLabel = useCallback(
    (fieldSlug: string) => {
      if (!fields) return ''
      const field = fields.find((f) => f.slug === fieldSlug)
      return (ru && field?.labelRu) || field?.label || fieldSlug
    },
    [fields, ru],
  )

  /** Backend options of a select field, for dropdowns in forms. */
  const fieldOptions = useCallback(
    (fieldSlug: string) =>
      (fields?.find((f) => f.slug === fieldSlug)?.options ?? []).map((o) => ({
        ...o,
        label: (ru && o.label_ru) || o.label,
      })),
    [fields, ru],
  )

  /** The backend refuses a record without this field (`required` in /v2/fields). */
  const isRequired = useCallback(
    (fieldSlug: string) => !!fields?.find((f) => f.slug === fieldSlug)?.required,
    [fields],
  )

  return { ...query, optionLabel, fieldLabel, fieldOptions, isRequired }
}
