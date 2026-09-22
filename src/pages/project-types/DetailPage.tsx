import { useState } from 'react'
import { useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { PROJECT_TYPES_TABLE, useProjectTypeQuery } from '@/entities/project-type'
import { DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { formatDateTime, formatNumber } from '@/shared/lib/format'
import { Badge, Button, ButtonLink, DetailSection, PageHeader, RecordBoundary } from '@/shared/ui'

const dash = <span className="text-fg-subtle">—</span>
const percent = (v: number | null) =>
  v != null ? <span className="num">{formatNumber(v)}%</span> : dash

export default function ProjectTypeDetailPage() {
  const { id } = useParams()
  const query = useProjectTypeQuery(id)
  const fields = useTableFields(PROJECT_TYPES_TABLE)
  const [deleting, setDeleting] = useState(false)
  const back = { to: RECORDS.projectTypes.list, label: 'Project types' }

  return (
    <RecordBoundary query={query} noun="project type" back={back} alsoPending={fields.isPending}>
      {(t) => {
        const L = fields.fieldLabel
        return (
          <>
            <PageHeader
              back={back}
              title={t.name}
              description={t.nameRu}
              actions={
                <>
                  <Button variant="danger-ghost" icon={Trash2} onClick={() => setDeleting(true)}>
                    Delete
                  </Button>
                  <ButtonLink to={RECORDS.projectTypes.edit(t.id)} icon={Pencil}>
                    Edit project type
                  </ButtonLink>
                </>
              }
            />
            <div className="flex flex-col gap-6">
              <DetailSection
                title="Names"
                items={[
                  { label: L('name_en'), value: t.name || dash },
                  { label: L('name_ru'), value: t.nameRu || dash },
                  { label: L('name_uz'), value: t.nameUz || dash },
                ]}
              />
              <DetailSection
                title="Yield and dividends"
                items={[
                  { label: L('from_percent'), value: percent(t.fromPercent) },
                  { label: L('to_percent'), value: percent(t.toPercent) },
                  {
                    label: L('calculate_dividend'),
                    value: t.dividendCalculation.length ? (
                      <div className="flex gap-1.5">
                        {t.dividendCalculation.map((v) => (
                          <Badge key={v}>{fields.optionLabel('calculate_dividend', v)}</Badge>
                        ))}
                      </div>
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
                    label: 'Created',
                    value: <span className="num">{formatDateTime(t.createdAt)}</span>,
                  },
                  {
                    label: 'Last updated',
                    value: <span className="num">{formatDateTime(t.updatedAt)}</span>,
                  },
                  { label: L('guid'), value: <span className="num text-fg-muted">{t.id}</span> },
                ]}
              />
            </div>
            <DeleteRecordDialog
              noun="project type"
              target={deleting ? t : null}
              onClose={() => setDeleting(false)}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
