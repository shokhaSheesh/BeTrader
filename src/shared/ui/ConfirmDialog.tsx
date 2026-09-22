import type { ReactNode } from 'react'
import { Dialog } from 'radix-ui'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: ReactNode
  confirmLabel: string
  onConfirm: () => void
  danger?: boolean
  loading?: boolean
}

/** Custom confirm: never window.confirm (DESIGN.md §3). Can't be closed while the request runs. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  danger,
  loading,
}: ConfirmDialogProps) {
  const guard = (next: boolean) => {
    if (!loading) onOpenChange(next)
  }
  return (
    <Dialog.Root open={open} onOpenChange={guard}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-scrim" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-surface p-6 outline-none">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          <Dialog.Description asChild>
            <div className="mt-2 text-fg-muted">{description}</div>
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => guard(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant={danger ? 'danger' : 'dark'} onClick={onConfirm} loading={loading}>
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
