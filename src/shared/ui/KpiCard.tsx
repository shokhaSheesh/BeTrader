import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { formatNumber } from '@/shared/lib/format'
import { Badge } from './Badge'
import { Loader } from './Loader'

interface KpiCardProps {
  label: string
  /** What the number counts, in a neutral tile (never a colored circle, DESIGN.md §4) */
  icon: LucideIcon
  /** A number from the backend; `undefined` while loading */
  value?: number
  /** Small line under the value, e.g. "All time" */
  hint?: ReactNode
  /** The backend can't provide this yet: a placeholder and a "Backend pending" badge, never a front-end calculation */
  pending?: boolean
}

export function KpiCard({ label, icon: Icon, value, hint, pending }: KpiCardProps) {
  return (
    <div className="flex min-h-36 flex-col justify-between gap-4 rounded-md border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="pt-1.5 text-fg-muted">{label}</span>
        <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-surface-muted text-fg">
          <Icon size={18} strokeWidth={1.75} />
        </span>
      </div>
      <div>
        {pending ? (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold tracking-tight text-fg-subtle">—</span>
            <Badge tone="warning">Backend pending</Badge>
          </div>
        ) : value === undefined ? (
          <Loader size={28} label={`Loading ${label}`} />
        ) : (
          <span className="num text-2xl font-semibold tracking-tight">{formatNumber(value)}</span>
        )}
        {hint && <p className="mt-1 text-xs text-fg-muted">{hint}</p>}
      </div>
    </div>
  )
}

export function KpiGrid({ children }: { children: ReactNode }) {
  return <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>
}
