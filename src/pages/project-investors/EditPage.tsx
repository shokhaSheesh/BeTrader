import { useParams } from 'react-router'
import { PROJECT_INVESTORS_TABLE, useProjectInvestorQuery } from '@/entities/project-investor'
import { ProjectInvestorForm } from '@/features/project-investor-editor'
import { useUpdateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function ProjectInvestorEditPage() {
  const t = useT()
  const { id } = useParams()
  const query = useProjectInvestorQuery(id)
  const update = useUpdateRecord(
    { table: PROJECT_INVESTORS_TABLE, noun: 'investment', routes: RECORDS.projectInvestors },
    id,
  )

  return (
    <RecordBoundary
      query={query}
      noun="investment"
      back={{ to: RECORDS.projectInvestors.list, label: t('Project investors') }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.projectInvestors.detail(r.id), label: t('Investment') }}
            title={t('Edit investment')}
          />
          <ProjectInvestorForm
            record={r}
            submitLabel={t('Save changes')}
            cancelTo={RECORDS.projectInvestors.detail(r.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
