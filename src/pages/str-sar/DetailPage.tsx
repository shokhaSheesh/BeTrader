import { useParams } from 'react-router'
import { STR_SAR_TABLE, useStrReportQuery } from '@/entities/str-report'
import { RECORDS } from '@/shared/config/routes'
import { investorLabel } from '@/shared/lib/format'
import { AmountCell, Badge, CodeCell, Dash, DateTimeCell, RecordLink } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'

export default function DetailPage() {
  const { id } = useParams()
  return (
    <RecordDetail
      table={STR_SAR_TABLE}
      noun="report"
      query={useStrReportQuery(id)}
      back={{ to: RECORDS.strSar.list, label: 'STR/SAR' }}
      title={(r) => r.cause ?? 'Report'}
      description={(r) => (r.date ? <DateTimeCell value={r.date} /> : undefined)}
      editTo={(r) => RECORDS.strSar.edit(r.id)}
      deleteName={(r) => (r.cause ? `The report "${r.cause}"` : 'This report')}
      sections={(r, L) => [
        {
          title: 'Report',
          items: [
            { label: L('date'), value: <DateTimeCell value={r.date} /> },
            {
              label: L('policy_Type_id'),
              value: r.policyTypeId ? (
                <RecordLink to={RECORDS.policyTypes.detail(r.policyTypeId)}>
                  <Badge tone="warning">{r.cause ?? 'Open policy type'}</Badge>
                </RecordLink>
              ) : (
                <Dash />
              ),
            },
            {
              label: L('last_transaction_amount'),
              value: <AmountCell value={r.lastTransactionAmount} />,
            },
          ],
        },
        {
          title: 'Subject',
          items: [
            {
              label: L('investors_id'),
              value: r.investorId ? (
                <RecordLink to={RECORDS.investors.detail(r.investorId)}>
                  {investorLabel(r.investorName, r.investorPhone)}
                </RecordLink>
              ) : (
                <Dash />
              ),
            },
            {
              label: L('investors_id_2'),
              value: r.passportInvestorId ? (
                <RecordLink to={RECORDS.investors.detail(r.passportInvestorId)}>
                  <CodeCell value={r.passport ?? 'Open investor'} />
                </RecordLink>
              ) : (
                <Dash />
              ),
            },
          ],
        },
      ]}
    />
  )
}
