import { LogOut } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useSessionStore } from '@/shared/session/store'
import { Button } from '@/shared/ui'

export function Header() {
  const login = useSessionStore((s) => s.session?.login)
  const logout = useSessionStore((s) => s.logout)
  const queryClient = useQueryClient()

  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-2 border-b border-line bg-surface px-6">
      {login && <span className="text-fg-muted">{login}</span>}
      <Button
        variant="ghost"
        icon={LogOut}
        onClick={() => {
          logout()
          queryClient.clear()
        }}
      >
        Log out
      </Button>
    </header>
  )
}
