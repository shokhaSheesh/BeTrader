import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { CURRENCY_RATES_TABLE, useCurrencyRateQuery } from '@/entities/currency-rate'
import { DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { Can } from '@/shared/permissions'
import { formatDate } from '@/shared/lib/format'
import {
  AmountCell,
  Button,
  ButtonLink,
  CodeCell,
  DateCell,
  DateTimeCell,
  DetailSection,
  PageHeader,
  PercentCell,
  RecordBoundary,
} from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function CurrencyRateDetailPage() {
  const t = useT()
  const { id } = useParams()
  const navigate = useNavigate()
  const query = useCurrencyRateQuery(id)
  const fields = useTableFields(CURRENCY_RATES_TABLE)
  const [deleting, setDeleting] = useState(false)
  const back = { to: RECORDS.currencyRates.list, label: t('Currency rates') }

  return (
    <RecordBoundary query={query} noun="currency rate" back={back} alsoPending={fields.isPending}>
      {(r) => {
        const L = fields.fieldLabel
        const title = r.date
          ? t('Rate for {date}', { date: formatDate(r.date) })
          : t('Currency rate')
        return (
          <>
            <PageHeader
              back={back}
              title={<span className="num">{title}</span>}
              actions={
                <>
                  <Can table={CURRENCY_RATES_TABLE} action="delete">
                    <Button variant="danger-ghost" icon={Trash2} onClick={() => setDeleting(true)}>
                      {t('Delete')}
                    </Button>
                  </Can>
                  <Can table={CURRENCY_RATES_TABLE} action="update">
                    <ButtonLink to={RECORDS.currencyRates.edit(r.id)} icon={Pencil}>
                      {t('Edit rate')}
                    </ButtonLink>
                  </Can>
                </>
              }
            />
            <div className="flex flex-col gap-6">
              <DetailSection
                title={t('Rate')}
                items={[
                  { label: L('date'), value: <DateCell value={r.date} /> },
                  { label: L('amount'), value: <AmountCell value={r.amount} /> },
                  { label: L('percent'), value: <PercentCell value={r.percent} /> },
                  {
                    label: L('amount_with_percent'),
                    value: <AmountCell value={r.amountWithPercent} />,
                  },
                ]}
              />
              <DetailSection
                title={t('Record')}
                items={[
                  { label: t('Created'), value: <DateTimeCell value={r.createdAt} /> },
                  { label: t('Last updated'), value: <DateTimeCell value={r.updatedAt} /> },
                  { label: L('guid'), value: <CodeCell value={r.id} /> },
                ]}
              />
            </div>
            <DeleteRecordDialog
              noun="currency rate"
              table={CURRENCY_RATES_TABLE}
              target={deleting ? { id: r.id, name: title } : null}
              onClose={() => setDeleting(false)}
              onDeleted={() => navigate(RECORDS.currencyRates.list, { replace: true })}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
