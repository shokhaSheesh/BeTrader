import { useParams } from 'react-router'
import { FINANCIAL_MODELING_TABLE, useFinancialModelQuery } from '@/entities/financial-model'
import { RECORDS } from '@/shared/config/routes'
import { formatDate } from '@/shared/lib/format'
import { AmountCell, CodeCell, DateCell } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'

export default function DetailPage() {
  const { id } = useParams()
  const name = (r: { projectKeyName: string | null; date: string | null }) =>
    `${r.projectKeyName ?? 'Price'}${r.date ? ` · ${formatDate(r.date)}` : ''}`
  return (
    <RecordDetail
      table={FINANCIAL_MODELING_TABLE}
      noun="price"
      query={useFinancialModelQuery(id)}
      back={{ to: RECORDS.financialModeling.list, label: 'Financial modeling' }}
      title={(r) => <span className="num">{name(r)}</span>}
      editTo={(r) => RECORDS.financialModeling.edit(r.id)}
      deleteName={name}
      sections={(r, L) => [
        {
          title: 'Price',
          items: [
            { label: L('project_key_name'), value: <CodeCell value={r.projectKeyName} /> },
            { label: L('date'), value: <DateCell value={r.date} /> },
            { label: L('price'), value: <AmountCell value={r.price} /> },
          ],
        },
      ]}
    />
  )
}
