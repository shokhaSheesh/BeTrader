import { Spinner } from './Spinner'

/** Shown while a page's code or first data loads, inside the content area (never full-screen). */
export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex h-full min-h-60 items-center justify-center" role="status">
      <LoadingPill label={label} />
    </div>
  )
}

export function LoadingPill({ label = 'Loading…' }: { label?: string }) {
  return (
    <span className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-surface px-4 font-medium shadow-popover">
      <Spinner size={16} />
      {label}
    </span>
  )
}
