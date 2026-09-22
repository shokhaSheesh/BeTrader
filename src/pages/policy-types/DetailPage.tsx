import { useParams } from 'react-router'
import { POLICY_TYPES_TABLE, usePolicyTypeQuery } from '@/entities/policy-type'
import { RECORDS } from '@/shared/config/routes'
import { TextCell } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'

export default function DetailPage() {
  const { id } = useParams()
  return (
    <RecordDetail
      table={POLICY_TYPES_TABLE}
      noun="policy type"
      query={usePolicyTypeQuery(id)}
      back={{ to: RECORDS.policyTypes.list, label: 'Policy types' }}
      title={(r) => r.labelEn ?? 'Policy type'}
      description={(r) => r.labelRu ?? undefined}
      editTo={(r) => RECORDS.policyTypes.edit(r.id)}
      deleteName={(r) => r.labelEn ?? 'This policy type'}
      sections={(r, L) => [
        {
          title: 'Labels',
          items: [
            { label: L('label_en'), value: <TextCell value={r.labelEn} /> },
            { label: L('label_ru'), value: <TextCell value={r.labelRu} /> },
            { label: L('label_uz'), value: <TextCell value={r.labelUz} /> },
          ],
        },
      ]}
    />
  )
}
