import { useState } from 'react'
import { useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { ORDERS_TABLE, useOrderQuery } from '@/entities/order'
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
  RecordBoundary,
  RecordLink,
  YesNoCell,
} from '@/shared/ui'

export default function OrderDetailPage() {
  const { id } = useParams()
  const query = useOrderQuery(id)
  const fields = useTableFields(ORDERS_TABLE)
  const [deleting, setDeleting] = useState(false)
  const back = { to: RECORDS.orders.list, label: 'Orders' }

  return (
    <RecordBoundary query={query} noun="order" back={back} alsoPending={fields.isPending}>
      {(o) => {
        const L = fields.fieldLabel
        const opt = (f: string) => (v: string) => fields.optionLabel(f, v)
        const title = o.orderId ? `Order ${o.orderId}` : 'Order'
        return (
          <>
            <PageHeader
              back={back}
              title={<span className="num">{title}</span>}
              description={o.investorName ?? undefined}
              actions={
                <>
                  <Button variant="danger-ghost" icon={Trash2} onClick={() => setDeleting(true)}>
                    Delete
                  </Button>
                  <ButtonLink to={RECORDS.orders.edit(o.id)} icon={Pencil}>
                    Edit order
                  </ButtonLink>
                </>
              }
            />
            <div className="flex flex-col gap-6">
              <DetailSection
                title="Order"
                items={[
                  { label: L('external_order_id'), value: <CodeCell value={o.orderId} /> },
                  { label: L('type'), value: <OptionsCell values={o.type} label={opt('type')} /> },
                  {
                    label: L('status'),
                    value: <OptionsCell values={o.status} label={opt('status')} />,
                  },
                  {
                    label: L('currency'),
                    value: <OptionsCell values={o.currency} label={opt('currency')} />,
                  },
                  {
                    label: L('from_account'),
                    value: <OptionsCell values={o.fromAccount} label={opt('from_account')} />,
                  },
                  {
                    label: L('to_account'),
                    value: <OptionsCell values={o.toAccount} label={opt('to_account')} />,
                  },
                  { label: L('transaction_id'), value: <CodeCell value={o.transactionId} /> },
                  {
                    label: L('deposit_maturity_date'),
                    value: <DateTimeCell value={o.depositMaturityDate} />,
                  },
                ]}
              />
              <DetailSection
                title="Amounts"
                items={[
                  {
                    label: L('amount_uzs'),
                    value: <MoneyCell value={o.amountUzs} currency="UZS" />,
                  },
                  {
                    label: L('amount_usd'),
                    value: <MoneyCell value={o.amountUsd} currency="USD" />,
                  },
                  {
                    label: L('amount_uzs_with_fee'),
                    value: <MoneyCell value={o.amountUzsWithFee} currency="UZS" />,
                  },
                  {
                    label: L('amount_usd_with_fee'),
                    value: <MoneyCell value={o.amountUsdWithFee} currency="USD" />,
                  },
                  { label: L('transaction_fee'), value: <AmountCell value={o.transactionFee} /> },
                  { label: L('insurance'), value: <AmountCell value={o.insurance} /> },
                  { label: L('is_insurance'), value: <YesNoCell value={o.isInsurance} /> },
                  { label: L('currency_rate'), value: <NumberCell value={o.currencyRate} /> },
                ]}
              />
              <DetailSection
                title="Linked records"
                items={[
                  {
                    label: L('investors_id'),
                    value: o.investorId ? (
                      <RecordLink to={RECORDS.investors.detail(o.investorId)}>
                        {investorLabel(o.investorName, o.investorPhone)}
                      </RecordLink>
                    ) : (
                      <Dash />
                    ),
                  },
                  {
                    label: L('projects_id'),
                    value: o.projectId ? (
                      <RecordLink to={RECORDS.projects.detail(o.projectId)}>
                        {o.projectName ?? 'Open project'}
                      </RecordLink>
                    ) : (
                      <Dash />
                    ),
                  },
                  {
                    label: L('account_id'),
                    value: o.accountId ? (
                      <RecordLink to={RECORDS.accounts.detail(o.accountId)}>
                        Open account
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
                  { label: L('created_time'), value: <DateTimeCell value={o.createdTime} /> },
                  { label: L('updated_time'), value: <DateTimeCell value={o.updatedTime} /> },
                  { label: L('guid'), value: <CodeCell value={o.id} /> },
                ]}
              />
            </div>
            <DeleteRecordDialog
              noun="order"
              target={deleting ? { name: title } : null}
              onClose={() => setDeleting(false)}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
