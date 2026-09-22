import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { formatNumber } from '@/shared/lib/format'
import { Badge } from './Badge'
import { Loader } from './Loader'

interface KpiCardProps {
  /** What is counted, e.g. "Identified" */
  label: string
  /** Neutral circle on the right: never colored (DESIGN.md §3) */
  icon: LucideIcon
  /** A number from the backend; `undefined` while loading */
  value?: number
  /** The backend can't provide this yet: a placeholder and a "Backend pending" badge, never a front-end calculation */
  pending?: boolean
}

/** Label on top, count below, icon in a neutral circle on the right. */
export function KpiCard({ label, icon: Icon, value, pending }: KpiCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-line bg-surface px-5 py-4">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-fg-muted">{label}</span>
        {pending ? (
          <span className="flex items-center gap-2">
            <span className="text-2xl font-semibold tracking-tight text-fg-subtle">—</span>
            <Badge tone="warning">Backend pending</Badge>
          </span>
        ) : value === undefined ? (
          <span className="flex h-10 items-center">
            <Loader size={28} label={`Loading ${label}`} />
          </span>
        ) : (
          <span className="num text-2xl leading-10 font-semibold tracking-tight">
            {formatNumber(value)}
          </span>
        )}
      </div>
      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-surface-muted text-fg">
        <Icon size={24} strokeWidth={1.75} />
      </span>
    </div>
  )
}

export function KpiGrid({ children }: { children: ReactNode }) {
  return <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>
}
