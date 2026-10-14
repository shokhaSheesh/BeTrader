import { useEffect, useRef } from 'react'
import { Spinner } from './Spinner'

/** Infinite scroll for a dropdown list: more results exist, and how to get them. */
export interface Paging {
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
}

/**
 * The last row of a scrolling list. When it scrolls into view it asks for the next page, and
 * shows a loader while that page arrives (DESIGN.md §1). Renders nothing once all is loaded.
 */
export function LoadMoreRow({ hasMore, loadingMore, onLoadMore }: Paging) {
  const row = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = row.current
    if (!el || !hasMore || loadingMore) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onLoadMore()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, onLoadMore])

  if (!hasMore && !loadingMore) return null
  return (
    <div
      ref={row}
      role="status"
      aria-label={loadingMore ? 'Loading more' : undefined}
      className="flex h-9 items-center justify-center text-fg-muted"
    >
      {loadingMore && <Spinner size={14} />}
    </div>
  )
}
