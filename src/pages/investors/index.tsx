import { useState } from 'react'
import { useNavigate } from 'react-router'
import { BadgeCheck, Plus, UserPlus, Users, UserX } from 'lucide-react'
import { INVESTORS_TABLE, useInvestorsQuery, type Investor } from '@/entities/investor'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { dateRangeFilter, equalsFilter, multiFilter } from '@/shared/api/filters'
import { useTableCount } from '@/shared/api/useTableCount'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { Can } from '@/shared/permissions'
import { useListParams } from '@/shared/hooks/useListParams'
import { toIsoDate } from '@/shared/lib/date'
import { formatPhone } from '@/shared/lib/format'
import {
  Badge,
  ButtonLink,
  CodeCell,
  DataTable,
  DateTimeCell,
  ImageCell,
  NumberCell,
  OptionsCell,
  TextCell,
  DateRangeFilter,
  FilterBar,
  FilterMultiSelect,
  FilterSelect,
  KpiCard,
  KpiGrid,
  ListEmptyState,
  PageHeader,
  Pagination,
  SearchInput,
  type Column,
} from '@/shared/ui'

const FILTER_KEYS = ['identified', 'gender', 'from', 'to'] as const
const IDENTIFICATION = [
  { value: 'yes', label: 'Identified' },
  { value: 'no', label: 'Not identified' },
]

// Every field the backend sends, except secrets: `pin_code` and `fmc_token` are never shown (docs/API.md).
function buildColumns(
  label: (f: string) => string,
  optionLabel: (f: string, v: string) => string,
): Column<Investor>[] {
  const opt = (field: string) => (v: string) => optionLabel(field, v)
  return [
    {
      id: 'full_name',
      header: label('full_name'),
      skeleton: 'w-48',
      cell: (i) => (
        <span className="flex items-center gap-3">
          <ImageCell src={i.imageUrl} round size={32} />
          <span className="font-medium">
            <TextCell value={i.fullName} />
          </span>
        </span>
      ),
    },
    { id: 'surname', header: label('surname'), cell: (i) => <TextCell value={i.surname} /> },
    { id: 'name', header: label('name'), cell: (i) => <TextCell value={i.name} /> },
    {
      id: 'patronymic',
      header: label('patronymic'),
      cell: (i) => <TextCell value={i.patronymic} />,
    },
    {
      id: 'phone',
      header: label('phone'),
      skeleton: 'w-32',
      cell: (i) => <CodeCell value={i.phone && formatPhone(i.phone)} />,
    },
    { id: 'passport', header: label('passport'), cell: (i) => <CodeCell value={i.passport} /> },
    {
      id: 'pinfl',
      header: label('pinfl'),
      skeleton: 'w-32',
      cell: (i) => <CodeCell value={i.pinfl} />,
    },
    { id: 'issued_by', header: label('issued_by'), cell: (i) => <TextCell value={i.issuedBy} /> },
    {
      id: 'issued_date',
      header: label('issued_date'),
      cell: (i) => <CodeCell value={i.issuedDate} />,
    },
    {
      id: 'birth_date',
      header: label('birth_date'),
      cell: (i) => <CodeCell value={i.birthDate} />,
    },
    {
      id: 'birth_place',
      header: label('birth_place'),
      cell: (i) => <TextCell value={i.birthPlace} />,
    },
    {
      id: 'gender',
      header: label('gender'),
      skeleton: 'w-14',
      cell: (i) => <OptionsCell values={i.gender} label={opt('gender')} />,
    },
    {
      id: 'citizenship',
      header: label('citizenship'),
      cell: (i) => <TextCell value={i.citizenship} />,
    },
    {
      id: 'country_name',
      header: label('country_name'),
      cell: (i) => <TextCell value={i.country} />,
    },
    { id: 'city', header: label('city'), cell: (i) => <TextCell value={i.city} /> },
    { id: 'district', header: label('district'), cell: (i) => <TextCell value={i.district} /> },
    { id: 'street', header: label('street'), cell: (i) => <TextCell value={i.street} /> },
    {
      id: 'is_identified',
      header: 'Identification',
      skeleton: 'w-24',
      cell: (i) =>
        i.isIdentified ? (
          <Badge tone="success">Identified</Badge>
        ) : (
          <Badge tone="warning">Not identified</Badge>
        ),
    },
    {
      id: 'lang',
      header: label('lang'),
      skeleton: 'w-10',
      cell: (i) => <OptionsCell values={i.languages} label={opt('lang')} />,
    },
    {
      id: 'platform_type',
      header: label('platform_type'),
      cell: (i) => <OptionsCell values={i.platforms} label={opt('platform_type')} />,
    },
    {
      id: 'mode',
      header: label('mode'),
      skeleton: 'w-10',
      cell: (i) => <TextCell value={i.mode && optionLabel('mode', i.mode)} />,
    },
    {
      id: 'score',
      header: label('score'),
      align: 'right',
      skeleton: 'w-10',
      cell: (i) => <NumberCell value={i.score} />,
    },
    { id: 'campaign', header: label('campaign'), cell: (i) => <TextCell value={i.campaign} /> },
    {
      id: 'media_source',
      header: label('media_source'),
      cell: (i) => <TextCell value={i.mediaSource} />,
    },
    { id: 'tg_caht_id', header: label('tg_caht_id'), cell: (i) => <CodeCell value={i.tgChatId} /> },
    {
      id: 'client_type_id',
      header: label('client_type_id'),
      cell: (i) => <TextCell value={i.clientType} />,
    },
    { id: 'role_id', header: label('role_id'), cell: (i) => <TextCell value={i.role} /> },
    {
      id: 'created_time',
      header: label('created_time'),
      align: 'right',
      skeleton: 'w-32',
      cell: (i) => <DateTimeCell value={i.createdTime} />,
    },
    {
      id: 'updated_at',
      header: 'Last updated',
      align: 'right',
      skeleton: 'w-32',
      cell: (i) => <DateTimeCell value={i.updatedAt} />,
    },
  ]
}

