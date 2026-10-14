import { useState } from 'react'
import { Popover } from 'radix-ui'
import { CalendarClock, X } from 'lucide-react'
import { formatDateTime } from '@/shared/lib/format'
import { toIsoDate } from '@/shared/lib/date'
import { cn } from '@/shared/lib/cn'
import { Button } from './Button'
import { Calendar } from './Calendar'
import { controlBase, controlSizes, popoverSurface } from './styles'

interface DateTimePickerProps {
  /** ISO date-time, as the backend stores DATE_TIME fields */
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  id?: string
  invalid?: boolean
}

const pad = (n: number) => String(n).padStart(2, '0')
const clamp = (text: string, max: number) => {
  const n = Number(text.replace(/\D/g, ''))
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), max) : 0
}

/**
 * Custom date + time field: our calendar, then hours and minutes (DESIGN.md §3, never
 * `<input type="datetime-local">`). The time is the viewer's local time; the value is sent in UTC.
 */
export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Pick a date and time',
  id,
  invalid,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const current = value ? new Date(value) : null
  const day = current
    ? toIsoDate(current.getFullYear(), current.getMonth(), current.getDate())
    : null
  const hours = current?.getHours() ?? 0
  const minutes = current?.getMinutes() ?? 0

  const set = (isoDay: string, h: number, m: number) => {
    const [y, mo, d] = isoDay.split('-').map(Number)
    onChange(new Date(y, mo - 1, d, h, m).toISOString())
  }

  const timeInput = (label: string, val: number, max: number, apply: (n: number) => void) => (
    <input
      aria-label={label}
      inputMode="numeric"
      maxLength={2}
      disabled={!day}
      value={pad(val)}
      onChange={(e) => apply(clamp(e.target.value, max))}
      onFocus={(e) => e.target.select()}
      className={cn(controlBase, controlSizes.md, 'num w-14 justify-center text-center')}
    />
  )

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div className="relative">
        <Popover.Trigger
          id={id}
          aria-invalid={invalid || undefined}
          className={cn(controlBase, controlSizes.md, 'gap-2 pr-10')}
        >
          <CalendarClock size={16} className="shrink-0 text-fg-muted" />
          {value ? (
            <span className="num">{formatDateTime(value)}</span>
          ) : (
            <span className="text-fg-subtle">{placeholder}</span>
          )}
        </Popover.Trigger>
        {value && (
          <button
            type="button"
            aria-label="Clear date and time"
            onClick={() => onChange(null)}
            className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-fg-muted hover:bg-surface hover:text-fg"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <Popover.Portal>
        <Popover.Content sideOffset={4} align="start" className={popoverSurface}>
          <Calendar value={day} onChange={(d) => set(d, hours, minutes)} />
          <div className="flex items-center justify-between gap-3 border-t border-line p-3">
            <div className="flex items-center gap-1.5">
              <span className="mr-1 text-fg-muted">Time</span>
              {timeInput('Hours', hours, 23, (h) => day && set(day, h, minutes))}
              <span className="text-fg-muted">:</span>
              {timeInput('Minutes', minutes, 59, (m) => day && set(day, hours, m))}
            </div>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
