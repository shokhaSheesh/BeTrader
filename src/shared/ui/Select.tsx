import { Select as S } from 'radix-ui'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { controlBase, controlSizes, menuItem, popoverSurface } from './styles'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string | undefined
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  size?: keyof typeof controlSizes
  id?: string
  invalid?: boolean
  disabled?: boolean
  className?: string
  'aria-label'?: string
}

/** Custom single select. Never use a native <select> (DESIGN.md §3). */
export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select',
  size = 'md',
  id,
  invalid,
  disabled,
  className,
  'aria-label': ariaLabel,
}: SelectProps) {
  return (
    // Until the current value's option has loaded, show the placeholder instead of a blank field.
    <S.Root
      value={value && options.some((o) => o.value === value) ? value : ''}
      onValueChange={onChange}
      disabled={disabled}
    >
      <S.Trigger
        id={id}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        className={cn(controlBase, controlSizes[size], 'justify-between gap-2', className)}
      >
        <span className="truncate data-[placeholder]:text-fg-subtle">
          <S.Value placeholder={placeholder} />
        </span>
        <S.Icon>
          <ChevronDown size={16} className="shrink-0 text-fg-muted" />
        </S.Icon>
      </S.Trigger>
      <S.Portal>
        <S.Content
          position="popper"
          sideOffset={4}
          className={cn(popoverSurface, 'max-h-72 min-w-(--radix-select-trigger-width)')}
        >
          <S.Viewport>
            {options.map((o) => (
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
