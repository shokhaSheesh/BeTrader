/**
 * The BI dashboards the panel embeds, as u-code's own pages do (docs/DASHBOARDS.md).
 *
 * These are the analysts' published dashboards, so the numbers are theirs, not ours —
 * we only frame them and pass the period the user picked (DESIGN.md §0).
 */
export const DASHBOARDS = {
  dividends: 'https://metabase.u-code.io/public/dashboard/e6bf5716-87d9-4166-8ee6-9b2e17bfd770',
  tariffs: 'https://metabase.u-code.io/public/dashboard/5b5b7fd7-0792-4fa7-8ad2-93756d88f955',
  overview: 'https://datalens.yandex/8xi4w15qfqsmt',
} as const

/** Metabase reads its `Date` parameter as `from~to`; an open end is left out. */
export function metabaseUrl(base: string, range?: { from: string | null; to: string | null }) {
  const date = range?.from && range.to ? `${range.from}~${range.to}` : ''
  // The panel supplies the period and the heading, so the frame hides both of its own.
  return `${base}?date=${date}#titled=false&bordered=false&hide_parameters=date`
}
