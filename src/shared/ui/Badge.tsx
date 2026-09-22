import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type Tone = 'neutral' | 'success' | 'danger' | 'warning' | 'info'

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-muted text-fg-muted',
  success: 'bg-success-tint text-success-text',
  danger: 'bg-danger-tint text-danger-text',
  warning: 'bg-warning-tint text-warning-text',
  info: 'bg-info-tint text-info-text',
}

interface BadgeProps {
  tone?: Tone
  /** Optional color dot, e.g. a tariff color class like `bg-tariff-halal`. */
  dotClassName?: string
  children: ReactNode
}

export function Badge({ tone = 'neutral', dotClassName, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap',
        tones[tone],
      )}
    >
      {dotClassName && <span className={cn('size-2 rounded-full', dotClassName)} />}
      {children}
    </span>
  )
}
