import { parseIsoDate, toIsoDate } from '@/shared/lib/date'
import type { TableFilters } from './ucode'

// Builders for u-code's server-side filter syntax. Filtering always happens on the backend.

/**
 * `{ created_time: { $gte, $lt } }` covering whole local days from `from` to `to` (inclusive), for
 * a DATE_TIME field or a system timestamp: local midnights sent as UTC timestamps.
 * DATE fields (a day, no time) need `dayRangeFilter` instead.
 */
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

/**
 * Date range on a **DATE** field (a day, no time), e.g. a currency rate's date: plain
 * `YYYY-MM-DD` values. u-code compares DATE fields with the UTC date of a timestamp, so the
 * local-midnight timestamps of `dateRangeFilter` (19:00 UTC the day before, in Tashkent) would
 * shift the range back a day (verified 2026-10-20). DATE_TIME fields use `dateRangeFilter`.
 */
export function dayRangeFilter(
  field: string,
  from: string | null,
  to: string | null,
): TableFilters {
  const start = parseIsoDate(from)
  const end = parseIsoDate(to)
  if (!start && !end) return {}
  const range: Record<string, string> = {}
  if (start) range.$gte = toIsoDate(start.y, start.m, start.d)
  if (end) {
    // Through a real Date so month and year ends roll over
    const next = new Date(end.y, end.m, end.d + 1)
    range.$lt = toIsoDate(next.getFullYear(), next.getMonth(), next.getDate())
  }
  return { [field]: range }
}

/** Multiselect fields must be filtered with an array; a plain string makes u-code answer 500. */
export const multiFilter = (field: string, values: string[]): TableFilters =>
  values.length ? { [field]: values } : {}

export const equalsFilter = (field: string, value: unknown): TableFilters =>
  value === null || value === undefined || value === '' ? {} : { [field]: value }
