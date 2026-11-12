import { useParams } from 'react-router'
import { TRANSACTIONS_TABLE, useTransactionQuery } from '@/entities/transaction'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { investorLabel } from '@/shared/lib/format'
import {
  AmountCell,
  CodeCell,
  Dash,
  DirectionCell,
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
import { useT } from '@/shared/i18n'

/** Read-only: transactions are a ledger, so there's no edit or delete. */
export default function TransactionDetailPage() {
  const t = useT()
  const { id } = useParams()
  const query = useTransactionQuery(id)
  const fields = useTableFields(TRANSACTIONS_TABLE)
  const back = { to: RECORDS.transactions.list, label: t('Transactions') }

  return (
    <RecordBoundary query={query} noun="transaction" back={back} alsoPending={fields.isPending}>
      {(tx) => {
        const L = fields.fieldLabel
        const opt = (f: string) => (v: string) => fields.optionLabel(f, v)
        const op = tx.operation.map((v) => fields.optionLabel('operation', v)).join(', ')
        return (
          <>
            <PageHeader
              back={back}
              title={op || t('Transaction')}
              description={tx.investorName ?? undefined}
            />
            <div className="flex flex-col gap-6">
              <DetailSection
                title={t('Transaction')}
                items={[
                  { label: L('external_id'), value: <CodeCell value={tx.transactionId} /> },
                  {
                    label: L('operation'),
                    value: (
                      <OptionsCell
                        values={tx.operation}
                        label={opt('operation')}
                        field="operation"
                      />
                    ),
                  },
                  {
                    label: L('status'),
                    value: <OptionsCell values={tx.status} label={opt('status')} field="status" />,
                  },
                  { label: L('type'), value: <DirectionCell value={tx.direction} /> },
                  {
                    label: L('payment_type'),
                    value: <OptionsCell values={tx.paymentType} label={opt('payment_type')} />,
                  },
                  {
                    label: L('currency'),
                    value: <OptionsCell values={tx.currency} label={opt('currency')} />,
                  },
                  {
                    label: L('account'),
                    value: <OptionsCell values={tx.account} label={opt('account')} />,
                  },
                  {
                    label: L('from_account'),
                    value: <OptionsCell values={tx.fromAccount} label={opt('from_account')} />,
                  },
                  {
                    label: L('to_account'),
                    value: <OptionsCell values={tx.toAccount} label={opt('to_account')} />,
                  },
                  { label: L('score'), value: <NumberCell value={tx.score} /> },
                ]}
              />
              <DetailSection
                title={t('Amounts')}
                items={[
                  {
                    label: L('amount_uzs'),
                    value: <MoneyCell value={tx.amountUzs} currency="UZS" />,
                  },
                  {
                    label: L('amount_usd'),
                    value: <MoneyCell value={tx.amountUsd} currency="USD" />,
                  },
                  {
                    label: L('amount_uzs_with_fee'),
                    value: <MoneyCell value={tx.amountUzsWithFee} currency="UZS" />,
                  },
                  {
                    label: L('amount_usd_with_fee'),
                    value: <MoneyCell value={tx.amountUsdWithFee} currency="USD" />,
                  },
                  { label: L('transaction_fee'), value: <AmountCell value={tx.transactionFee} /> },
                  { label: L('insurance'), value: <AmountCell value={tx.insurance} /> },
                  { label: L('is_insurance'), value: <YesNoCell value={tx.isInsurance} /> },
                  { label: L('currency_rate'), value: <NumberCell value={tx.currencyRate} /> },
                ]}
              />
              <DetailSection
                title={t('Linked records')}
                items={[
                  {
                    label: L('investors_id'),
                    value: tx.investorId ? (
                      <RecordLink to={RECORDS.investors.detail(tx.investorId)}>
                        {investorLabel(tx.investorName, tx.investorPhone)}
                      </RecordLink>
                    ) : (
                      <Dash />
                    ),
                  },
                  {
                    label: L('projects_id'),
                    value: tx.projectId ? (
                      <RecordLink to={RECORDS.projects.detail(tx.projectId)}>
                        {tx.projectName ?? t('Open project')}
                      </RecordLink>
                    ) : (
                      <Dash />
                    ),
                  },
                  {
                    label: L('orders_id'),
                    value: tx.orderId ? (
                      <RecordLink to={RECORDS.orders.detail(tx.orderId)}>
                        {tx.orderNumber ? t('Order {id}', { id: tx.orderNumber }) : t('Open order')}
                      </RecordLink>
                    ) : (
                      <Dash />
                    ),
                  },
                  {
                    label: L('investor_cards_id'),
                    value: tx.cardId ? (
                      <RecordLink to={RECORDS.cards.detail(tx.cardId)}>
                        <span className="num">{tx.cardPan ?? t('Open card')}</span>
                      </RecordLink>
                    ) : (
                      <Dash />
                    ),
                  },
                  {
                    label: L('account_id'),
                    value: tx.accountId ? (
                      <RecordLink to={RECORDS.accounts.detail(tx.accountId)}>
                        {t('Open account')}
                      </RecordLink>
                    ) : (
                      <Dash />
                    ),
                  },
                ]}
              />
              {(tx.snapshotName || tx.snapshotPhone || tx.snapshotPinfl) && (
                <DetailSection
                  title={t('Client snapshot')}
                  items={[
                    { label: L('snapshot_full_name'), value: <TextCell value={tx.snapshotName} /> },
                    { label: L('snapshot_phone'), value: <CodeCell value={tx.snapshotPhone} /> },
                    { label: L('snapshot_pinfl'), value: <CodeCell value={tx.snapshotPinfl} /> },
                  ]}
                />
              )}
              <DetailSection
                title={t('Record')}
                items={[
                  { label: L('created_time'), value: <DateTimeCell value={tx.createdTime} /> },
                  { label: L('updated_time'), value: <DateTimeCell value={tx.updatedTime} /> },
                  { label: L('guid'), value: <CodeCell value={tx.id} /> },
                ]}
              />
            </div>
          </>
        )
      }}
    </RecordBoundary>
  )
}
