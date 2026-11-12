import { Button } from './Button'
import { EmptyState } from './EmptyState'
import { useT } from '@/shared/i18n'

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
  const t = useT()
  if (isError) {
    return (
      <EmptyState
        variant="error"
        title={t("Couldn't load {noun}", { noun })}
        description={t('Something went wrong on our side or the connection dropped.')}
        action={
          <Button variant="secondary" loading={retrying} onClick={onRetry}>
            {t('Try again')}
          </Button>
        }
      />
    )
  }
  if (search || filtered) {
    return (
      <EmptyState
        variant="no-results"
        title={filtered ? t('Nothing matches these filters') : t('Nothing matches this search')}
        description={
          filtered
            ? t('Try changing or resetting the filters.')
            : t('No {noun} found for “{search}”.', { noun, search })
        }
        action={
          <Button variant="secondary" onClick={onResetSearch}>
            {filtered ? t('Reset filters') : t('Reset search')}
          </Button>
        }
      />
    )
  }
  return (
    <EmptyState
      variant="empty"
      title={t('No {noun} yet', { noun })}
      description={t("{Noun} will appear here once they're created.", {
        Noun: `${noun.charAt(0).toUpperCase()}${noun.slice(1)}`,
      })}
    />
  )
}
