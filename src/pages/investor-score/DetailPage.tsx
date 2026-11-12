import { useParams } from 'react-router'
import { INVESTOR_SCORE_TABLE, useInvestorScoreQuery } from '@/entities/investor-score'
import { RECORDS } from '@/shared/config/routes'
import { investorLabel } from '@/shared/lib/format'
import { Dash, NumberCell, RecordLink } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'
import { useT } from '@/shared/i18n'

export default function DetailPage() {
  const { id } = useParams()
  const t = useT()
  return (
    <RecordDetail
      table={INVESTOR_SCORE_TABLE}
      noun="score"
      query={useInvestorScoreQuery(id)}
      back={{ to: RECORDS.investorScore.list, label: t('Investor score') }}
      title={(r) => r.investorName ?? t('Investor score')}
      editTo={(r) => RECORDS.investorScore.edit(r.id)}
      wired
      deleteName={(r) =>
        r.investorName
          ? t('The score of {name}', { name: r.investorName })
          : t('The score of this investor')
      }
      sections={(r, L) => [
        {
          title: t('Score'),

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
            { label: L('score'), value: <NumberCell value={r.score} /> },
          ],
        },
      ]}
    />
  )
}
