import { ConfirmDialog } from '@/shared/ui'
import { notWired } from './notWired'

interface DeleteRecordDialogProps {
  /** Record to delete; null keeps the dialog closed */
  target: { name: string } | null
  /** Singular, lowercase: "project" */
  noun: string
  onClose: () => void
}

export function DeleteRecordDialog({ target, noun, onClose }: DeleteRecordDialogProps) {
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
      onConfirm={() => {
        notWired('delete')
        onClose()
      }}
    />
  )
}
