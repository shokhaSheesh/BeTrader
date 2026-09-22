import { useState } from 'react'
import { useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { DIVIDENDS_TABLE, useDividendQuery } from '@/entities/dividend'
import { DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { investorLabel } from '@/shared/lib/format'
import {
  AmountCell,
  Button,
  ButtonLink,
  CodeCell,
  Dash,
  DateTimeCell,
  DetailSection,
  MoneyCell,
  NumberCell,
  OptionsCell,
  PageHeader,
  PercentCell,
  RecordBoundary,
  RecordLink,
} from '@/shared/ui'

export default function DividendDetailPage() {
  const { id } = useParams()
  const query = useDividendQuery(id)
  const fields = useTableFields(DIVIDENDS_TABLE)
  const [deleting, setDeleting] = useState(false)
  const back = { to: RECORDS.dividends.list, label: 'Dividends' }

  return (
    <RecordBoundary query={query} noun="dividend" back={back} alsoPending={fields.isPending}>
      {(d) => {
        const L = fields.fieldLabel
        return (
          <>
            <PageHeader
              back={back}
              title={d.investorName ?? 'Dividend'}
              description={d.projectName ?? undefined}
              actions={
                <>
                  <Button variant="danger-ghost" icon={Trash2} onClick={() => setDeleting(true)}>
                    Delete
                  </Button>
                  <ButtonLink to={RECORDS.dividends.edit(d.id)} icon={Pencil}>
                    Edit dividend
                  </ButtonLink>
                </>
              }
            />
            <div className="flex flex-col gap-6">
              <DetailSection
                title="Dividend"
                items={[
                  {
                    label: L('type'),
                    value: (
                      <OptionsCell values={d.type} label={(v) => fields.optionLabel('type', v)} />
                    ),
                  },
                  { label: L('percent'), value: <PercentCell value={d.percent} /> },
                  { label: L('from_date'), value: <DateTimeCell value={d.fromDate} /> },
                  { label: L('to_date'), value: <DateTimeCell value={d.toDate} /> },
                  { label: L('days'), value: <NumberCell value={d.days} /> },
                  { label: L('period_days'), value: <NumberCell value={d.periodDays} /> },
                ]}
              />
              <DetailSection
                title="Amounts"
                items={[
                  { label: L('order_amount'), value: <AmountCell value={d.orderAmount} /> },
                  {
                    label: L('amount_uzs'),
                    value: <MoneyCell value={d.amountUzs} currency="UZS" />,
                  },
                  {
                    label: L('amount_usd'),
                    value: <MoneyCell value={d.amountUsd} currency="USD" />,
                  },
                ]}
              />
              <DetailSection
                title="Linked records"
                items={[
                  {
                    label: L('investors_id'),
                    value: d.investorId ? (
                      <RecordLink to={RECORDS.investors.detail(d.investorId)}>
                        {investorLabel(d.investorName, d.investorPhone)}
                      </RecordLink>
                    ) : (
                      <Dash />
                    ),
                  },
                  {
                    label: L('projects_id'),
                    value: d.projectId ? (
                      <RecordLink to={RECORDS.projects.detail(d.projectId)}>
                        {d.projectName ?? 'Open project'}
                      </RecordLink>
                    ) : (
                      <Dash />
                    ),
                  },
                ]}
              />
              <DetailSection
                title="Record"
                items={[
                  { label: 'Created', value: <DateTimeCell value={d.createdAt} /> },
                  { label: 'Last updated', value: <DateTimeCell value={d.updatedAt} /> },
                  { label: L('guid'), value: <CodeCell value={d.id} /> },
                ]}
              />
            </div>
            <DeleteRecordDialog
              noun="dividend"
              target={
                deleting ? { name: `The dividend of ${d.investorName ?? 'this investor'}` } : null
              }
              onClose={() => setDeleting(false)}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
