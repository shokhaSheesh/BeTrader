import { useState } from 'react'
import { ChartTooltip } from './ChartTooltip'
import { compact, monthLabel, niceTicks } from './scale'
import { useElementWidth } from './useElementWidth'

export interface ColumnDatum {
  /** ISO date */
  x: string
  y: number
}

interface ColumnChartProps {
  data: ColumnDatum[]
  /** Series name for the tooltip */
  label: string
  color?: string
  formatValue: (v: number) => string
  formatDate: (iso: string) => string
  height?: number
}

const M = { top: 12, right: 8, bottom: 28, left: 48 }

/** One series over time: columns ≤ 24px, 4px rounded tops, square at the baseline, hairline grid. */
export function ColumnChart({
  data,
  label,
  color = 'var(--color-chart-1)',
  formatValue,
  formatDate,
  height = 260,
}: ColumnChartProps) {
  const [ref, width] = useElementWidth()
  const [hover, setHover] = useState<{ i: number; px: number; py: number } | null>(null)
  const plotW = Math.max(width - M.left - M.right, 0)
  const plotH = height - M.top - M.bottom
  const { ticks, hi } = niceTicks(0, Math.max(...data.map((d) => d.y), 1))
  const band = data.length ? plotW / data.length : 0
  const barW = Math.max(Math.min(24, band - 2), 1)
  const y = (v: number) => M.top + plotH - (v / hi) * plotH
  const monthStarts = data
    .map((d, i) => ({ d, i }))
    .filter(({ d, i }) => i === 0 || d.x.slice(5, 7) !== data[i - 1].x.slice(5, 7))

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`${label}, by day`}
          onPointerLeave={() => setHover(null)}
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const px = e.clientX - rect.left
            const i = Math.floor((px - M.left) / band)
            setHover(i >= 0 && i < data.length ? { i, px, py: e.clientY - rect.top } : null)
          }}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={M.left}
                x2={width - M.right}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--color-chart-grid)"
                strokeWidth={1}
              />
              <text
                x={M.left - 8}
                y={y(t)}
                dy="0.32em"
                textAnchor="end"
                className="num fill-fg-muted text-xs"
              >
                {compact(t)}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const h = Math.max(y(0) - y(d.y), d.y > 0 ? 1 : 0)
            const x = M.left + i * band + (band - barW) / 2
            const r = Math.min(4, barW / 2, h)
            const top = y(0) - h
            // 4px rounded data-end, square at the baseline
            const path = `M${x},${y(0)} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${y(0)} Z`
            return (
              <path key={d.x} d={path} fill={color} opacity={hover && hover.i !== i ? 0.45 : 1} />
            )
          })}
          {monthStarts.map(({ d, i }) => (
            <text
              key={d.x}
              x={M.left + i * band}
              y={height - 8}
              className="num fill-fg-muted text-xs"
            >
              {monthLabel(d.x)}
            </text>
          ))}
        </svg>
      )}
      {hover && (
        <ChartTooltip
          x={hover.px}
          y={hover.py}
          width={width}
          title={formatDate(data[hover.i].x)}
          rows={[{ key: 'v', color, label, value: formatValue(data[hover.i].y) }]}
        />
      )}
    </div>
  )
}
