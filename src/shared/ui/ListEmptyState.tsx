import { Button } from './Button'
import { EmptyState } from './EmptyState'

interface ListEmptyStateProps {
  /** Plural, lowercase: "projects", "project types" */
  noun: string
  isError: boolean
  retrying: boolean
  onRetry: () => void
  search: string
  onResetSearch: () => void
}

/** The error → no-results → empty decision every list page uses, with identical copy. */
export function ListEmptyState({
  noun,
  isError,
  retrying,
  onRetry,
  search,
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
  if (search) {
    return (
      <EmptyState
        variant="no-results"
        title="Nothing matches this search"
        description={`No ${noun} found for “${search}”.`}
        action={
          <Button variant="secondary" onClick={onResetSearch}>
            Reset search
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
