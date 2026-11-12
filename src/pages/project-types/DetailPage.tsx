import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { PROJECT_TYPES_TABLE, useProjectTypeQuery } from '@/entities/project-type'
import { DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { Can } from '@/shared/permissions'
import { formatDateTime, formatNumber } from '@/shared/lib/format'
import { Badge, Button, ButtonLink, DetailSection, PageHeader, RecordBoundary } from '@/shared/ui'
import { useT } from '@/shared/i18n'
import { DetailTabs, ProjectsList } from '@/widgets/related-records'

const dash = <span className="text-fg-subtle">—</span>
const percent = (v: number | null) =>
  v != null ? <span className="num">{formatNumber(v)}%</span> : dash

export default function ProjectTypeDetailPage() {
  const t = useT()
  const { id } = useParams()
  const navigate = useNavigate()
  const query = useProjectTypeQuery(id)
  const fields = useTableFields(PROJECT_TYPES_TABLE)
  const [deleting, setDeleting] = useState(false)
  const back = { to: RECORDS.projectTypes.list, label: t('Project types') }

  return (
    <RecordBoundary query={query} noun="project type" back={back} alsoPending={fields.isPending}>
      {(pt) => {
        const L = fields.fieldLabel
        return (
          <>
            <PageHeader
              back={back}
              title={pt.name}
              description={pt.nameRu}
              actions={
                <>
                  <Can table={PROJECT_TYPES_TABLE} action="delete">
                    <Button variant="danger-ghost" icon={Trash2} onClick={() => setDeleting(true)}>
                      {t('Delete')}
                    </Button>
                  </Can>
                  <Can table={PROJECT_TYPES_TABLE} action="update">
                    <ButtonLink to={RECORDS.projectTypes.edit(pt.id)} icon={Pencil}>
                      {t('Edit project type')}
                    </ButtonLink>
                  </Can>
                </>
              }
            />
            <DetailTabs
              tabs={[
                {
                  value: 'details',
                  label: t('Details', { context: 'tab' }),
                  content: (
                    <div className="flex flex-col gap-6">
                      <DetailSection
                        title={t('Names')}
                        items={[
                          { label: L('name_en'), value: pt.name || dash },
                          { label: L('name_ru'), value: pt.nameRu || dash },
                          { label: L('name_uz'), value: pt.nameUz || dash },
                        ]}
                      />
                      <DetailSection
                        title={t('Yield and dividends')}
                        items={[
                          { label: L('from_percent'), value: percent(pt.fromPercent) },
                          { label: L('to_percent'), value: percent(pt.toPercent) },
                          {
                            label: L('calculate_dividend'),
                            value: pt.dividendCalculation.length ? (
                              <div className="flex gap-1.5">
                                {pt.dividendCalculation.map((v) => (
                                  <Badge key={v}>
                                    {fields.optionLabel('calculate_dividend', v)}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              dash
                            ),
                          },
                        ]}
                      />
                      <DetailSection
                        title={t('Record')}
                        items={[
                          {
                            label: t('Created'),
                            value: <span className="num">{formatDateTime(pt.createdAt)}</span>,
                          },
                          {
                            label: t('Last updated'),
                            value: <span className="num">{formatDateTime(pt.updatedAt)}</span>,
                          },
                          {
                            label: L('guid'),
                            value: <span className="num text-fg-muted">{pt.id}</span>,
                          },
                        ]}
                      />
                    </div>
                  ),
                },
                {
                  value: 'projects',
                  label: t('Projects'),
                  content: <ProjectsList filters={{ project_types_id: pt.id }} />,
                },
              ]}
            />
            <DeleteRecordDialog
              noun="project type"
              table={PROJECT_TYPES_TABLE}
              target={deleting ? pt : null}
              onClose={() => setDeleting(false)}
              onDeleted={() => navigate(RECORDS.projectTypes.list, { replace: true })}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
