import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Button, EmptyState, PageLoader } from '@/shared/ui'

interface EmbeddedDashboardProps {
  /** The published dashboard, with its filters already in the URL */
  src: string
  /** What the frame shows: used by the link and the error state */
  title: string
}

/** How long a dashboard may take to render before we call it broken. */
const TIMEOUT = 30_000

/**
 * Frames a published BI dashboard (Metabase, DataLens) inside a page.
 *
 * The frame is another product's page: it brings its own styling, filters and export,
 * and our permissions do not reach inside it. We own the loader, the failure state and
 * the period, so the page still behaves like the rest of the panel (DESIGN.md §1, §3).
 */
export function EmbeddedDashboard({ src, title }: EmbeddedDashboardProps) {
  // Remounts the frame, so "Try again" really reloads it
  const [attempt, setAttempt] = useState(0)
  const frame = `${src}-${attempt}`
  // Each frame starts loading again: tracked by frame, so a new URL resets it as it renders
  const [state, setState] = useState({ frame, status: 'loading' as 'loading' | 'ready' | 'error' })
  if (state.frame !== frame) setState({ frame, status: 'loading' })
  const status = state.frame === frame ? state.status : 'loading'
  const setStatus = (next: typeof status) => setState({ frame, status: next })

  useEffect(() => {
    if (status !== 'loading') return
    const timer = setTimeout(() => setState({ frame, status: 'error' }), TIMEOUT)
    return () => clearTimeout(timer)
  }, [status, frame])

  return (
    <div className="relative h-[calc(100vh-17rem)] min-h-125 overflow-hidden rounded-md border border-line bg-surface">
      {status === 'error' ? (
        <EmptyState
          variant="error"
          title="Couldn't load the dashboard"
          description="The dashboard didn't answer. It may be down, or the connection dropped."
          action={
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => setAttempt((n) => n + 1)}>
                Try again
              </Button>
              <Button
                variant="ghost"
                icon={ExternalLink}
                onClick={() => window.open(src, '_blank', 'noopener,noreferrer')}
              >
                Open it directly
              </Button>
            </div>
          }
        />
      ) : (
        <>
          {status === 'loading' && (
            <div className="absolute inset-0 z-[1] bg-surface">
              <PageLoader label="Loading the dashboard" />
            </div>
          )}
          <iframe
            key={`${src}-${attempt}`}
            src={src}
            title={title}
            onLoad={() => setStatus('ready')}
            onError={() => setStatus('error')}
            referrerPolicy="no-referrer"
            className="size-full border-0"
          />
        </>
      )}
    </div>
  )
}
