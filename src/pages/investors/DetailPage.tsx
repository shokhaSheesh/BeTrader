import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { DeleteRecordDialog } from '@/features/record-actions'
import { INVESTORS_TABLE, useInvestorQuery } from '@/entities/investor'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { Can } from '@/shared/permissions'
import { formatDateTime, formatNumber, formatPhone } from '@/shared/lib/format'
import {
  Badge,
  Button,
  ButtonLink,
  ImageCell,
  DetailSection,
  PageHeader,
  RecordBoundary,
} from '@/shared/ui'
import { useT } from '@/shared/i18n'
import {
  AccountsList,
  DetailTabs,
  ProjectInvestorsList,
  TransactionsList,
} from '@/widgets/related-records'

const dash = <span className="text-fg-subtle">—</span>
const text = (v: string | null) => v ?? dash
const numText = (v: string | null) => (v ? <span className="num">{v}</span> : dash)

export default function InvestorDetailPage() {
  const t = useT()
  const { id } = useParams()
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)
  const query = useInvestorQuery(id)
  const fields = useTableFields(INVESTORS_TABLE)
  const back = { to: RECORDS.investors.list, label: t('Investors') }

  return (
    <RecordBoundary query={query} noun="investor" back={back} alsoPending={fields.isPending}>
      {(i) => {
        const L = fields.fieldLabel
        const options = (field: string, values: string[]) =>
          values.length ? values.map((v) => fields.optionLabel(field, v)).join(', ') : dash
        return (
          <>
            <PageHeader
              back={back}
              title={
                <span className="flex items-center gap-3">
                  <ImageCell src={i.imageUrl} round size={40} />
                  {i.fullName ?? (i.phone ? formatPhone(i.phone) : t('Investor'))}
                  {i.isIdentified ? (
                    <Badge tone="success">{t('Identified')}</Badge>
                  ) : (
                    <Badge tone="warning">{t('Not identified')}</Badge>
                  )}
                </span>
              }
              description={
                i.phone ? <span className="num">{formatPhone(i.phone)}</span> : undefined
              }
              actions={
                <>
                  <Can table={INVESTORS_TABLE} action="delete">
                    <Button variant="danger-ghost" icon={Trash2} onClick={() => setDeleting(true)}>
                      {t('Delete')}
                    </Button>
                  </Can>
                  <Can table={INVESTORS_TABLE} action="update">
                    <ButtonLink to={RECORDS.investors.edit(i.id)} icon={Pencil}>
                      {t('Edit investor')}
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
                        title={t('Personal')}
                        items={[
                          { label: L('surname'), value: text(i.surname) },
                          { label: L('name'), value: text(i.name) },
                          { label: L('patronymic'), value: text(i.patronymic) },
                          { label: L('gender'), value: options('gender', i.gender) },
                          { label: L('birth_date'), value: numText(i.birthDate) },
                          { label: L('birth_place'), value: text(i.birthPlace) },
                          { label: L('citizenship'), value: text(i.citizenship) },
                        ]}
                      />
                      <DetailSection
                        title={t('Identity document')}
                        items={[
                          { label: L('passport'), value: numText(i.passport) },
                          { label: L('pinfl'), value: numText(i.pinfl) },
                          { label: L('issued_by'), value: text(i.issuedBy) },
                          { label: L('issued_date'), value: numText(i.issuedDate) },
                        ]}
                      />
                      <DetailSection
                        title={t('Contact and address')}
                        items={[
                          {
                            label: L('phone'),
                            value: i.phone ? (
                              <span className="num">{formatPhone(i.phone)}</span>
                            ) : (
                              dash
                            ),
                          },
                          { label: L('country_name'), value: text(i.country) },
                          { label: L('city'), value: text(i.city) },
                          { label: L('district'), value: text(i.district) },
                          { label: L('street'), value: text(i.street) },
                        ]}
                      />
                      <DetailSection
                        title={t('App and acquisition')}
                        items={[
                          { label: L('lang'), value: options('lang', i.languages) },
                          {
                            label: L('platform_type'),
                            value: options('platform_type', i.platforms),
                          },
                          {
                            label: L('score'),
                            value:
                              i.score != null ? (
                                <span className="num">{formatNumber(i.score)}</span>
                              ) : (
                                dash
                              ),
                          },
                          { label: L('campaign'), value: text(i.campaign) },
                          { label: L('media_source'), value: text(i.mediaSource) },
                          {
                            label: L('mode'),
                            value: i.mode ? fields.optionLabel('mode', i.mode) : dash,
                          },
                          {
                            label: L('tg_caht_id'),
                            value:
                              i.tgChatId != null ? <span className="num">{i.tgChatId}</span> : dash,
                          },
                          { label: L('client_type_id'), value: text(i.clientType) },
                          { label: L('role_id'), value: text(i.role) },
                        ]}
                      />
                      <DetailSection
                        title={t('Record')}
                        items={[
                          {
                            label: L('created_time'),
                            value: <span className="num">{formatDateTime(i.createdTime)}</span>,
                          },
                          {
                            label: t('Last updated'),
                            value: <span className="num">{formatDateTime(i.updatedAt)}</span>,
                          },
                          {
                            label: L('guid'),
                            value: <span className="num text-fg-muted">{i.id}</span>,
                          },
                        ]}
                      />
                    </div>
                  ),
                },
                {
                  value: 'accounts',
                  label: t('Accounts'),
                  content: <AccountsList filters={{ investors_id: i.id }} />,
                },
                {
                  value: 'investments',
                  label: t('Project investors'),
                  content: <ProjectInvestorsList filters={{ investors_id: i.id }} />,
                },
                {
                  value: 'transactions',
                  label: t('Transactions'),
                  content: <TransactionsList filters={{ investors_id: i.id }} />,
                },
              ]}
            />
            <DeleteRecordDialog
              noun="investor"
              table={INVESTORS_TABLE}
              target={
                deleting ? { id: i.id, name: i.fullName ?? i.phone ?? t('This investor') } : null
              }
              onClose={() => setDeleting(false)}
              onDeleted={() => navigate(RECORDS.investors.list, { replace: true })}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
