import type { ReactNode } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import type { Paginated } from '@/shared/types/api'
import { useTableFields } from '@/shared/api/useTableFields'
import { usePermissions } from '@/shared/permissions'
import {
  Button,
  ButtonLink,
  EmptyState,
  PageHeader,
  PageLoader,
  DetailSection,
  type DetailItem,
} from '@/shared/ui'

interface SingletonDetailProps<T extends { id: string }> {
  /** Backend table slug: field labels come from its schema */
  table: string
  title: string
  description?: string
  /** The table's list query; the page shows its first (and only) row */
  query: UseQueryResult<Paginated<T>>
  editTo: (r: T) => string
  sections: (r: T, label: (slug: string) => string) => { title: string; items: DetailItem[] }[]
  /** Something to show above the sections, e.g. a status */
  lead?: (r: T) => ReactNode
}

/**
 * Settings-style page for tables that hold exactly one record (About us, Contact info, Maintenance):
 * the values plus an Edit button, with no list, create or delete (DESIGN.md §3).
 */
export function SingletonDetail<T extends { id: string }>({
  table,
  title,
  description,
  query,
  editTo,
  sections,
  lead,
}: SingletonDetailProps<T>) {
  const fields = useTableFields(table)
  const { can } = usePermissions()
  const record = query.data?.items[0]

  if (query.isPending || fields.isPending) return <PageLoader />
  if (query.isError || !record) {
    return (
      <>
        <PageHeader title={title} description={description} />
        <div className="rounded-md border border-line bg-surface">
          <EmptyState
            variant={query.isError ? 'error' : 'empty'}
            title={query.isError ? `Couldn't load ${title.toLowerCase()}` : 'Nothing set up yet'}
            description={
              query.isError
                ? 'The connection dropped or the server failed.'
                : 'The backend has no record for this yet.'
            }
            action={
              query.isError ? (
                <Button
                  variant="secondary"
                  loading={query.isFetching}
                  onClick={() => query.refetch()}
                >
                  Try again
                </Button>
              ) : undefined
            }
          />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          can(table, 'update') && (
            <ButtonLink to={editTo(record)} icon={Pencil}>
              Edit
            </ButtonLink>
          )
        }
      />
      <div className="flex flex-col gap-6">
        {lead?.(record)}
        {sections(record, fields.fieldLabel).map((s) => (
          <DetailSection key={s.title} title={s.title} items={s.items} />
        ))}
      </div>
    </>
  )
}
