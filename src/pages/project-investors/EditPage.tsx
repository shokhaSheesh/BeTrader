import { useParams } from 'react-router'
import { useProjectInvestorQuery } from '@/entities/project-investor'
import { ProjectInvestorForm } from '@/features/project-investor-editor'
import { notWired } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function ProjectInvestorEditPage() {
  const { id } = useParams()
  const query = useProjectInvestorQuery(id)

  return (
    <RecordBoundary
      query={query}
      noun="investment"
      back={{ to: RECORDS.projectInvestors.list, label: 'Project investors' }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.projectInvestors.detail(r.id), label: 'Investment' }}
            title="Edit investment"
          />
          <ProjectInvestorForm
            record={r}
            submitLabel="Save changes"
            cancelTo={RECORDS.projectInvestors.detail(r.id)}
            onSubmit={() => notWired('save')}
          />
        </>
      )}
    </RecordBoundary>
  )
}
