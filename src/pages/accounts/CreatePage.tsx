import { ACCOUNTS_TABLE } from '@/entities/account'
import { AccountForm } from '@/features/account-editor'
import { useCreateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function AccountCreatePage() {
  const t = useT()
  const create = useCreateRecord({
    table: ACCOUNTS_TABLE,
    noun: 'account',
    routes: RECORDS.accounts,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.accounts.list, label: t('Accounts') }}
        title={t('Create account')}
      />
      <AccountForm
        submitLabel={t('Create account')}
        cancelTo={RECORDS.accounts.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
