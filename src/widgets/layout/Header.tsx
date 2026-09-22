import { LanguageMenu } from './LanguageMenu'
import { UserMenu } from './UserMenu'

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-2 border-b border-line bg-surface px-6">
      <LanguageMenu />
      <UserMenu />
    </header>
  )
}
