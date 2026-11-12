import { ENVIRONMENTS, TARGET_ENVIRONMENT } from '@/shared/config/environments'
import { MOCK_MODE } from '@/shared/config/mock'
import { Badge } from '@/shared/ui'
import { LanguageMenu } from './LanguageMenu'
import { UserMenu } from './UserMenu'

export function Header() {
  const isTest = TARGET_ENVIRONMENT.id === ENVIRONMENTS.test.id
  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-2 border-b border-line bg-surface px-6">
      {/* Test data looks exactly like real data: say which one this is */}
      {(MOCK_MODE || isTest) && (
        <span className="mr-auto">
          <Badge tone="warning">{MOCK_MODE ? 'Demo data' : 'Test environment'}</Badge>
        </span>
      )}
      <LanguageMenu />
      <UserMenu />
    </header>
  )
}
