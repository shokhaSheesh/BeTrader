import { CircleCheck, CircleX, Info, X } from 'lucide-react'
import { useToastStore } from '@/shared/lib/toast'
import { cn } from '@/shared/lib/cn'

const icons = { success: CircleCheck, error: CircleX, info: Info }
const iconColor = { success: 'text-success', error: 'text-danger', info: 'text-info' }

export function Toaster() {
  const { toasts, dismiss } = useToastStore()
  return (
    <div
      className="pointer-events-none fixed top-20 right-6 z-[60] flex w-96 flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const Icon = icons[t.tone]
        return (
          <div
            key={t.id}
            role={t.tone === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto flex gap-3 rounded-sm border border-line bg-surface p-4 shadow-popover"
          >
            <Icon size={20} className={cn('shrink-0', iconColor[t.tone])} />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{t.title}</p>
              {t.description && <p className="mt-0.5 text-fg-muted">{t.description}</p>}
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => dismiss(t.id)}
              className="grid size-6 shrink-0 place-items-center rounded-full text-fg-muted hover:bg-surface-muted"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
