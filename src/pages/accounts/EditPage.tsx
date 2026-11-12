import { useParams } from 'react-router'
import { ACCOUNTS_TABLE, useAccountQuery } from '@/entities/account'
import { AccountForm } from '@/features/account-editor'
import { useUpdateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function AccountEditPage() {
  const t = useT()
  const { id } = useParams()
  const query = useAccountQuery(id)
  const update = useUpdateRecord(
    { table: ACCOUNTS_TABLE, noun: 'account', routes: RECORDS.accounts },
    id,
  )

  return (
    <RecordBoundary
      query={query}
      noun="account"
      back={{ to: RECORDS.accounts.list, label: t('Accounts') }}
    >
      {(a) => (
        <>
          <PageHeader
            back={{ to: RECORDS.accounts.detail(a.id), label: a.investorName ?? t('Account') }}
            title={t('Edit account')}
          />
          <AccountForm
            account={a}
            submitLabel={t('Save changes')}
            cancelTo={RECORDS.accounts.detail(a.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
