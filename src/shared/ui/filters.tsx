import { useState } from 'react'
import { DropdownMenu as D, Popover, Select as S } from 'radix-ui'
import { CalendarDays, Check, ChevronDown } from 'lucide-react'
import { toIsoDate } from '@/shared/lib/date'
import { formatDate } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import { Calendar } from './Calendar'
import { CheckboxBox } from './Checkbox'
import { Skeleton } from './Skeleton'
import type { SelectOption } from './Select'
import { filterTrigger, menuItem, popoverSurface } from './styles'

const ALL = '__all__'

function TriggerText({ label, value }: { label: string; value?: string }) {
  return (
    <span className="max-w-72 truncate">
      {label ? (
        <span className={value ? 'text-fg-muted' : undefined}>{label}</span>
      ) : (
        <Skeleton className="inline-block h-3 w-14 align-middle" />
      )}
      {value && <span className="font-medium">: {value}</span>}
    </span>
  )
}

interface FilterSelectProps {
  label: string
  value: string | null
  onChange: (value: string | null) => void
  options: SelectOption[]
}

/** One-of filter with an "All" option, e.g. "Identification: Identified". */
export function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  const current = options.find((o) => o.value === value)
  return (
    <S.Root
      value={current ? current.value : ALL}
      onValueChange={(v) => onChange(v === ALL ? null : v)}
    >
      <S.Trigger className={filterTrigger} data-active={!!current} aria-label={label}>
        <TriggerText label={label} value={current?.label} />
        <ChevronDown size={16} className="shrink-0 text-fg-muted" />
      </S.Trigger>
      <S.Portal>
        <S.Content position="popper" sideOffset={4} className={cn(popoverSurface, 'min-w-44')}>
          <S.Viewport>
            {[{ value: ALL, label: 'All' }, ...options].map((o) => (
              <S.Item key={o.value} value={o.value} className={cn(menuItem, 'justify-between')}>
                <S.ItemText>{o.label}</S.ItemText>
                <S.ItemIndicator>
                  <Check size={16} />
                </S.ItemIndicator>
              </S.Item>
            ))}
          </S.Viewport>
        </S.Content>
      </S.Portal>
    </S.Root>
  )
}

interface FilterMultiSelectProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  options: SelectOption[]
}

/** Any-of filter, e.g. "Gender: Male, Female". */
export function FilterMultiSelect({ label, value, onChange, options }: FilterMultiSelectProps) {
  const selected = options.filter((o) => value.includes(o.value))
  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  return (
    <D.Root modal={false}>
      <D.Trigger className={filterTrigger} data-active={selected.length > 0} aria-label={label}>
        <TriggerText label={label} value={selected.map((o) => o.label).join(', ') || undefined} />
        <ChevronDown size={16} className="shrink-0 text-fg-muted" />
      </D.Trigger>
      <D.Portal>
        <D.Content sideOffset={4} align="start" className={cn(popoverSurface, 'min-w-44')}>
          {options.map((o) => (
            <D.CheckboxItem
              key={o.value}
              checked={value.includes(o.value)}
              onCheckedChange={() => toggle(o.value)}
              onSelect={(e) => e.preventDefault()}
              className={menuItem}
            >
              <CheckboxBox checked={value.includes(o.value)} />
              {o.label}
            </D.CheckboxItem>
          ))}
        </D.Content>
      </D.Portal>
    </D.Root>
  )
}

interface DateRangeFilterProps {
  label: string
  from: string | null
  to: string | null
  onChange: (range: { from: string | null; to: string | null }) => void
}

function presets() {
  const now = new Date()
  const iso = (d: Date) => toIsoDate(d.getFullYear(), d.getMonth(), d.getDate())
  const daysAgo = (n: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - n)
  return [
    { label: 'Today', from: iso(now), to: iso(now) },
    { label: 'Last 7 days', from: iso(daysAgo(6)), to: iso(now) },
    { label: 'Last 30 days', from: iso(daysAgo(29)), to: iso(now) },
    { label: 'This month', from: toIsoDate(now.getFullYear(), now.getMonth(), 1), to: iso(now) },
    { label: 'This year', from: toIsoDate(now.getFullYear(), 0, 1), to: iso(now) },
  ]
}

/** Date range: pick a start day, then an end day. The backend does the filtering. */
export function DateRangeFilter({ label, from, to, onChange }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false)
  // A range being picked: start chosen, end not yet.
  const [draft, setDraft] = useState<{ from: string; to: string | null } | null>(null)
  const shown = draft ?? { from, to }
  const value =
    from && to
      ? from === to
        ? formatDate(from)
        : `${formatDate(from)} – ${formatDate(to)}`
      : undefined

  const pick = (day: string) => {
    if (!draft) return setDraft({ from: day, to: null })
    const [a, b] = day < draft.from ? [day, draft.from] : [draft.from, day]
    onChange({ from: a, to: b })
    setDraft(null)
    setOpen(false)
  }

  return (
    <Popover.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) setDraft(null)
      }}
    >
      <Popover.Trigger className={filterTrigger} data-active={!!value} aria-label={label}>
        <CalendarDays size={16} className="shrink-0 text-fg-muted" />
        <TriggerText label={label} value={value} />
        <ChevronDown size={16} className="shrink-0 text-fg-muted" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={4} align="start" className={cn(popoverSurface, 'flex p-0')}>
          <div className="flex w-36 flex-col gap-0.5 border-r border-line p-1">
            {presets().map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  onChange({ from: p.from, to: p.to })
                  setDraft(null)
                  setOpen(false)
                }}
                className={cn(
                  menuItem,
                  'w-full text-left hover:bg-surface-muted',
                  from === p.from && to === p.to && 'font-medium',
                )}
              >
                {p.label}
              </button>
            ))}
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange({ from: null, to: null })
                  setOpen(false)
                }}
                className={cn(
                  menuItem,
                  'mt-auto w-full text-left text-fg-muted hover:bg-surface-muted',
                )}
              >
                Clear dates
              </button>
            )}
          </div>
          <div>
            <Calendar range={{ from: shown.from, to: shown.to }} onChange={pick} />
            <p className="px-4 pb-3 text-xs text-fg-muted">
              {draft ? 'Now pick the end date' : 'Pick the start date'}
            </p>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
