import { parseIsoDate } from '@/shared/lib/date'
import type { TableFilters } from './ucode'

// Builders for u-code's server-side filter syntax. Filtering always happens on the backend.

/** `{ created_time: { $gte, $lt } }` covering whole local days from `from` to `to` (inclusive). */
export function dateRangeFilter(
  field: string,
  from: string | null,
  to: string | null,
): TableFilters {
  const start = parseIsoDate(from)
  const end = parseIsoDate(to)
  if (!start && !end) return {}
  const range: Record<string, string> = {}
  if (start) range.$gte = new Date(start.y, start.m, start.d).toISOString()
  if (end) range.$lt = new Date(end.y, end.m, end.d + 1).toISOString()
  return { [field]: range }
}

/** Multiselect fields must be filtered with an array; a plain string makes u-code answer 500. */
export const multiFilter = (field: string, values: string[]): TableFilters =>
  values.length ? { [field]: values } : {}

export const equalsFilter = (field: string, value: unknown): TableFilters =>
  value === null || value === undefined || value === '' ? {} : { [field]: value }
