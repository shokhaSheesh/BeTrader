import { DropdownMenu as D } from 'radix-ui'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { CheckboxBox } from './Checkbox'
import type { SelectOption } from './Select'
import { controlBase, controlSizes, menuItem, popoverSurface } from './styles'

interface MultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  options: SelectOption[]
  placeholder?: string
  id?: string
  invalid?: boolean
}

export function MultiSelect({
  value,
  onChange,
  options,
  placeholder = 'Select',
  id,
  invalid,
}: MultiSelectProps) {
  const selected = options.filter((o) => value.includes(o.value))
  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])

  return (
    <D.Root modal={false}>
      <D.Trigger
        id={id}
        aria-invalid={invalid || undefined}
        className={cn(controlBase, controlSizes.md, 'justify-between gap-2')}
      >
        {selected.length ? (
          <span className="flex min-w-0 gap-1.5 overflow-hidden">
            {selected.map((o) => (
              <span
                key={o.value}
                className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium whitespace-nowrap"
              >
                {o.label}
              </span>
            ))}
          </span>
        ) : (
          <span className="text-fg-subtle">{placeholder}</span>
        )}
        <ChevronDown size={16} className="shrink-0 text-fg-muted" />
      </D.Trigger>
      <D.Portal>
        <D.Content
          sideOffset={4}
          align="start"
          className={cn(popoverSurface, 'min-w-(--radix-dropdown-menu-trigger-width)')}
        >
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
