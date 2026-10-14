import { backendMessage } from '@/shared/api/errors'
import { useDeleteItemMutation } from '@/shared/api/queries'
import { toast } from '@/shared/lib/toast'
import { ConfirmDialog } from '@/shared/ui'
import { notWired } from './notWired'

interface DeleteRecordDialogProps {
  /** Record to delete; null keeps the dialog closed. `id` is needed once `table` is set. */
  target: { id?: string; name: string } | null
  /** Singular, lowercase: "project" */
  noun: string
  /** u-code table the record lives in. Pages whose deletes aren't wired yet leave it out. */
  table?: string
  onClose: () => void
  /** After a successful delete, e.g. leave the record's own page */
  onDeleted?: () => void
}

export function DeleteRecordDialog({
  target,
  noun,
  table,
  onClose,
  onDeleted,
}: DeleteRecordDialogProps) {
  const remove = useDeleteItemMutation(table ?? '')

  const confirm = () => {
    if (!target) return
    if (!table || !target.id) {
      notWired('delete')
      return onClose()
    }
    remove.mutate(target.id, {
      onSuccess: () => {
        toast.success(`${capitalize(noun)} deleted`, `${target.name} is gone.`)
        onClose()
        onDeleted?.()
      },
      // The dialog stays open, so the user can retry or cancel
      onError: (error) =>
        toast.error(`Couldn't delete the ${noun}`, backendMessage(error) ?? 'Please try again.'),
    })
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
      loading={remove.isPending}
      onConfirm={confirm}
    />
  )
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
