import { useState } from 'react'
import { useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { PROJECTS_TABLE, useProjectQuery } from '@/entities/project'
import { DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { Can } from '@/shared/permissions'
import { toneFor } from '@/shared/lib/tones'
import { formatDate, formatDateTime, formatMoney, formatNumber } from '@/shared/lib/format'
import { Badge, Button, ButtonLink, DetailSection, PageHeader, RecordBoundary } from '@/shared/ui'

const dash = <span className="text-fg-subtle">—</span>
const yesNo = (v: boolean) => (v ? 'Yes' : 'No')
const badges = (values: string[], label: (v: string) => string, field?: string) =>
  values.length ? (
    <div className="flex flex-wrap gap-1.5">
      {values.map((v) => (
        <Badge key={v} tone={field ? toneFor(field, v) : 'neutral'}>
          {label(v)}
        </Badge>
      ))}
    </div>
  ) : (
    dash
  )

export default function ProjectDetailPage() {
  const { id } = useParams()
  const query = useProjectQuery(id)
  const fields = useTableFields(PROJECTS_TABLE)
  const [deleting, setDeleting] = useState(false)
  const back = { to: RECORDS.projects.list, label: 'Projects' }

  return (
    <RecordBoundary query={query} noun="project" back={back} alsoPending={fields.isPending}>
      {(p) => {
        const L = fields.fieldLabel
        const status = (field: string) => (v: string) => fields.optionLabel(field, v)
        return (
          <>
            <PageHeader
              back={back}
              title={
                <span className="flex items-center gap-3">
                  {p.imageUrl && (
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="size-10 rounded-sm bg-surface-muted object-cover"
                    />
                  )}
                  {p.name}
                </span>
              }
              description={p.nameRu}
              actions={
                <>
                  <Can table={PROJECTS_TABLE} action="delete">
                    <Button variant="danger-ghost" icon={Trash2} onClick={() => setDeleting(true)}>
                      Delete
                    </Button>
                  </Can>
                  <Can table={PROJECTS_TABLE} action="update">
                    <ButtonLink to={RECORDS.projects.edit(p.id)} icon={Pencil}>
                      Edit project
                    </ButtonLink>
                  </Can>
                </>
              }
            />
            <div className="flex flex-col gap-6">
              <DetailSection
                title="Names"
                items={[
                  { label: L('name_en'), value: p.name || dash },
                  { label: L('name_ru'), value: p.nameRu || dash },
                  { label: L('name_uz'), value: p.nameUz || dash },
                  { label: L('ticker'), value: p.ticker || dash },
                ]}
              />
              <DetailSection
                title="Investment terms"
                items={[
                  { label: L('project_types_id'), value: p.typeName ?? dash },
                  { label: L('currency'), value: badges(p.currencies, status('currency')) },
                  {
                    label: L('minimal_amount'),
                    value:
                      p.minimalAmount != null ? (
                        <span className="num">{formatMoney(p.minimalAmount, p.currency)}</span>
                      ) : (
                        dash
                      ),
                  },
                  {
                    label: L('deposit_maturity_month'),
                    value:
                      p.maturityMonths != null ? (
                        <span className="num">{formatNumber(p.maturityMonths)}</span>
                      ) : (
                        dash
                      ),
                  },
                  {
                    label: L('dividend_period'),
                    value:
                      p.dividendAccrualPeriod != null ? (
                        <span className="num">{formatNumber(p.dividendAccrualPeriod)}</span>
                      ) : (
                        dash
                      ),
                  },
                  {
                    label: L('end_time'),
                    value: p.endTime ? <span className="num">{formatDate(p.endTime)}</span> : dash,
                  },
                ]}
              />
              <DetailSection
                title="Status and insurance"
                items={[
                  { label: L('status'), value: badges(p.statuses, status('status'), 'status') },
                  { label: L('sale'), value: yesNo(p.holdWhileSelling) },
                  { label: L('investment'), value: yesNo(p.holdOnInvestment) },
                  { label: L('insurance'), value: yesNo(p.insurance) },
                  {
                    label: L('insurance_amount'),
                    value:
                      p.insuranceAmount != null ? (
                        <span className="num">{formatMoney(p.insuranceAmount, 'USD')}</span>
                      ) : (
                        dash
                      ),
                  },
                ]}
              />
              <DetailSection
                title="Record"
                items={[
                  {
                    label: L('created_time'),
                    value: (
                      <span className="num">{formatDateTime(p.createdTime ?? p.createdAt)}</span>
                    ),
                  },
                  {
                    label: L('board_order'),
                    value:
                      p.boardOrder != null ? (
                        <span className="num">{formatNumber(p.boardOrder)}</span>
                      ) : (
                        dash
                      ),
                  },
                  {
                    label: 'Last updated',
                    value: <span className="num">{formatDateTime(p.updatedAt)}</span>,
                  },
                  { label: L('guid'), value: <span className="num text-fg-muted">{p.id}</span> },
                ]}
              />
            </div>
            <DeleteRecordDialog
              noun="project"
              target={deleting ? p : null}
              onClose={() => setDeleting(false)}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
