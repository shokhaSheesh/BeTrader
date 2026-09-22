import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { parseIsoDate, toIsoDate } from '@/shared/lib/date'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] // Monday first, as in Uzbekistan

type View = 'days' | 'months' | 'years'

interface CalendarProps {
  /** Single-date mode */
  value?: string | null
  /** Range mode: both ends are highlighted and the days between are tinted */
  range?: { from: string | null; to: string | null }
  onChange: (value: string) => void
}

/** Three-step calendar: days → click the title → months → click again → years. */
export function Calendar({ value = null, range, onChange }: CalendarProps) {
  const now = new Date()
  const today = { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() }
  const selected = parseIsoDate(range ? range.from : value)
  const [view, setView] = useState<View>('days')
  const [cursor, setCursor] = useState({ y: selected?.y ?? today.y, m: selected?.m ?? today.m })
  const decadeStart = Math.floor(cursor.y / 12) * 12

  const step = (dir: 1 | -1) =>
    setCursor(({ y, m }) => {
      if (view === 'days') {
        const next = m + dir
        return { y: y + Math.floor(next / 12), m: (next + 12) % 12 }
      }
      return { y: y + dir * (view === 'months' ? 1 : 12), m }
    })

  const title =
    view === 'days'
      ? `${MONTHS[cursor.m]} ${cursor.y}`
      : view === 'months'
        ? String(cursor.y)
        : `${decadeStart}–${decadeStart + 11}`

  const cell = 'num grid place-items-center rounded-full transition-colors hover:bg-surface-muted'
  const selectedCell = 'bg-inverse font-medium text-on-inverse hover:bg-inverse'

  return (
    <div className="w-72 p-2">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => step(-1)}
          className="grid size-8 place-items-center rounded-full text-fg-muted hover:bg-surface-muted"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => setView(view === 'days' ? 'months' : 'years')}
          disabled={view === 'years'}
          className="num h-8 rounded-full px-3 font-medium transition-colors hover:bg-surface-muted disabled:hover:bg-transparent"
        >
          {title}
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => step(1)}
          className="grid size-8 place-items-center rounded-full text-fg-muted hover:bg-surface-muted"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {view === 'days' && (
        <DaysGrid
          cursor={cursor}
          today={today}
          selected={range ? null : selected}
          range={range}
          onPick={onChange}
          cell={cell}
          selectedCell={selectedCell}
        />
      )}

      {view === 'months' && (
        <div className="grid grid-cols-3 gap-1">
          {MONTHS.map((name, m) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                setCursor({ y: cursor.y, m })
                setView('days')
              }}
              className={cn(
                cell,
                'h-12',
                selected?.y === cursor.y && selected.m === m && selectedCell,
              )}
            >
              {name.slice(0, 3)}
            </button>
          ))}
        </div>
      )}

      {view === 'years' && (
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 12 }, (_, i) => decadeStart + i).map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => {
                setCursor({ y, m: cursor.m })
                setView('months')
              }}
              className={cn(
                cell,
                'h-12',
                selected?.y === y && selectedCell,
                y === today.y && selected?.y !== y && 'ring-1 ring-line-strong ring-inset',
              )}
            >
              {y}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function DaysGrid({
  cursor,
  today,
  selected,
  range,
  onPick,
  cell,
  selectedCell,
}: {
  cursor: { y: number; m: number }
  today: { y: number; m: number; d: number }
  selected: { y: number; m: number; d: number } | null
  range?: { from: string | null; to: string | null }
  onPick: (v: string) => void
  cell: string
  selectedCell: string
}) {
  const offset = (new Date(cursor.y, cursor.m, 1).getDay() + 6) % 7 // Monday = 0
  const days = new Date(cursor.y, cursor.m + 1, 0).getDate()
  const same = (a: { y: number; m: number; d: number } | null, d: number) =>
    !!a && a.y === cursor.y && a.m === cursor.m && a.d === d
  // ISO strings compare correctly as text, so range checks need no date math.
  const iso = (d: number) => toIsoDate(cursor.y, cursor.m, d)
  const isEnd = (d: number) => !!range && (iso(d) === range.from || iso(d) === range.to)
  const inRange = (d: number) =>
    !!range?.from && !!range.to && iso(d) > range.from && iso(d) < range.to

  return (
    <div className="grid grid-cols-7 gap-y-1 text-center">
      {WEEKDAYS.map((w) => (
        <span key={w} className="py-1 text-xs text-fg-muted">
          {w}
        </span>
      ))}
      {Array.from({ length: offset }, (_, i) => (
        <span key={`pad-${i}`} />
      ))}
      {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => onPick(toIsoDate(cursor.y, cursor.m, d))}
          aria-pressed={same(selected, d) || isEnd(d)}
          className={cn(
            cell,
            'mx-auto size-9',
            (same(selected, d) || isEnd(d)) && selectedCell,
            inRange(d) && 'rounded-xs bg-surface-muted',
            !same(selected, d) &&
              !isEnd(d) &&
              same(today, d) &&
              'ring-1 ring-line-strong ring-inset',
          )}
        >
          {d}
        </button>
      ))}
    </div>
  )
}
