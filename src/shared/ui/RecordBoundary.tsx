import type { ReactNode } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import { RecordNotFoundError } from '@/shared/api/ucode'
import { Button, ButtonLink } from './Button'
import { EmptyState } from './EmptyState'
import { PageLoader } from './PageLoader'
import { useT } from '@/shared/i18n'

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
  const t = useT()
  if (query.isPending || alsoPending) return <PageLoader label={t('Loading {noun}', { noun })} />
  if (query.error instanceof RecordNotFoundError) {
    return (
      <div className="rounded-md border border-line bg-surface">
        <EmptyState
          variant="no-results"
          title={t("This {noun} doesn't exist", { noun })}
          description={t('It may have been deleted, or the link is wrong.')}
          action={
            <ButtonLink to={back.to} variant="secondary">
              {t('Back to {label}', { label: back.label })}
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
          title={t("Couldn't load this {noun}", { noun })}
          description={t('It may have been deleted, or the connection dropped.')}
          action={
            <div className="flex gap-2">
              <ButtonLink to={back.to} variant="secondary">
                {t('Back to {label}', { label: back.label })}
              </ButtonLink>
              <Button variant="dark" loading={query.isFetching} onClick={() => query.refetch()}>
                {t('Try again')}
              </Button>
            </div>
          }
        />
      </div>
    )
  }
  return <>{children(query.data)}</>
}
