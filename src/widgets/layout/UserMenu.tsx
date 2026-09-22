import { DropdownMenu as D } from 'radix-ui'
import { LogOut, User } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/shared/lib/cn'
import { usePermissions } from '@/shared/permissions'
import { useSessionStore } from '@/shared/session/store'
import { menuItem, popoverSurface } from '@/shared/ui/styles'

/** Avatar button: who is signed in (login and role) and Log out. */
export function UserMenu() {
  const login = useSessionStore((s) => s.session?.login)
  const logout = useSessionStore((s) => s.logout)
  const { roleName } = usePermissions()
  const queryClient = useQueryClient()

  return (
    <D.Root modal={false}>
      <D.Trigger
        aria-label="Account"
        className="grid size-10 place-items-center rounded-full bg-surface-muted text-fg transition-colors hover:bg-line data-[state=open]:bg-inverse data-[state=open]:text-on-inverse"
      >
        <User size={18} strokeWidth={1.75} />
      </D.Trigger>
      <D.Portal>
        <D.Content align="end" sideOffset={8} className={cn(popoverSurface, 'min-w-60')}>
          <div className="flex items-center gap-3 px-2.5 py-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-tint text-on-accent-tint">
              <User size={18} strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium">{login}</p>
              {roleName && <p className="truncate text-xs text-fg-muted">{roleName}</p>}
            </div>
          </div>
          <D.Separator className="my-1 h-px bg-line" />
          <D.Item
            onSelect={() => {
              logout()
              queryClient.clear()
            }}
            className={cn(menuItem, 'text-danger-text data-[highlighted]:bg-danger-tint')}
          >
            <LogOut size={16} strokeWidth={1.75} />
            Log out
          </D.Item>
        </D.Content>
      </D.Portal>
    </D.Root>
  )
}
