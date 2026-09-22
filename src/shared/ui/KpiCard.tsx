import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { formatNumber } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import { TONE_CLASSES, type Tone } from '@/shared/lib/tones'
import { Badge } from './Badge'
import { Loader } from './Loader'
import { Tooltip } from './Tooltip'

interface KpiCardProps {
  /** What is counted, e.g. "Identified" */
  label: string
  icon: LucideIcon
  /** Color of the icon circle: the meaning of the number (DESIGN.md §5 "Color in data"). Defaults to neutral. */
  tone?: Tone
  /** A number from the backend; `undefined` while loading */
  value?: number
  /** Show this instead of the plain count, e.g. formatted money */
  display?: string
  /** Full value shown on hover when `display` is shortened (e.g. "15.2M UZS") */
  exact?: string
  /** Small note under the value, e.g. a "Mock data" badge */
  footnote?: ReactNode
  /** The backend can't provide this yet: a placeholder and a "Backend pending" badge, never a front-end calculation */
  pending?: boolean
}

/** Label on top, count below, icon in a tinted circle on the right. */
export function KpiCard({
  label,
  icon: Icon,
  tone = 'neutral',
  value,
  display,
  exact,
  footnote,
  pending,
}: KpiCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-line bg-surface px-5 py-4">
      <div className="flex min-w-0 flex-col items-start gap-1">
        <span className="truncate text-fg-muted">{label}</span>
        {pending ? (
          <span className="flex items-center gap-2">
            <span className="text-2xl font-semibold tracking-tight text-fg-subtle">—</span>
            <Badge tone="warning">Backend pending</Badge>
          </span>
        ) : display !== undefined ? (
          exact ? (
            <Tooltip content={<span className="num">{exact}</span>} side="top">
              <span tabIndex={0} className="text-2xl leading-10 font-semibold tracking-tight">
                {display}
              </span>
            </Tooltip>
          ) : (
            <span className="text-2xl leading-10 font-semibold tracking-tight">{display}</span>
          )
        ) : value === undefined ? (
          <span className="flex h-10 items-center">
            <Loader size={28} label={`Loading ${label}`} />
          </span>
        ) : (
          <span className="text-2xl leading-10 font-semibold tracking-tight">
            {formatNumber(value)}
          </span>
        )}
        {footnote}
      </div>
      <span
        className={cn(
          'grid size-14 shrink-0 place-items-center rounded-full',
          TONE_CLASSES[tone].tint,
          tone === 'neutral' ? 'text-fg' : TONE_CLASSES[tone].text,
        )}
      >
        <Icon size={24} strokeWidth={1.75} />
      </span>
    </div>
  )
}

export function KpiGrid({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">{children}</div>
  )
}
