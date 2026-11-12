import { useParams } from 'react-router'
import { usePolicyTypeLabel } from '@/entities/policy-type'
import { TRANSACTION_POLICY_TABLE, useTransactionPolicyQuery } from '@/entities/transaction-policy'
import { useUpdateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { numberToText } from '@/shared/lib/form'
import { PageHeader, RecordBoundary } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function EditPage() {
  const t = useT()
  const { id } = useParams()
  const query = useTransactionPolicyQuery(id)
  const policyTypeLabel = usePolicyTypeLabel()
  const update = useUpdateRecord(
    { table: TRANSACTION_POLICY_TABLE, noun: 'policy', routes: RECORDS.transactionPolicy },
    id,
  )
  return (
    <RecordBoundary
      query={query}
      noun="policy"
      back={{ to: RECORDS.transactionPolicy.list, label: t('Transaction policy') }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.transactionPolicy.detail(r.id), label: t('Transaction policy') }}
            title={r.policyTypeLabel ?? policyTypeLabel(r.policyTypeId) ?? t('Edit policy')}
          />
          <RecordForm
            spec={FORM_SPECS.transactionPolicy}
            defaults={{ policy_Type_id: r.policyTypeId, amount: numberToText(r.amount) }}

            submitLabel={t('Save changes')}
            cancelTo={RECORDS.transactionPolicy.detail(r.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
