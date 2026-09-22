import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { ACCOUNTS_TABLE, useAccountQuery } from '@/entities/account'
import { DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { formatMoney, formatPhone, investorLabel } from '@/shared/lib/format'
import {
  Button,
  ButtonLink,
  CodeCell,
  Dash,
  DateTimeCell,
  DetailSection,
  PageHeader,
  RecordBoundary,
  TextCell,
} from '@/shared/ui'

const money = (value: number | null, currency: 'UZS' | 'USD') =>
  value != null ? <span className="num">{formatMoney(value, currency)}</span> : <Dash />

export default function AccountDetailPage() {
  const { id } = useParams()
  const query = useAccountQuery(id)
  const fields = useTableFields(ACCOUNTS_TABLE)
  const [deleting, setDeleting] = useState(false)
  const back = { to: RECORDS.accounts.list, label: 'Accounts' }

  return (
    <RecordBoundary query={query} noun="account" back={back} alsoPending={fields.isPending}>
      {(a) => {
        const L = fields.fieldLabel
        const owner = investorLabel(a.investorName, a.investorPhone)
        return (
          <>
            <PageHeader
              back={back}
              title={a.investorName ?? 'Account'}
              description={
                a.investorPhone ? (
                  <span className="num">{formatPhone(a.investorPhone)}</span>
                ) : undefined
              }
              actions={
                <>
                  <Button variant="danger-ghost" icon={Trash2} onClick={() => setDeleting(true)}>
                    Delete
                  </Button>
                  <ButtonLink to={RECORDS.accounts.edit(a.id)} icon={Pencil}>
                    Edit account
                  </ButtonLink>
                </>
              }
            />
            <div className="flex flex-col gap-6">
              <DetailSection
                title="Balances"
                items={[
                  { label: L('deposit'), value: money(a.deposit, 'UZS') },
                  { label: L('invest'), value: money(a.invest, 'USD') },
                  { label: L('dividend'), value: money(a.interestIncome, 'USD') },
                  { label: L('tranzit'), value: money(a.tranzit, 'UZS') },
                ]}
              />
              <DetailSection
                title="Owner"
                items={[
                  {
                    label: L('investors_id'),
                    value: a.investorId ? (
                      <Link
                        to={RECORDS.investors.detail(a.investorId)}
                        className="font-medium underline-offset-4 hover:underline"
                      >
                        {owner}
                      </Link>
                    ) : (
                      <Dash />
                    ),
                  },
                  { label: L('full_name'), value: <TextCell value={a.fullName} /> },
                ]}
              />
              <DetailSection
                title="Record"
                items={[
                  { label: 'Created', value: <DateTimeCell value={a.createdAt} /> },
                  { label: 'Last updated', value: <DateTimeCell value={a.updatedAt} /> },
                  { label: L('guid'), value: <CodeCell value={a.id} /> },
                ]}
              />
            </div>
            <DeleteRecordDialog
              noun="account"
              target={deleting ? { name: `The account of ${owner}` } : null}
              onClose={() => setDeleting(false)}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
