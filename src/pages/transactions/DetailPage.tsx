import { useParams } from 'react-router'
import { TRANSACTIONS_TABLE, useTransactionQuery } from '@/entities/transaction'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { investorLabel } from '@/shared/lib/format'
import {
  AmountCell,
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
  TextCell,
  YesNoCell,
} from '@/shared/ui'

/** Read-only: transactions are a ledger, so there's no edit or delete. */
export default function TransactionDetailPage() {
  const { id } = useParams()
  const query = useTransactionQuery(id)
  const fields = useTableFields(TRANSACTIONS_TABLE)
  const back = { to: RECORDS.transactions.list, label: 'Transactions' }

  return (
    <RecordBoundary query={query} noun="transaction" back={back} alsoPending={fields.isPending}>
      {(t) => {
        const L = fields.fieldLabel
        const opt = (f: string) => (v: string) => fields.optionLabel(f, v)
        const op = t.operation.map((v) => fields.optionLabel('operation', v)).join(', ')
        return (
          <>
            <PageHeader
              back={back}
              title={op || 'Transaction'}
              description={t.investorName ?? undefined}
            />
            <div className="flex flex-col gap-6">
              <DetailSection
                title="Transaction"
                items={[
                  { label: L('external_id'), value: <CodeCell value={t.transactionId} /> },
                  {
                    label: L('operation'),
                    value: <OptionsCell values={t.operation} label={opt('operation')} />,
                  },
                  {
                    label: L('status'),
                    value: <OptionsCell values={t.status} label={opt('status')} />,
                  },
                  { label: L('type'), value: <CodeCell value={t.direction} /> },
                  {
                    label: L('payment_type'),
                    value: <OptionsCell values={t.paymentType} label={opt('payment_type')} />,
                  },
                  {
                    label: L('currency'),
                    value: <OptionsCell values={t.currency} label={opt('currency')} />,
                  },
                  {
                    label: L('account'),
                    value: <OptionsCell values={t.account} label={opt('account')} />,
                  },
                  {
                    label: L('from_account'),
                    value: <OptionsCell values={t.fromAccount} label={opt('from_account')} />,
                  },
                  {
                    label: L('to_account'),
                    value: <OptionsCell values={t.toAccount} label={opt('to_account')} />,
                  },
                  { label: L('score'), value: <NumberCell value={t.score} /> },
                ]}
              />
              <DetailSection
                title="Amounts"
                items={[
                  {
                    label: L('amount_uzs'),
                    value: <MoneyCell value={t.amountUzs} currency="UZS" />,
                  },
                  {
                    label: L('amount_usd'),
                    value: <MoneyCell value={t.amountUsd} currency="USD" />,
                  },
                  {
                    label: L('amount_uzs_with_fee'),
                    value: <MoneyCell value={t.amountUzsWithFee} currency="UZS" />,
                  },
                  {
                    label: L('amount_usd_with_fee'),
                    value: <MoneyCell value={t.amountUsdWithFee} currency="USD" />,
                  },
                  { label: L('transaction_fee'), value: <AmountCell value={t.transactionFee} /> },
                  { label: L('insurance'), value: <AmountCell value={t.insurance} /> },
                  { label: L('is_insurance'), value: <YesNoCell value={t.isInsurance} /> },
                  { label: L('currency_rate'), value: <NumberCell value={t.currencyRate} /> },
                ]}
              />
              <DetailSection
                title="Linked records"
                items={[
                  {
                    label: L('investors_id'),
                    value: t.investorId ? (
                      <RecordLink to={RECORDS.investors.detail(t.investorId)}>
                        {investorLabel(t.investorName, t.investorPhone)}
                      </RecordLink>
                    ) : (
                      <Dash />
                    ),
                  },
                  {
                    label: L('investors_id_2'),
                    value: t.investor2Id ? (
                      <RecordLink to={RECORDS.investors.detail(t.investor2Id)}>
                        {t.investor2Name ?? 'Open investor'}
                      </RecordLink>
                    ) : (
                      <Dash />
                    ),
                  },
                  {
                    label: L('projects_id'),
                    value: t.projectId ? (
                      <RecordLink to={RECORDS.projects.detail(t.projectId)}>
                        {t.projectName ?? 'Open project'}
                      </RecordLink>
                    ) : (
                      <Dash />
                    ),
                  },
                  {
                    label: L('orders_id'),
                    value: t.orderId ? (
                      <RecordLink to={RECORDS.orders.detail(t.orderId)}>
                        {t.orderNumber ? `Order ${t.orderNumber}` : 'Open order'}
                      </RecordLink>
                    ) : (
                      <Dash />
                    ),
                  },
                  {
                    label: L('investor_cards_id'),
                    value: t.cardId ? (
                      <RecordLink to={RECORDS.cards.detail(t.cardId)}>
                        <span className="num">{t.cardPan ?? 'Open card'}</span>
                      </RecordLink>
                    ) : (
                      <Dash />
                    ),
                  },
                  {
                    label: L('account_id'),
                    value: t.accountId ? (
                      <RecordLink to={RECORDS.accounts.detail(t.accountId)}>
                        Open account
                      </RecordLink>
                    ) : (
                      <Dash />
                    ),
                  },
                ]}
              />
              <DetailSection
                title="Client snapshot"
                items={[
                  { label: L('snapshot_full_name'), value: <TextCell value={t.snapshotName} /> },
                  { label: L('snapshot_phone'), value: <CodeCell value={t.snapshotPhone} /> },
                  { label: L('snapshot_pinfl'), value: <CodeCell value={t.snapshotPinfl} /> },
                ]}
              />
              <DetailSection
                title="Record"
                items={[
                  { label: L('created_time'), value: <DateTimeCell value={t.createdTime} /> },
                  { label: L('updated_time'), value: <DateTimeCell value={t.updatedTime} /> },
                  { label: L('guid'), value: <CodeCell value={t.id} /> },
                ]}
              />
            </div>
          </>
        )
      }}
    </RecordBoundary>
  )
}
