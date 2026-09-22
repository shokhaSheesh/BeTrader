import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { CARDS_TABLE, useInvestorCardQuery } from '@/entities/investor-card'
import { DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { investorLabel } from '@/shared/lib/format'
import {
  Button,
  ButtonLink,
  CodeCell,
  Dash,
  DateCell,
  DateTimeCell,
  DetailSection,
  PageHeader,
  RecordBoundary,
  TextCell,
} from '@/shared/ui'

export default function CardDetailPage() {
  const { id } = useParams()
  const query = useInvestorCardQuery(id)
  const fields = useTableFields(CARDS_TABLE)
  const [deleting, setDeleting] = useState(false)
  const back = { to: RECORDS.cards.list, label: 'Cards' }

  return (
    <RecordBoundary query={query} noun="card" back={back} alsoPending={fields.isPending}>
      {(c) => {
        const L = fields.fieldLabel
        return (
          <>
            <PageHeader
              back={back}
              title={<span className="num">{c.maskedPan ?? 'Card'}</span>}
              description={[c.type, c.cardName].filter(Boolean).join(' · ') || undefined}
              actions={
                <>
                  <Button variant="danger-ghost" icon={Trash2} onClick={() => setDeleting(true)}>
                    Delete
                  </Button>
                  <ButtonLink to={RECORDS.cards.edit(c.id)} icon={Pencil}>
                    Edit card
                  </ButtonLink>
                </>
              }
            />
            <div className="flex flex-col gap-6">
              <DetailSection
                title="Card"
                items={[
                  { label: L('masked_pan'), value: <CodeCell value={c.maskedPan} /> },
                  { label: L('card_name'), value: <TextCell value={c.cardName} /> },
                  { label: L('type'), value: <TextCell value={c.type} /> },
                  { label: L('expiry_date'), value: <DateCell value={c.expiryDate} /> },
                ]}
              />
              <DetailSection
                title="Owner"
                items={[
                  {
                    label: L('investors_id'),
                    value: c.investorId ? (
                      <Link
                        to={RECORDS.investors.detail(c.investorId)}
                        className="font-medium underline-offset-4 hover:underline"
                      >
                        {investorLabel(c.investorName, c.investorPhone)}
                      </Link>
                    ) : (
                      <Dash />
                    ),
                  },
                ]}
              />
              <DetailSection
                title="Record"
                items={[
                  { label: L('created_time'), value: <DateTimeCell value={c.createdTime} /> },
                  { label: 'Last updated', value: <DateTimeCell value={c.updatedAt} /> },
                  { label: L('guid'), value: <CodeCell value={c.id} /> },
                ]}
              />
            </div>
            <DeleteRecordDialog
              noun="card"
              target={deleting ? { name: c.maskedPan ?? 'This card' } : null}
              onClose={() => setDeleting(false)}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
