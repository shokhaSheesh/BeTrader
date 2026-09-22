import { DropdownMenu as D } from 'radix-ui'
import { MoreHorizontal, type LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { menuItem, popoverSurface } from './styles'

export interface RowAction {
  label: string
  icon: LucideIcon
  onSelect: () => void
  danger?: boolean
}

/** The ⋯ menu in a table's last column (DESIGN.md §3). */
export function RowActions({
  actions,
  label = 'Row actions',
}: {
  actions: RowAction[]
  label?: string
}) {
  return (
    <D.Root modal={false}>
      <D.Trigger
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className="grid size-8 place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg data-[state=open]:bg-surface-muted"
      >
        <MoreHorizontal size={16} />
      </D.Trigger>
      <D.Portal>
        <D.Content
          align="end"
          sideOffset={4}
          className={cn(popoverSurface, 'min-w-40')}
          onClick={(e) => e.stopPropagation()}
        >
          {actions.map(({ label, icon: Icon, onSelect, danger }) => (
            <D.Item
              key={label}
              onSelect={onSelect}
              className={cn(
                menuItem,
                danger && 'text-danger-text data-[highlighted]:bg-danger-tint',
              )}
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </D.Item>
          ))}
        </D.Content>
      </D.Portal>
    </D.Root>
  )
}
