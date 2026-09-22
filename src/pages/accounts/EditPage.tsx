import { useParams } from 'react-router'
import { useAccountQuery } from '@/entities/account'
import { AccountForm } from '@/features/account-editor'
import { notWired } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function AccountEditPage() {
  const { id } = useParams()
  const query = useAccountQuery(id)
  return (
    <RecordBoundary
      query={query}
      noun="account"
      back={{ to: RECORDS.accounts.list, label: 'Accounts' }}
    >
      {(a) => (
        <>
          <PageHeader
            back={{ to: RECORDS.accounts.detail(a.id), label: a.investorName ?? 'Account' }}
            title="Edit account"
          />
          <AccountForm
            account={a}
            submitLabel="Save changes"
            cancelTo={RECORDS.accounts.detail(a.id)}
            onSubmit={() => notWired('save')}
          />
        </>
      )}
    </RecordBoundary>
  )
}
