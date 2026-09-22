import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { DeleteRecordDialog } from '@/features/record-actions'
import { INVESTORS_TABLE, useInvestorQuery } from '@/entities/investor'
import {
  PROJECT_INVESTORS_TABLE,
  useProjectInvestorsQuery,
  type ProjectInvestor,
} from '@/entities/project-investor'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { formatAmount, formatDateTime, formatNumber, formatPhone } from '@/shared/lib/format'
import {
  Badge,
  Button,
  ButtonLink,
  ImageCell,
  DataTable,
  DetailSection,
  EmptyState,
  PageHeader,
  Pagination,
  RecordBoundary,
  type Column,
} from '@/shared/ui'

const dash = <span className="text-fg-subtle">—</span>
const text = (v: string | null) => v ?? dash
const numText = (v: string | null) => (v ? <span className="num">{v}</span> : dash)

export default function InvestorDetailPage() {
  const { id } = useParams()
  const query = useInvestorQuery(id)
  const fields = useTableFields(INVESTORS_TABLE)
  const [deleting, setDeleting] = useState(false)
  const back = { to: RECORDS.investors.list, label: 'Investors' }

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
                  {i.fullName ?? (i.phone ? formatPhone(i.phone) : 'Investor')}
                  {i.isIdentified ? (
                    <Badge tone="success">Identified</Badge>
                  ) : (
                    <Badge tone="warning">Not identified</Badge>
                  )}
                </span>
              }
              description={
                i.phone ? <span className="num">{formatPhone(i.phone)}</span> : undefined
              }
              actions={
                <>
                  <Button variant="danger-ghost" icon={Trash2} onClick={() => setDeleting(true)}>
                    Delete
                  </Button>
                  <ButtonLink to={RECORDS.investors.edit(i.id)} icon={Pencil}>
                    Edit investor
                  </ButtonLink>
                </>
              }
            />
            <div className="flex flex-col gap-6">
              <DetailSection
                title="Personal"
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
                title="Identity document"
                items={[
                  { label: L('passport'), value: numText(i.passport) },
                  { label: L('pinfl'), value: numText(i.pinfl) },
                  { label: L('issued_by'), value: text(i.issuedBy) },
                  { label: L('issued_date'), value: numText(i.issuedDate) },
                ]}
              />
              <DetailSection
                title="Contact and address"
                items={[
                  {
                    label: L('phone'),
                    value: i.phone ? <span className="num">{formatPhone(i.phone)}</span> : dash,
                  },
                  { label: L('country_name'), value: text(i.country) },
                  { label: L('city'), value: text(i.city) },
                  { label: L('district'), value: text(i.district) },
                  { label: L('street'), value: text(i.street) },
                ]}
              />
              <InvestorInvestments investorId={i.id} />
              <DetailSection
                title="App and acquisition"
                items={[
                  { label: L('lang'), value: options('lang', i.languages) },
                  { label: L('platform_type'), value: options('platform_type', i.platforms) },
                  {
                    label: L('score'),
                    value:
                      i.score != null ? <span className="num">{formatNumber(i.score)}</span> : dash,
                  },
                  { label: L('campaign'), value: text(i.campaign) },
                  { label: L('media_source'), value: text(i.mediaSource) },
                  { label: L('mode'), value: i.mode ? fields.optionLabel('mode', i.mode) : dash },
                  {
                    label: L('tg_caht_id'),
                    value: i.tgChatId != null ? <span className="num">{i.tgChatId}</span> : dash,
                  },
                  { label: L('client_type_id'), value: text(i.clientType) },
                  { label: L('role_id'), value: text(i.role) },
                ]}
              />
              <DetailSection
                title="Record"
                items={[
                  {
                    label: L('created_time'),
                    value: <span className="num">{formatDateTime(i.createdTime)}</span>,
                  },
                  {
                    label: 'Last updated',
                    value: <span className="num">{formatDateTime(i.updatedAt)}</span>,
                  },
                  { label: L('guid'), value: <span className="num text-fg-muted">{i.id}</span> },
                ]}
              />
            </div>
            <DeleteRecordDialog
              noun="investor"
              target={deleting ? { name: i.fullName ?? i.phone ?? 'This investor' } : null}
              onClose={() => setDeleting(false)}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}

/** This investor's rows in `project_investors`, filtered by the backend. */
function InvestorInvestments({ investorId }: { investorId: string }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const navigate = useNavigate()
  const fields = useTableFields(PROJECT_INVESTORS_TABLE)
  const query = useProjectInvestorsQuery({
    page,
    pageSize,
    filters: { investors_id: investorId },
    order: { created_time: -1 },
  })

  const columns: Column<ProjectInvestor>[] = [
    { id: 'project', header: fields.fieldLabel('projects_id'), cell: (r) => r.projectName ?? dash },
    {
      id: 'investment',
      header: fields.fieldLabel('investment'),
      align: 'right',
      cell: (r) => (r.investment != null ? formatAmount(r.investment) : dash),
    },
    {
      id: 'dividend',
      header: fields.fieldLabel('dividend'),
      align: 'right',
      cell: (r) => (r.interestIncome != null ? formatAmount(r.interestIncome) : dash),
    },
    {
      id: 'created',
      header: fields.fieldLabel('created_time'),
      align: 'right',
      skeleton: 'w-32',
      cell: (r) => formatDateTime(r.createdTime),
    },
  ]

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-semibold">Investments</h2>
      <DataTable
        columns={columns}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.projectInvestors.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        skeletonRows={3}
        loadingLabel="Loading investments"
        emptyState={
          query.isError ? (
            <EmptyState
              variant="error"
              title="Couldn't load investments"
              description="The connection dropped or the server failed."
            />
          ) : (
            <EmptyState
              variant="empty"
              title="No investments yet"
              description="This investor hasn't invested in any project."
            />
          )
        }
        footer={
          query.data &&
          query.data.total > pageSize && (
            <Pagination
              page={page}
              pageSize={pageSize}
              total={query.data.total}
              onPageChange={setPage}
              onPageSizeChange={(s) => {
                setPageSize(s)
                setPage(1)
              }}
            />
          )
        }
      />
    </section>
  )
}
