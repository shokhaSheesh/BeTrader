import { Loader } from './Loader'

/** Centered brand loader for the content area: page code, a record, or a form schema loading. Never full-screen. */
export function PageLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex h-full min-h-60 items-center justify-center">
      <Loader label={label} />
    </div>
  )
}
