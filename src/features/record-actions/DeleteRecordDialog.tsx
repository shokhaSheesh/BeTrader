import { useMutation } from '@tanstack/react-query'
import { backendMessage } from '@/shared/api/errors'
import { useDeleteItemMutation } from '@/shared/api/queries'
import { toast } from '@/shared/lib/toast'
import { ConfirmDialog } from '@/shared/ui'
import { notWired } from './notWired'

interface DeleteRecordDialogProps {
  /**
   * Record to delete; null keeps the dialog closed. `id` is needed once `table` is set.
   * `data`: fields the table's backend function reads on delete (e.g. a currency percent's type).
   */
  target: { id?: string; name: string; data?: Record<string, unknown> } | null
  /** Singular, lowercase: "project" */
  noun: string
  /** u-code table the record lives in. Pages whose deletes aren't wired yet leave it out. */
  table?: string
  onClose: () => void
  /** After a successful delete, e.g. leave the record's own page */
  onDeleted?: () => void
  /** Deletes something that isn't a table record (e.g. a role, on the auth API) */
  remove?: (id: string) => Promise<unknown>
}

export function DeleteRecordDialog({
  target,
  noun,
  table,
  onClose,
  onDeleted,
  remove: removeOther,
}: DeleteRecordDialogProps) {
  const removeItem = useDeleteItemMutation(table ?? '')
  const removeCustom = useMutation({ mutationFn: (id: string) => removeOther!(id) })
  const pending = removeItem.isPending || removeCustom.isPending

  const confirm = () => {
    if (!target) return
    if ((!table && !removeOther) || !target.id) {
      notWired('delete')
      return onClose()
    }
    const handlers = {
      onSuccess: () => {
        toast.success(`${capitalize(noun)} deleted`, `${target.name} is gone.`)
        onClose()
        onDeleted?.()
      },
      // The dialog stays open, so the user can retry or cancel
      onError: (error: unknown) =>
        toast.error(`Couldn't delete the ${noun}`, backendMessage(error) ?? 'Please try again.'),
    }
    // Through the promise, not mutate()'s callbacks: refreshing the data can unmount this dialog
    // (the deleted record's page swaps to "not found"), and then those callbacks never run.
    const run = removeOther
      ? removeCustom.mutateAsync(target.id)
      : removeItem.mutateAsync({ id: target.id, data: target.data })
    run.then(handlers.onSuccess, handlers.onError)
  }

  return (
    <ConfirmDialog
      open={target !== null}
      onOpenChange={(open) => !open && onClose()}
      title={`Delete this ${noun}?`}
      description={
        <>
          <span className="font-medium text-fg">{target?.name}</span> will be permanently deleted.
          This can't be undone.
        </>
      }
      confirmLabel={`Delete ${noun}`}
      danger
      loading={pending}
      onConfirm={confirm}
    />
  )
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
