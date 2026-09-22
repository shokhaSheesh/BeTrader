import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PAGE_SIZES } from '@/shared/config/list'
import { formatNumber } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import { Select } from './Select'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

function pageWindow(page: number, pageCount: number): (number | 'gap')[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const pages = new Set([1, pageCount, page - 1, page, page + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b)
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ['gap' as const, p] : [p]))
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const navButton =
    'grid size-8 place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg disabled:pointer-events-none disabled:opacity-40'

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="flex items-center gap-3 text-fg-muted">
        <span className="num">
          Showing {formatNumber(from)}–{formatNumber(to)} of {formatNumber(total)}
        </span>
        <Select
          size="sm"
          value={String(pageSize)}
          onChange={(v) => onPageSizeChange(Number(v))}
          options={PAGE_SIZES.map((size) => ({ value: String(size), label: `${size} per page` }))}
          aria-label="Rows per page"
          className="num w-36"
        />
      </div>
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          type="button"
          className={navButton}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {pageWindow(page, pageCount).map((p, i) =>
          p === 'gap' ? (
            <span key={`gap-${i}`} className="w-8 text-center text-fg-subtle">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={cn(
                'num h-8 min-w-8 rounded-full px-2 font-medium transition-colors',
                p === page ? 'bg-inverse text-on-inverse' : 'text-fg-muted hover:bg-surface-muted',
              )}
            >
              {formatNumber(p)}
            </button>
          ),
        )}
        <button
          type="button"
          className={navButton}
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  )
}
