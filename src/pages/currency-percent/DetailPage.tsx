import { useState } from 'react'
import { useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { CURRENCY_PERCENT_TABLE, useCurrencyPercentQuery } from '@/entities/currency-percent'
import { DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import {
  Button,
  ButtonLink,
  CodeCell,
  DateTimeCell,
  DetailSection,
  OptionsCell,
  PageHeader,
  PercentCell,
  RecordBoundary,
} from '@/shared/ui'

export default function CurrencyPercentDetailPage() {
  const { id } = useParams()
  const query = useCurrencyPercentQuery(id)
  const fields = useTableFields(CURRENCY_PERCENT_TABLE)
  const [deleting, setDeleting] = useState(false)
  const back = { to: RECORDS.currencyPercent.list, label: 'Currency percent' }

  return (
    <RecordBoundary query={query} noun="percent" back={back} alsoPending={fields.isPending}>
      {(c) => {
        const L = fields.fieldLabel
        const name = c.type.map((t) => fields.optionLabel('type', t)).join(', ') || 'Percent'
        return (
          <>
            <PageHeader
              back={back}
              title={name}
              actions={
                <>
                  <Button variant="danger-ghost" icon={Trash2} onClick={() => setDeleting(true)}>
                    Delete
                  </Button>
                  <ButtonLink to={RECORDS.currencyPercent.edit(c.id)} icon={Pencil}>
                    Edit percent
                  </ButtonLink>
                </>
              }
            />
            <div className="flex flex-col gap-6">
              <DetailSection
                title="Percent"
                items={[
                  {
                    label: L('type'),
                    value: (
                      <OptionsCell values={c.type} label={(v) => fields.optionLabel('type', v)} />
                    ),
                  },
                  { label: L('percent'), value: <PercentCell value={c.percent} /> },
                ]}
              />
              <DetailSection
                title="Record"
                items={[
                  { label: 'Created', value: <DateTimeCell value={c.createdAt} /> },
                  { label: 'Last updated', value: <DateTimeCell value={c.updatedAt} /> },
                  { label: L('guid'), value: <CodeCell value={c.id} /> },
                ]}
              />
            </div>
            <DeleteRecordDialog
              noun="percent"
              target={deleting ? { name } : null}
              onClose={() => setDeleting(false)}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
