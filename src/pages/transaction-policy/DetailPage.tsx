import { useParams } from 'react-router'
import { TRANSACTION_POLICY_TABLE, useTransactionPolicyQuery } from '@/entities/transaction-policy'
import { RECORDS } from '@/shared/config/routes'
import { Dash, NumberCell, RecordLink } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'

export default function DetailPage() {
  const { id } = useParams()
  return (
    <RecordDetail
      table={TRANSACTION_POLICY_TABLE}
      noun="policy"
      query={useTransactionPolicyQuery(id)}
      back={{ to: RECORDS.transactionPolicy.list, label: 'Transaction policy' }}
      title={(r) => r.policyTypeLabel ?? 'Policy'}
      editTo={(r) => RECORDS.transactionPolicy.edit(r.id)}
      deleteName={(r) => r.policyTypeLabel ?? 'This policy'}
      sections={(r, L) => [
        {
          title: 'Policy',
          items: [
            {
              label: L('policy_Type_id'),
              value: r.policyTypeId ? (
                <RecordLink to={RECORDS.policyTypes.detail(r.policyTypeId)}>
                  {r.policyTypeLabel ?? 'Open policy type'}
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
