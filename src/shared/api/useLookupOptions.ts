import { useTableListQuery } from './queries'

/** Options for picking a record of a small backend table, e.g. `role` by its `name`. */
export function useLookupOptions(table: string, labelField: string) {
  const query = useTableListQuery(
    table,
    { page: 1, pageSize: 100 },
    (row: Record<string, unknown>) => ({
      value: String(row.guid),
      label: String(row[labelField] ?? row.guid),
    }),
  )
  return { ...query, options: query.data?.items ?? [] }
}
