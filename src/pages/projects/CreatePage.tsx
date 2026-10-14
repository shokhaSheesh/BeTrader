import { useNavigate } from 'react-router'
import { PROJECTS_TABLE } from '@/entities/project'
import { ProjectForm } from '@/features/project-editor'
import { backendMessage } from '@/shared/api/errors'
import { useCreateItemMutation } from '@/shared/api/queries'
import { RECORDS } from '@/shared/config/routes'
import { toast } from '@/shared/lib/toast'
import { PageHeader } from '@/shared/ui'

export default function ProjectCreatePage() {
  const navigate = useNavigate()
  const create = useCreateItemMutation(PROJECTS_TABLE)

  return (
    <>
      <PageHeader back={{ to: RECORDS.projects.list, label: 'Projects' }} title="Create project" />
      <ProjectForm
        submitLabel="Create project"
        cancelTo={RECORDS.projects.list}
        submitting={create.isPending}
        onSubmit={(payload) =>
          create.mutate(payload, {
            onSuccess: (id) => {
              toast.success('Project created')
              // Open the new project when the backend says which one it is
              navigate(id ? RECORDS.projects.detail(id) : RECORDS.projects.list, { replace: true })
            },
            onError: (error) =>
              toast.error(
                "Couldn't create the project",
                backendMessage(error) ?? 'Please try again.',
              ),
          })
        }
      />
    </>
  )
}
