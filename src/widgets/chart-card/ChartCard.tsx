import { useState, type ReactNode } from 'react'
import { ChartColumn, Table2 } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Badge } from '@/shared/ui'

interface ChartCardProps {
  title: string
  description?: string
  /** Shown top-right: legends, notes */
  aside?: ReactNode
  /** The chart; omit for table-only cards */
  chart?: ReactNode
  /** Every chart has a table view with the same numbers (DESIGN.md §5 "Charts") */
  table: ReactNode
  /** Labels the card as mock data until the backend provides it */
  mock?: boolean
}

/** A titled panel holding one chart and its table view, switchable. */
export function ChartCard({ title, description, aside, chart, table, mock }: ChartCardProps) {
  const [view, setView] = useState<'chart' | 'table'>(chart ? 'chart' : 'table')
  return (
    <section className="rounded-md border border-line bg-surface">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-6 py-4">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold">
            {title}
            {mock && <Badge tone="warning">Mock data</Badge>}
          </h2>
          {description && <p className="mt-0.5 text-fg-muted">{description}</p>}
        </div>
        <div className="flex items-center gap-4">
          {aside}
          {chart && (
            <div
              className="flex rounded-full bg-surface-muted p-0.5"
              role="group"
              aria-label="View"
            >
              {(
                [
                  ['chart', ChartColumn, 'Chart'],
                  ['table', Table2, 'Table'],
                ] as const
              ).map(([v, Icon, label]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  aria-label={`${label} view`}
                  onClick={() => setView(v)}
                  className={cn(
                    'grid size-8 place-items-center rounded-full text-fg-muted transition-colors',
                    view === v && 'bg-surface text-fg',
                  )}
                >
                  <Icon size={16} strokeWidth={1.75} />
                </button>
              ))}
            </div>
          )}
        </div>
      </header>
      <div className={view === 'chart' ? 'p-6' : ''}>{view === 'chart' ? chart : table}</div>
    </section>
  )
}
