import type { ReactNode } from 'react'

export interface TooltipRow {
  key: string
  color: string
  label: string
  value: string
}

/**
 * Hover readout. Values lead (strong), names follow (muted); rows are keyed with a short line
 * in the series color, never a filled box. Positioned inside the chart's relative wrapper.
 */
export function ChartTooltip({
  x,
  y,
  width,
  title,
  rows,
}: {
  x: number
  y: number
  width: number
  title: ReactNode
  rows: TooltipRow[]
}) {
  const left = Math.min(Math.max(x + 12, 0), Math.max(width - 200, 0))
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 min-w-44 rounded-sm border border-line bg-surface px-3 py-2 shadow-popover"
      style={{ left, top: Math.max(y - 8, 0) }}
    >
      <p className="num mb-1 text-xs text-fg-muted">{title}</p>
      {rows.map((r) => (
        <p key={r.key} className="flex items-center gap-2">
          <span className="h-0.5 w-3 shrink-0 rounded-full" style={{ background: r.color }} />
          <span className="num font-semibold">{r.value}</span>
          <span className="text-fg-muted">{r.label}</span>
        </p>
      ))}
    </div>
  )
}
