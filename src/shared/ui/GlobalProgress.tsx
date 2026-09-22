import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { useMinimumLoading } from '@/shared/hooks/useMinimumLoading'

/** Thin bar pinned to the top of the window whenever any request is in flight (DESIGN.md §1). */
export function GlobalProgress() {
  const busy = useIsFetching() + useIsMutating() > 0
  const visible = useMinimumLoading(busy, 400)
  if (!visible) return null
  return (
    <div
      className="fixed inset-x-0 top-0 z-[70] h-0.5 overflow-hidden"
      role="progressbar"
      aria-label="Loading"
    >
      <div className="h-full w-1/3 animate-indeterminate bg-accent" />
    </div>
  )
}
