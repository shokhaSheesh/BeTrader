import { useNavigate, useParams } from 'react-router'
import { PROJECTS_TABLE, useProjectQuery } from '@/entities/project'
import { ProjectForm } from '@/features/project-editor'
import { backendMessage } from '@/shared/api/errors'
import { useUpdateItemMutation } from '@/shared/api/queries'
import { RECORDS } from '@/shared/config/routes'
import { toast } from '@/shared/lib/toast'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function ProjectEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const query = useProjectQuery(id)
  const update = useUpdateItemMutation(PROJECTS_TABLE)

  return (
    <RecordBoundary
      query={query}
      noun="project"
      back={{ to: RECORDS.projects.list, label: 'Projects' }}
    >
      {(p) => (
        <>
          <PageHeader
            back={{ to: RECORDS.projects.detail(p.id), label: p.name }}
            title={`Edit ${p.name}`}
          />
          <ProjectForm
            project={p}
            submitLabel="Save changes"
            cancelTo={RECORDS.projects.detail(p.id)}
            submitting={update.isPending}
            onSubmit={(values) => {
              if (Object.keys(values).length === 0) {
                toast.info('Nothing to save', 'No field was changed.')
                return navigate(RECORDS.projects.detail(p.id), { replace: true })
              }
              update.mutate(
                { id: p.id, values },
                {
                  onSuccess: () => {
                    toast.success('Changes saved')
                    navigate(RECORDS.projects.detail(p.id), { replace: true })
                  },
                  onError: (error) =>
                    toast.error(
                      "Couldn't save the project",
                      backendMessage(error) ?? 'Please try again.',
                    ),
                },
              )
            }}
          />
        </>
      )}
    </RecordBoundary>
  )
}
