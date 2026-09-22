import { Button } from './Button'
import { EmptyState } from './EmptyState'

interface ListEmptyStateProps {
  /** Plural, lowercase: "projects", "project types" */
  noun: string
  isError: boolean
  retrying: boolean
  onRetry: () => void
  search: string
  /** Any filter besides search is active */
  filtered?: boolean
  onResetSearch: () => void
}

/** The error → no-results → empty decision every list page uses, with identical copy. */
export function ListEmptyState({
  noun,
  isError,
  retrying,
  onRetry,
  search,
  filtered,
  onResetSearch,
}: ListEmptyStateProps) {
  if (isError) {
    return (
      <EmptyState
        variant="error"
        title={`Couldn't load ${noun}`}
        description="Something went wrong on our side or the connection dropped."
        action={
          <Button variant="secondary" loading={retrying} onClick={onRetry}>
            Try again
          </Button>
        }
      />
    )
  }
  if (search || filtered) {
    return (
      <EmptyState
        variant="no-results"
        title={filtered ? 'Nothing matches these filters' : 'Nothing matches this search'}
        description={
          filtered ? 'Try changing or resetting the filters.' : `No ${noun} found for “${search}”.`
        }
        action={
          <Button variant="secondary" onClick={onResetSearch}>
            {filtered ? 'Reset filters' : 'Reset search'}
          </Button>
        }
      />
    )
  }
  return (
    <EmptyState
      variant="empty"
      title={`No ${noun} yet`}
      description={`${noun.charAt(0).toUpperCase()}${noun.slice(1)} will appear here once they're created.`}
    />
  )
}
