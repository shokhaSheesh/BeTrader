import { useState } from 'react'

/** Ink or white for a label set inside a fill, by the fill's luminance (hex colors only). */
function labelOn(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.18 ? 'var(--color-fg)' : '#ffffff'
}

export interface StackedRow {
  label: string
  /** Formatted total shown at the end of the row */
  total: string
  /** `color` must be a hex value so the inside label can pick ink or white */
  segments: { name: string; color: string; value: number; display: string }[]
}

/**
 * Part-to-whole, one horizontal 100% bar per measure. Segments are separated by a 2px surface gap;
 * a share label sits inside a segment only when it fits, otherwise it lives in the tooltip and table.
 */
export function StackedBars({ rows }: { rows: StackedRow[] }) {
  const [hover, setHover] = useState<string | null>(null)
  return (
    <div className="flex flex-col gap-5">
      {rows.map((row) => {
        const sum = row.segments.reduce((a, s) => a + s.value, 0) || 1
        return (
          <div key={row.label}>
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <span className="text-fg-muted">{row.label}</span>
              <span className="num font-semibold">{row.total}</span>
            </div>
            <div className="flex h-7 gap-0.5">
              {row.segments.map((s) => {
                const share = (s.value / sum) * 100
                const key = `${row.label}:${s.name}`
                return (
                  <div
                    key={s.name}
                    tabIndex={0}
                    onPointerEnter={() => setHover(key)}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setHover(key)}
                    onBlur={() => setHover(null)}
                    aria-label={`${s.name}: ${s.display} (${share.toFixed(1)}%)`}
                    className="relative grid min-w-1 place-items-center overflow-visible first:rounded-l-xs last:rounded-r-xs"
                    style={{
                      width: `${share}%`,
                      background: s.color,
                      opacity: hover && hover !== key ? 0.5 : 1,
                    }}
                  >
                    {share >= 12 && (
                      <span
                        className="num px-1 text-xs font-medium"
                        style={{ color: labelOn(s.color) }}
                      >
                        {share.toFixed(0)}%
                      </span>
                    )}
                    {hover === key && (
                      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-sm border border-line bg-surface px-3 py-2 whitespace-nowrap shadow-popover">
                        <span className="num font-semibold">{s.display}</span>{' '}
                        <span className="text-fg-muted">
                          {s.name} · {share.toFixed(1)}%
                        </span>
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
