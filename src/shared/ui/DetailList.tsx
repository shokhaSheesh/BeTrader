import type { ReactNode } from 'react'
import { Skeleton } from './Skeleton'

export interface DetailItem {
  label: string
  value: ReactNode
}

/** A titled panel of label/value pairs, used on every detail page. */
export function DetailSection({
  title,
  items,
  loading,
}: {
  title: string
  items: DetailItem[]
  loading?: boolean
}) {
  return (
    <section className="rounded-md border border-line bg-surface">
      <h2 className="border-b border-line px-6 py-4 text-base font-semibold">{title}</h2>
      <dl className="grid grid-cols-1 gap-x-8 gap-y-5 p-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="min-w-0">
            <dt className="text-xs text-fg-muted">{item.label}</dt>
            <dd className="mt-1 break-words">
              {loading ? <Skeleton className="h-5 w-32" /> : item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
