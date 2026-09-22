import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ImageOff, TrendingDown, TrendingUp, User } from 'lucide-react'
import {
  formatAmount,
  formatDate,
  formatDateTime,
  formatMoney,
  formatNumber,
} from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import { toneFor } from '@/shared/lib/tones'
import { Badge } from './Badge'
import { Tooltip } from './Tooltip'

// Cell renderers shared by every table and detail page, so "—", badges and dates look the same everywhere.

/** Empty value */
export function Dash() {
  return <span className="text-fg-subtle">—</span>
}

/** Text as the backend sent it */
export function TextCell({ value }: { value: string | null | undefined }) {
  return value ? <>{value}</> : <Dash />
}

/** Codes and identifiers (passport, PINFL, ticker, IDs): tabular digits */
export function CodeCell({ value }: { value: string | number | null | undefined }) {
  return value !== null && value !== undefined && value !== '' ? (
    <span className="num">{value}</span>
  ) : (
    <Dash />
  )
}

export function NumberCell({ value }: { value: number | null | undefined }) {
  return value != null ? <span className="num">{formatNumber(value)}</span> : <Dash />
}

export function YesNoCell({ value }: { value: boolean | null | undefined }) {
  return value == null ? <Dash /> : <>{value ? 'Yes' : 'No'}</>
}

/**
 * Multiselect values with the backend's option labels.
 * Pass `field` to color the badges by `toneFor(field, value)`: statuses, operations and key types only.
 */
export function OptionsCell({
  values,
  label,
  field,
}: {
  values: string[]
  label: (value: string) => string
  field?: string
}) {
  if (!values.length) return <Dash />
  return (
    <span className="inline-flex gap-1.5">
      {values.map((v) => (
        <Badge key={v} tone={field ? toneFor(field, v) : 'neutral'}>
          {label(v)}
        </Badge>
      ))}
    </span>
  )
}

export function DateCell({ value }: { value: string | null | undefined }) {
  return value ? <span className="num">{formatDate(value)}</span> : <Dash />
}

export function DateTimeCell({ value }: { value: string | null | undefined }) {
  return value ? <span className="num">{formatDateTime(value)}</span> : <Dash />
}

/** Backend PHOTO field. Round for people, square for things. */
export function ImageCell({
  src,
  round,
  size = 36,
}: {
  src: string | null | undefined
  round?: boolean
  size?: number
}) {
  const Fallback = round ? User : ImageOff
  const shape = round ? 'rounded-full' : 'rounded-sm'
  return src ? (
    <img
      src={src}
      alt=""
      className={cn('shrink-0 bg-surface-muted object-cover', shape)}
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      className={cn('grid shrink-0 place-items-center bg-surface-muted text-fg-subtle', shape)}
      style={{ width: size, height: size }}
    >
      <Fallback size={size * 0.45} strokeWidth={1.75} />
    </span>
  )
}

/** Money whose currency the backend states (in the field label or a currency field). */
export function MoneyCell({
  value,
  currency,
}: {
  value: number | null | undefined
  currency: 'UZS' | 'USD'
}) {
  return value != null ? <span className="num">{formatMoney(value, currency)}</span> : <Dash />
}

/** An amount with no currency in the backend: shown as a plain number, never with a guessed currency. */
export function AmountCell({ value }: { value: number | null | undefined }) {
  return value != null ? <span className="num">{formatAmount(value)}</span> : <Dash />
}

export function PercentCell({ value }: { value: number | null | undefined }) {
  return value != null ? <span className="num">{formatNumber(value)}%</span> : <Dash />
}

/** A linked record (investor, project, order…) opening its own detail page. Stops row clicks. */
export function RecordLink({
  to,
  children,
}: {
  to: string | null | undefined
  children: ReactNode
}) {
  if (!to) return <>{children}</>
  return (
    <Link
      to={to}
      onClick={(e) => e.stopPropagation()}
      className="font-medium underline-offset-4 hover:underline"
    >
      {children}
    </Link>
  )
}

/** Money direction ("+" in / "-" out, sent as text by the backend) as an arrow. Out is never red (DESIGN.md §2). */
export function DirectionCell({ value }: { value: string | null | undefined }) {
  if (value !== '+' && value !== '-') return value ? <CodeCell value={value} /> : <Dash />
  const incoming = value === '+'
  const Icon = incoming ? TrendingUp : TrendingDown
  const label = incoming ? 'In (+)' : 'Out (−)'
  return (
    <Tooltip content={label} side="top">
      <span
        role="img"
        aria-label={label}
        className={cn(
          'inline-grid size-7 place-items-center rounded-full',
          incoming ? 'bg-success-tint text-success-text' : 'bg-surface-muted text-fg',
        )}
      >
        <Icon size={16} strokeWidth={2} />
      </span>
    </Tooltip>
  )
}
