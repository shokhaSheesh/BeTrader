import { useState } from 'react'
import { ChartTooltip } from './ChartTooltip'
import { compact, monthLabel, niceTicks } from './scale'
import { useElementWidth } from './useElementWidth'

export interface LineSeries {
  name: string
  color: string
  points: { x: string; y: number }[]
}

interface LineChartProps {
  /** Every series shares ONE y-axis (never a dual axis) and the same x positions */
  series: LineSeries[]
  formatValue: (v: number) => string
  formatDate: (iso: string) => string
  height?: number
  label: string
}

const M = { top: 12, right: 12, bottom: 28, left: 56 }

/** Lines over time: 2px strokes, crosshair snapping to the nearest date, one tooltip for all series. */
export function LineChart({
  series,
  formatValue,
  formatDate,
  height = 260,
  label,
}: LineChartProps) {
  const [ref, width] = useElementWidth()
  const [hover, setHover] = useState<{ i: number; px: number; py: number } | null>(null)
  const xs = series[0]?.points.map((p) => p.x) ?? []
  const values = series.flatMap((s) => s.points.map((p) => p.y))
  const { ticks, lo, hi } = niceTicks(Math.min(...values), Math.max(...values))
  const plotW = Math.max(width - M.left - M.right, 0)
  const plotH = height - M.top - M.bottom
  const x = (i: number) => M.left + (xs.length > 1 ? (i / (xs.length - 1)) * plotW : 0)
  const y = (v: number) => M.top + plotH - ((v - lo) / (hi - lo || 1)) * plotH
  const monthStarts = xs
    .map((d, i) => ({ d, i }))
    .filter(({ d, i }) => i === 0 || d.slice(5, 7) !== xs[i - 1].slice(5, 7))

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={label}
          onPointerLeave={() => setHover(null)}
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const px = e.clientX - rect.left
            const i = Math.round(((px - M.left) / plotW) * (xs.length - 1))
            setHover(i >= 0 && i < xs.length ? { i, px, py: e.clientY - rect.top } : null)
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
          {monthStarts.map(({ d, i }) => (
            <text key={d} x={x(i)} y={height - 8} className="num fill-fg-muted text-xs">
              {monthLabel(d)}
            </text>
          ))}
          {hover && (
            <line
              x1={x(hover.i)}
              x2={x(hover.i)}
              y1={M.top}
              y2={M.top + plotH}
              stroke="var(--color-line-strong)"
              strokeWidth={1}
            />
          )}
          {series.map((s) => (
            <path
              key={s.name}
              d={s.points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.y)}`).join(' ')}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          {series.map((s) => {
            // End dot (r 4) with a 2px surface ring, or the hovered point
            const i = hover?.i ?? s.points.length - 1
            const p = s.points[i]
            return p ? (
              <circle
                key={s.name}
                cx={x(i)}
                cy={y(p.y)}
                r={4}
                fill={s.color}
                stroke="var(--color-surface)"
                strokeWidth={2}
              />
            ) : null
          })}
        </svg>
      )}
      {hover && (
        <ChartTooltip
          x={hover.px}
          y={hover.py}
          width={width}
          title={formatDate(xs[hover.i])}
          rows={series.map((s) => ({
            key: s.name,
            color: s.color,
            label: s.name,
            value: formatValue(s.points[hover.i].y),
          }))}
        />
      )}
    </div>
  )
}
