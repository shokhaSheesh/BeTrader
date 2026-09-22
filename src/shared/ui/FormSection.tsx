import type { ReactNode } from 'react'

/** A titled panel that groups form fields; forms are made of these (DESIGN.md §3). */
export function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-md border border-line bg-surface">
      <div className="border-b border-line px-6 py-4">
        <h2 className="text-base font-semibold">{title}</h2>
        {description && <p className="mt-0.5 text-fg-muted">{description}</p>}
      </div>
      <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">{children}</div>
    </section>
  )
}
