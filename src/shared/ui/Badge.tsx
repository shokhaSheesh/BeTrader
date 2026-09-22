import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { TONE_CLASSES, type Tone } from '@/shared/lib/tones'

interface BadgeProps {
  tone?: Tone
  /** Optional color dot, e.g. a tariff color class like `bg-tariff-halal`. */
  dotClassName?: string
  children: ReactNode
}

export function Badge({ tone = 'neutral', dotClassName, children }: BadgeProps) {
  const { tint, text } = TONE_CLASSES[tone]
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap',
        tint,
        text,
      )}
    >
      {dotClassName && <span className={cn('size-2 rounded-full', dotClassName)} />}
      {children}
    </span>
  )
}
