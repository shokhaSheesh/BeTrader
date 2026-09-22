import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

/** Visual checkbox box, used inside menus and our Checkbox control. */
export function CheckboxBox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid size-4 shrink-0 place-items-center rounded-xs border transition-colors',
        checked ? 'border-inverse bg-inverse text-on-inverse' : 'border-line-strong bg-surface',
      )}
    >
      {checked && <Check size={12} strokeWidth={3} />}
    </span>
  )
}
