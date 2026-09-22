import { useState, type KeyboardEvent } from 'react'
import { Popover } from 'radix-ui'
import { Check, ChevronDown, Search } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import type { SelectOption } from './Select'
import { Spinner } from './Spinner'
import { controlBase, controlSizes, popoverSurface } from './styles'

interface SearchSelectProps {
  value: string | null
  /** Label of the current value, which may not be in the current search results */
  valueLabel?: string
  onChange: (option: SelectOption) => void
  /** Results for the current search term, fetched by the caller from the backend */
  options: SelectOption[]
  search: string
  onSearchChange: (term: string) => void
  loading?: boolean
  placeholder?: string
  id?: string
  invalid?: boolean
}

/** Searchable picker for large backend tables (thousands of rows). Search is server-side. */
export function SearchSelect({
  value,
  valueLabel,
  onChange,
  options,
  search,
  onSearchChange,
  loading,
  placeholder = 'Select',
  id,
  invalid,
}: SearchSelectProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const pick = (o: SelectOption) => {
    onChange(o)
    setOpen(false)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') setActive((i) => Math.min(i + 1, options.length - 1))
    else if (e.key === 'ArrowUp') setActive((i) => Math.max(i - 1, 0))
    else if (e.key === 'Enter' && options[active]) pick(options[active])
    else return
    e.preventDefault()
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        id={id}
        aria-invalid={invalid || undefined}
        className={cn(controlBase, controlSizes.md, 'justify-between gap-2')}
      >
        {value ? (
          <span className="truncate">{valueLabel ?? value}</span>
        ) : (
          <span className="text-fg-subtle">{placeholder}</span>
        )}
        <ChevronDown size={16} className="shrink-0 text-fg-muted" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={4}
          align="start"
          className={cn(popoverSurface, 'w-(--radix-popover-trigger-width) min-w-72 p-0')}
        >
          <div className="relative border-b border-line">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-muted"
            />
            <input
              autoFocus
              value={search}
              onChange={(e) => {
                onSearchChange(e.target.value)
                setActive(0)
              }}
              onKeyDown={onKeyDown}
              placeholder="Search"
              role="combobox"
              aria-expanded="true"
              className="h-10 w-full bg-transparent pr-9 pl-9 outline-none placeholder:text-fg-subtle"
            />
            {loading && (
              <Spinner
                size={14}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-fg-muted"
              />
            )}
          </div>
          <div role="listbox" className="max-h-64 overflow-y-auto p-1">
            {options.length === 0 ? (
              <p className="px-3 py-6 text-center text-fg-muted">
                {loading ? 'Searching…' : 'Nothing found'}
              </p>
            ) : (
              options.map((o, i) => (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={o.value === value}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(o)}
                  className={cn(
                    'flex h-9 w-full items-center justify-between gap-2 rounded-xs px-2.5 text-left',
                    i === active && 'bg-surface-muted',
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  {o.value === value && <Check size={16} className="shrink-0" />}
                </button>
              ))
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
