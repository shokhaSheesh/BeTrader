import { useParams } from 'react-router'
import { usePolicyTypeLabel } from '@/entities/policy-type'
import { TRANSACTION_POLICY_TABLE, useTransactionPolicyQuery } from '@/entities/transaction-policy'
import { RECORDS } from '@/shared/config/routes'
import { Dash, NumberCell, RecordLink } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'

export default function DetailPage() {
  const { id } = useParams()
  const policyTypeLabel = usePolicyTypeLabel()
  // A single-record read doesn't join the policy type: fall back to looking its name up
  const label = (r: { policyTypeLabel: string | null; policyTypeId: string | null }) =>
    r.policyTypeLabel ?? policyTypeLabel(r.policyTypeId)
  return (
    <RecordDetail
      table={TRANSACTION_POLICY_TABLE}
      noun="policy"
      query={useTransactionPolicyQuery(id)}
      back={{ to: RECORDS.transactionPolicy.list, label: 'Transaction policy' }}
      title={(r) => label(r) ?? 'Policy'}
      editTo={(r) => RECORDS.transactionPolicy.edit(r.id)}
      wired
      deleteName={(r) => label(r) ?? 'This policy'}
      sections={(r, L) => [
        {
          title: 'Policy',
          items: [
            {
              label: L('policy_Type_id'),
              value: r.policyTypeId ? (
                <RecordLink to={RECORDS.policyTypes.detail(r.policyTypeId)}>
                  {label(r) ?? 'Open policy type'}
                </RecordLink>
              ) : (
                <Dash />
              ),
            },
            { label: L('amount'), value: <NumberCell value={r.amount} /> },
          ],
        },
      ]}
    />
  )
}
