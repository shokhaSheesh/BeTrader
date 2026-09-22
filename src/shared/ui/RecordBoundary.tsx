import type { ReactNode } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import { RecordNotFoundError } from '@/shared/api/ucode'
import { Button, ButtonLink } from './Button'
import { EmptyState } from './EmptyState'
import { PageLoader } from './PageLoader'

interface RecordBoundaryProps<T> {
  query: UseQueryResult<T>
  /** Singular, lowercase: "project" */
  noun: string
  back: { to: string; label: string }
  /** Something else the page needs before it can render, e.g. field labels */
  alsoPending?: boolean
  children: (data: T) => ReactNode
}

/** Loading and error states for a single-record page (detail, edit), identical everywhere. */
export function RecordBoundary<T>({
  query,
  noun,
  back,
  alsoPending,
  children,
}: RecordBoundaryProps<T>) {
  if (query.isPending || alsoPending) return <PageLoader label={`Loading ${noun}…`} />
  if (query.error instanceof RecordNotFoundError) {
    return (
      <div className="rounded-md border border-line bg-surface">
        <EmptyState
          variant="no-results"
          title={`This ${noun} doesn't exist`}
          description="It may have been deleted, or the link is wrong."
          action={
            <ButtonLink to={back.to} variant="secondary">
              Back to {back.label}
            </ButtonLink>
          }
        />
      </div>
    )
  }
  if (query.isError) {
    return (
      <div className="rounded-md border border-line bg-surface">
        <EmptyState
          variant="error"
          title={`Couldn't load this ${noun}`}
          description="It may have been deleted, or the connection dropped."
          action={
            <div className="flex gap-2">
              <ButtonLink to={back.to} variant="secondary">
                Back to {back.label}
              </ButtonLink>
              <Button variant="dark" loading={query.isFetching} onClick={() => query.refetch()}>
                Try again
              </Button>
            </div>
          }
        />
      </div>
    )
  }
  return <>{children(query.data)}</>
}
