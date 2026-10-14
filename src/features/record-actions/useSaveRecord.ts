import { useNavigate } from 'react-router'
import { backendMessage } from '@/shared/api/errors'
import { useCreateItemMutation, useUpdateItemMutation } from '@/shared/api/queries'
import { toast } from '@/shared/lib/toast'

interface RecordRoutes {
  list: string
  detail: (id: string) => string
}

interface SaveOptions {
  /** u-code table slug */
  table: string
  /** Singular, lowercase: "project type" */
  noun: string
  routes: RecordRoutes
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/**
 * Create page wiring: sends the record, says so, opens the new record (or the list when the
 * backend doesn't return its id). On failure the backend's reason is shown and the form stays.
 */
export function useCreateRecord({ table, noun, routes }: SaveOptions) {
  const navigate = useNavigate()
  const create = useCreateItemMutation(table)
  return {
    submitting: create.isPending,
    submit: (payload: Record<string, unknown>) =>
      create.mutate(payload, {
        onSuccess: (id) => {
          toast.success(`${capitalize(noun)} created`)
          navigate(id ? routes.detail(id) : routes.list, { replace: true })
        },
        onError: (error) =>
          toast.error(`Couldn't create the ${noun}`, backendMessage(error) ?? 'Please try again.'),
      }),
  }
}

/**
 * Edit page wiring: sends only the changed fields (the form passes them), or nothing when
 * nothing changed, then returns to the record.
 */
export function useUpdateRecord({ table, noun, routes }: SaveOptions, id: string | undefined) {
  const navigate = useNavigate()
  const update = useUpdateItemMutation(table)
  return {
    submitting: update.isPending,
    submit: (changes: Record<string, unknown>) => {
      if (!id) return
      if (Object.keys(changes).length === 0) {
        toast.info('Nothing to save', 'No field was changed.')
        return navigate(routes.detail(id), { replace: true })
      }
      update.mutate(
        { id, values: changes },
        {
          onSuccess: () => {
            toast.success('Changes saved')
            navigate(routes.detail(id), { replace: true })
          },
          onError: (error) =>
            toast.error(`Couldn't save the ${noun}`, backendMessage(error) ?? 'Please try again.'),
        },
      )
    },
  }
}
