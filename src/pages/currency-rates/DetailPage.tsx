import { useState } from 'react'
import { useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { CURRENCY_RATES_TABLE, useCurrencyRateQuery } from '@/entities/currency-rate'
import { DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { formatDate } from '@/shared/lib/format'
import {
  AmountCell,
  Button,
  ButtonLink,
  CodeCell,
  DateCell,
  DateTimeCell,
  DetailSection,
  PageHeader,
  PercentCell,
  RecordBoundary,
} from '@/shared/ui'

export default function CurrencyRateDetailPage() {
  const { id } = useParams()
  const query = useCurrencyRateQuery(id)
  const fields = useTableFields(CURRENCY_RATES_TABLE)
  const [deleting, setDeleting] = useState(false)
  const back = { to: RECORDS.currencyRates.list, label: 'Currency rates' }

  return (
    <RecordBoundary query={query} noun="currency rate" back={back} alsoPending={fields.isPending}>
      {(r) => {
        const L = fields.fieldLabel
        const title = r.date ? `Rate for ${formatDate(r.date)}` : 'Currency rate'
        return (
          <>
            <PageHeader
              back={back}
              title={<span className="num">{title}</span>}
              actions={
                <>
                  <Button variant="danger-ghost" icon={Trash2} onClick={() => setDeleting(true)}>
                    Delete
                  </Button>
                  <ButtonLink to={RECORDS.currencyRates.edit(r.id)} icon={Pencil}>
                    Edit rate
                  </ButtonLink>
                </>
              }
            />
            <div className="flex flex-col gap-6">
              <DetailSection
                title="Rate"
                items={[
                  { label: L('date'), value: <DateCell value={r.date} /> },
                  { label: L('amount'), value: <AmountCell value={r.amount} /> },
                  { label: L('percent'), value: <PercentCell value={r.percent} /> },
                  {
                    label: L('amount_with_percent'),
                    value: <AmountCell value={r.amountWithPercent} />,
                  },
                ]}
              />
              <DetailSection
                title="Record"
                items={[
                  { label: 'Created', value: <DateTimeCell value={r.createdAt} /> },
                  { label: 'Last updated', value: <DateTimeCell value={r.updatedAt} /> },
                  { label: L('guid'), value: <CodeCell value={r.id} /> },
                ]}
              />
            </div>
            <DeleteRecordDialog
              noun="currency rate"
              target={deleting ? { name: title } : null}
              onClose={() => setDeleting(false)}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