const now = new Date()
const MONTH_START = toIsoDate(now.getFullYear(), now.getMonth(), 1)

export default function InvestorsPage() {
  const list = useListParams(FILTER_KEYS)
  const fields = useTableFields(INVESTORS_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<Investor | null>(null)

  const identified = list.filter('identified')
  const filters = {
    ...equalsFilter(
      'is_identified',
      identified === 'yes' ? true : identified === 'no' ? false : null,
    ),
    ...multiFilter('gender', list.filterList('gender')),
    ...dateRangeFilter('created_time', list.filter('from'), list.filter('to')),
  }
  const query = useInvestorsQuery({
    page: list.page,
    pageSize: list.pageSize,
    search: list.search,
    filters,
    order: { created_time: -1 },
  })

  // Every KPI is a count computed by the backend (a filtered list's `count`).
  const total = useTableCount(INVESTORS_TABLE)
  const identifiedCount = useTableCount(INVESTORS_TABLE, { is_identified: true })
  const notIdentifiedCount = useTableCount(INVESTORS_TABLE, { is_identified: false })
  const newThisMonth = useTableCount(
    INVESTORS_TABLE,
    dateRangeFilter('created_time', MONTH_START, null),
  )

  return (
    <>
      <PageHeader
        title="Investors"
        description="Everyone registered in the Niyat app."
        actions={
          <Can table={INVESTORS_TABLE} action="create">
            <ButtonLink to={RECORDS.investors.create} icon={Plus}>
              Create investor
            </ButtonLink>
          </Can>
        }
      />

      <KpiGrid>
        <KpiCard label="Total investors" icon={Users} tone="accent" value={total.data} />
        <KpiCard label="Identified" icon={BadgeCheck} tone="success" value={identifiedCount.data} />
        <KpiCard
          label="Not identified"
          icon={UserX}
          tone="warning"
          value={notIdentifiedCount.data}
        />
        <KpiCard label="New this month" icon={UserPlus} tone="info" value={newThisMonth.data} />
      </KpiGrid>

      <FilterBar active={!!list.search || list.hasFilters} onReset={list.resetAll}>
        <SearchInput
          value={list.searchInput}
          onChange={list.setSearchInput}
          placeholder="Name, phone or PINFL"
        />
        <FilterSelect
          label="Identification"
          value={identified}
          onChange={(v) => list.setFilters({ identified: v })}
          options={IDENTIFICATION}
        />
        <FilterMultiSelect
          label={fields.fieldLabel('gender')}
          value={list.filterList('gender')}
          onChange={(v) => list.setFilters({ gender: v })}
          options={fields.fieldOptions('gender')}
        />
        <DateRangeFilter
          label="Registered"
          from={list.filter('from')}
          to={list.filter('to')}
          onChange={({ from, to }) => list.setFilters({ from, to })}
        />
      </FilterBar>

      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel, fields.optionLabel),
          actionsColumn<Investor>({
            table: INVESTORS_TABLE,
            onView: (i) => navigate(RECORDS.investors.detail(i.id)),
            onEdit: (i) => navigate(RECORDS.investors.edit(i.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(i) => i.id}
        onRowClick={(i) => navigate(RECORDS.investors.detail(i.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading investors"
        emptyState={
          <ListEmptyState
            noun="investors"
            isError={query.isError}
            retrying={query.isFetching}
            onRetry={() => query.refetch()}
            search={list.search}
            filtered={list.hasFilters}
            onResetSearch={list.resetAll}
          />
        }
        footer={
          query.data && (
            <Pagination
              page={list.page}
              pageSize={list.pageSize}
              total={query.data.total}
              onPageChange={list.setPage}
              onPageSizeChange={list.setPageSize}
            />
          )
        }
      />
      <DeleteRecordDialog
        noun="investor"
        target={toDelete && { name: toDelete.fullName ?? toDelete.phone ?? 'This investor' }}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
