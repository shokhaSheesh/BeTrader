import type { ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'
import { Button } from './Button'

interface FilterBarProps {
  children: ReactNode
  /** Shown only while a search or filter is active (DESIGN.md §3) */
  onReset?: () => void
  active?: boolean
}

/** Search first and left, then filters, then Reset. */
export function FilterBar({ children, onReset, active }: FilterBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {children}
      {active && onReset && (
        <Button variant="ghost" icon={RotateCcw} onClick={onReset}>
          Reset
        </Button>
      )}
    </div>
  )
}
