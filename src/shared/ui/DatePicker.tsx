import { useState } from 'react'
import { Popover } from 'radix-ui'
import { CalendarDays, X } from 'lucide-react'
import { formatDate } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import { Calendar } from './Calendar'
import { controlBase, controlSizes, popoverSurface } from './styles'

interface DatePickerProps {
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  id?: string
  invalid?: boolean
}

/** Custom date field. Never use <input type="date"> (DESIGN.md §3). */
export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  id,
  invalid,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div className="relative">
        <Popover.Trigger
          id={id}
          aria-invalid={invalid || undefined}
          className={cn(controlBase, controlSizes.md, 'gap-2 pr-10')}
        >
          <CalendarDays size={16} className="shrink-0 text-fg-muted" />
          {value ? (
            <span className="num">{formatDate(value)}</span>
          ) : (
            <span className="text-fg-subtle">{placeholder}</span>
          )}
        </Popover.Trigger>
        {value && (
          <button
            type="button"
            aria-label="Clear date"
            onClick={() => onChange(null)}
            className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-fg-muted hover:bg-surface hover:text-fg"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <Popover.Portal>
        <Popover.Content sideOffset={4} align="start" className={popoverSurface}>
          <Calendar
            value={value}
            onChange={(v) => {
              onChange(v)
              setOpen(false)
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
