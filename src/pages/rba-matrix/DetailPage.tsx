import { useParams } from 'react-router'
import { RBA_MATRIX_TABLE, useRbaRuleQuery } from '@/entities/rba-rule'
import { RECORDS } from '@/shared/config/routes'
import { formatAmount } from '@/shared/lib/format'
import { AmountCell, NumberCell } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'
import { useT } from '@/shared/i18n'

export default function DetailPage() {
  const { id } = useParams()
  const t = useT()
  const band = (r: { amountFrom: number | null; amountTo: number | null }) =>
    r.amountFrom != null && r.amountTo != null
      ? `${formatAmount(r.amountFrom)} – ${formatAmount(r.amountTo)}`
      : t('Risk band')
  return (
    <RecordDetail
      table={RBA_MATRIX_TABLE}
      noun="risk band"
      query={useRbaRuleQuery(id)}
      back={{ to: RECORDS.rbaMatrix.list, label: t('RBA matrix') }}
      title={(r) => <span className="num">{band(r)}</span>}
      description={(r) => (r.score != null ? t('Score {score}', { score: r.score }) : undefined)}
      editTo={(r) => RECORDS.rbaMatrix.edit(r.id)}
      wired
      deleteName={band}
      sections={(r, L) => [
        {
          title: t('Risk band'),

          items: [
            { label: L('amount_from'), value: <AmountCell value={r.amountFrom} /> },
            { label: L('amount_to'), value: <AmountCell value={r.amountTo} /> },
            { label: L('score'), value: <NumberCell value={r.score} /> },
          ],
        },
      ]}
    />
  )
}
