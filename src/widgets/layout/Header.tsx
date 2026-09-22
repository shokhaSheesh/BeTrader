import { useAuthStore } from '@/features/auth/model/store'

export function Header() {
  const logout = useAuthStore((s) => s.logout)

  return (
    <header className="flex h-16 shrink-0 items-center justify-end px-6">
      <button type="button" onClick={logout}>
        Log out
      </button>
    </header>
  )
}
