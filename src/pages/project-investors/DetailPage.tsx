import { useState } from 'react'
import { useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { PROJECT_INVESTORS_TABLE, useProjectInvestorQuery } from '@/entities/project-investor'
import { DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { formatAmount, formatDateTime, formatPhone } from '@/shared/lib/format'
import { Button, ButtonLink, DetailSection, PageHeader, RecordBoundary } from '@/shared/ui'

const dash = <span className="text-fg-subtle">—</span>

export default function ProjectInvestorDetailPage() {
  const { id } = useParams()
  const query = useProjectInvestorQuery(id)
  const fields = useTableFields(PROJECT_INVESTORS_TABLE)
  const [deleting, setDeleting] = useState(false)
  const back = { to: RECORDS.projectInvestors.list, label: 'Project investors' }

  return (
    <RecordBoundary query={query} noun="investment" back={back} alsoPending={fields.isPending}>
      {(r) => {
        const L = fields.fieldLabel
        const title = `${r.investorName ?? 'Investor'} in ${r.projectName ?? 'project'}`
        return (
          <>
            <PageHeader
              back={back}
              title={title}
              actions={
                <>
                  <Button variant="danger-ghost" icon={Trash2} onClick={() => setDeleting(true)}>
                    Delete
                  </Button>
                  <ButtonLink to={RECORDS.projectInvestors.edit(r.id)} icon={Pencil}>
                    Edit investment
                  </ButtonLink>
                </>
              }
            />
            <div className="flex flex-col gap-6">
              <DetailSection
                title="Investment"
                items={[
                  { label: L('investors_id'), value: r.investorName ?? dash },
                  {
                    label: 'Phone',
                    value: r.investorPhone ? (
                      <span className="num">{formatPhone(r.investorPhone)}</span>
                    ) : (
                      dash
                    ),
                  },
                  { label: L('projects_id'), value: r.projectName ?? dash },
                  {
                    label: L('investment'),
                    value:
                      r.investment != null ? (
                        <span className="num">{formatAmount(r.investment)}</span>
                      ) : (
                        dash
                      ),
                  },
                  {
                    label: L('dividend'),
                    value:
                      r.interestIncome != null ? (
                        <span className="num">{formatAmount(r.interestIncome)}</span>
                      ) : (
                        dash
                      ),
                  },
                ]}
              />
              <DetailSection
                title="Record"
                items={[
                  {
                    label: L('created_time'),
                    value: <span className="num">{formatDateTime(r.createdTime)}</span>,
                  },
                  {
                    label: L('updated_time'),
                    value: <span className="num">{formatDateTime(r.updatedTime)}</span>,
                  },
                  { label: L('guid'), value: <span className="num text-fg-muted">{r.id}</span> },
                ]}
              />
            </div>
            <DeleteRecordDialog
              noun="investment"
              target={deleting ? { name: title } : null}
              onClose={() => setDeleting(false)}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
