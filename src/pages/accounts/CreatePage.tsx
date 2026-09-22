import { AccountForm } from '@/features/account-editor'
import { notWired } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function AccountCreatePage() {
  return (
    <>
      <PageHeader back={{ to: RECORDS.accounts.list, label: 'Accounts' }} title="Create account" />
      <AccountForm
        submitLabel="Create account"
        cancelTo={RECORDS.accounts.list}
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
