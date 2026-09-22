import type { ReactNode } from 'react'
import { Inbox, SearchX, TriangleAlert } from 'lucide-react'

type Variant = 'empty' | 'no-results' | 'error'

const icons = { empty: Inbox, 'no-results': SearchX, error: TriangleAlert }

interface EmptyStateProps {
  variant: Variant
  title: string
  description?: string
  action?: ReactNode
}

/** The only empty / no-results / error pattern in the app (DESIGN.md §3). */
export function EmptyState({ variant, title, description, action }: EmptyStateProps) {
  const Icon = icons[variant]
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <Icon
        size={32}
        strokeWidth={1.5}
        className={variant === 'error' ? 'text-danger' : 'text-fg-subtle'}
      />
      <div>
        <p className="text-base font-medium">{title}</p>
        {description && <p className="mt-1 text-fg-muted">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
