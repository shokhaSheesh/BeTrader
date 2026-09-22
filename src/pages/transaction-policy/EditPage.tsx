import { useParams } from 'react-router'
import { useTransactionPolicyQuery } from '@/entities/transaction-policy'
import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { numberToText } from '@/shared/lib/form'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useTransactionPolicyQuery(id)
  return (
    <RecordBoundary
      query={query}
      noun="policy"
      back={{ to: RECORDS.transactionPolicy.list, label: 'Transaction policy' }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.transactionPolicy.detail(r.id), label: 'Transaction policy' }}
            title={r.policyTypeLabel ?? 'Edit policy'}
          />
          <RecordForm
            spec={FORM_SPECS.transactionPolicy}
            defaults={{ policy_Type_id: r.policyTypeId, amount: numberToText(r.amount) }}

            submitLabel="Save changes"
            cancelTo={RECORDS.transactionPolicy.detail(r.id)}
            onSubmit={() => notWired('save')}
          />
        </>
      )}
    </RecordBoundary>
  )
}
