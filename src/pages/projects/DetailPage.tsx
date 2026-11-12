import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { HandCoins, Pencil, Trash2 } from 'lucide-react'
import { PROJECTS_TABLE, useProjectQuery } from '@/entities/project'
import { DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { Can } from '@/shared/permissions'
import { toneFor } from '@/shared/lib/tones'
import { formatDate, formatDateTime, formatMoney, formatNumber } from '@/shared/lib/format'
import { Badge, Button, ButtonLink, DetailSection, PageHeader, RecordBoundary } from '@/shared/ui'
import { translate, useT } from '@/shared/i18n'
import { DetailTabs, DividendsList, ProjectInvestorsList } from '@/widgets/related-records'
import { CreateDividendDialog } from '@/features/project-dividend'
import { DIVIDENDS_TABLE } from '@/entities/dividend'
import { MOCK_MODE } from '@/shared/config/mock'

const dash = <span className="text-fg-subtle">—</span>
const yesNo = (v: boolean) => translate(v ? 'Yes' : 'No')
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
  const t = useT()
  const { id } = useParams()
  const navigate = useNavigate()
  const query = useProjectQuery(id)
  const fields = useTableFields(PROJECTS_TABLE)
  const [deleting, setDeleting] = useState(false)
  const [dividendOpen, setDividendOpen] = useState(false)
  const back = { to: RECORDS.projects.list, label: t('Projects') }

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
                      {t('Delete')}
                    </Button>
                  </Can>
                  {/* u-code's "Divident" button. Demo mode only for now (features/project-dividend) */}
                  {MOCK_MODE && (
                    <Can table={DIVIDENDS_TABLE} action="create">
                      <Button
                        variant="secondary"
                        icon={HandCoins}
                        onClick={() => setDividendOpen(true)}
                      >
                        {t('Dividend')}
                      </Button>
                    </Can>
                  )}
                  <Can table={PROJECTS_TABLE} action="update">
                    <ButtonLink to={RECORDS.projects.edit(p.id)} icon={Pencil}>
                      {t('Edit project')}
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
                          { label: L('name_en'), value: p.name || dash },
                          { label: L('name_ru'), value: p.nameRu || dash },
                          { label: L('name_uz'), value: p.nameUz || dash },
                          { label: L('ticker'), value: p.ticker || dash },
                        ]}
                      />
                      <DetailSection
                        title={t('Investment terms')}
                        items={[
                          { label: L('project_types_id'), value: p.typeName ?? dash },
                          { label: L('currency'), value: badges(p.currencies, status('currency')) },
                          {
                            label: L('minimal_amount'),
                            value:
                              p.minimalAmount != null ? (
                                <span className="num">
                                  {formatMoney(p.minimalAmount, p.currency)}
                                </span>
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
                            value: p.endTime ? (
                              <span className="num">{formatDate(p.endTime)}</span>
                            ) : (
                              dash
                            ),
                          },
                        ]}
                      />
                      <DetailSection
                        title={t('Status and insurance')}
                        items={[
                          {
                            label: L('status'),
                            value: badges(p.statuses, status('status'), 'status'),
                          },
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
                        title={t('Record')}
                        items={[
                          {
                            label: L('created_time'),
                            value: (
                              <span className="num">
                                {formatDateTime(p.createdTime ?? p.createdAt)}
                              </span>
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
                            label: t('Last updated'),
                            value: <span className="num">{formatDateTime(p.updatedAt)}</span>,
                          },
                          {
                            label: L('guid'),
                            value: <span className="num text-fg-muted">{p.id}</span>,
                          },
                        ]}
                      />
                    </div>
                  ),
                },
                {
                  value: 'investors',
                  label: t('Project investors'),
                  content: <ProjectInvestorsList filters={{ projects_id: p.id }} />,
                },
                {
                  value: 'dividends',
                  label: t('Dividends'),
                  content: <DividendsList filters={{ projects_id: p.id }} />,
                },
              ]}
            />
            <CreateDividendDialog
              open={dividendOpen}
              onOpenChange={setDividendOpen}
              project={{ id: p.id, name: p.name }}
            />
            <DeleteRecordDialog
              noun="project"
              table={PROJECTS_TABLE}
              target={deleting ? p : null}
              onClose={() => setDeleting(false)}
              onDeleted={() => navigate(RECORDS.projects.list, { replace: true })}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
