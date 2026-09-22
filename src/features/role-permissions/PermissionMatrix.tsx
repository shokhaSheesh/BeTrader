import { Check, Minus } from 'lucide-react'
import { NAVIGATION } from '@/shared/config/navigation'
import type { Action, TablePermission } from '@/shared/permissions'
import { CheckboxBox } from '@/shared/ui'

const ACTIONS: { key: Action; label: string }[] = [
  { key: 'read', label: 'View' },
  { key: 'create', label: 'Create' },
  { key: 'update', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
]

type Tables = Map<string, TablePermission & { label: string }>

/** Tables grouped like the sidebar ("Finance → Orders"); u-code system tables go last. */
function groups(tables: Tables) {
  const seen = new Set<string>()
  const out: { title: string; rows: { slug: string; label: string }[] }[] = []
  for (const entry of NAVIGATION) {
    const leaves = entry.kind === 'link' ? [entry] : entry.items
    const rows = leaves.flatMap((l) =>
      l.resource.table && tables.has(l.resource.table)
        ? [{ slug: l.resource.table, label: l.label }]
        : [],
    )
    rows.forEach((r) => seen.add(r.slug))
    if (rows.length) out.push({ title: entry.label, rows })
  }
  const rest = [...tables.entries()]
    .filter(([slug]) => !seen.has(slug))
    .map(([slug, t]) => ({ slug, label: t.label || slug }))
  if (rest.length) out.push({ title: 'Other tables (not in this admin)', rows: rest })
  return out
}

interface PermissionMatrixProps {
  tables: Tables
  /** Edit mode: checkboxes instead of marks */
  onToggle?: (slug: string, action: Action) => void
  /** Edit mode: set one action for every table at once (column header checkbox) */
  onToggleColumn?: (action: Action, value: boolean) => void
}

/** A role's record rights per table: View / Create / Edit / Delete. */
export function PermissionMatrix({ tables, onToggle, onToggleColumn }: PermissionMatrixProps) {
  const all = [...tables.values()]
  const columnState = (a: Action) =>
    all.every((t) => t[a]) ? true : all.some((t) => t[a]) ? 'mixed' : false
  const th = 'h-10 px-4 text-xs font-medium whitespace-nowrap text-fg-muted'
  return (
    <div className="overflow-x-auto rounded-md border border-line bg-surface">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface-muted">
            <th className={`${th} text-left`}>Page</th>
            {ACTIONS.map((a) => (
              <th key={a.key} className={`${th} w-28 text-center`}>
                {onToggleColumn ? (
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={columnState(a.key)}
                    aria-label={`${a.label}: all pages`}
                    onClick={() => onToggleColumn(a.key, columnState(a.key) !== true)}
                    className="inline-flex items-center gap-2 rounded-sm px-2 py-1 hover:bg-line"
                  >
                    <CheckboxBox checked={columnState(a.key) === true} />
                    {a.label}
                  </button>
                ) : (
                  a.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        {groups(tables).map((g) => (
          <tbody key={g.title}>
            <tr className="border-t border-line">
              <th
                colSpan={5}
                className="bg-surface px-4 pt-4 pb-1 text-left text-xs font-medium text-fg-muted"
              >
                {g.title}
              </th>
            </tr>
            {g.rows.map((r) => {
              const t = tables.get(r.slug)!
              return (
                <tr key={r.slug} className="border-t border-line hover:bg-surface-hover">
                  <td className="h-12 px-4">
                    <span className="font-medium">{r.label}</span>{' '}
                    <span className="num text-xs text-fg-subtle">{r.slug}</span>
                  </td>
                  {ACTIONS.map((a) => (
                    <td key={a.key} className="h-12 px-4 text-center">
                      {onToggle ? (
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={t[a.key]}
                          aria-label={`${a.label} ${r.label}`}
                          onClick={() => onToggle(r.slug, a.key)}
                          className="inline-grid size-8 place-items-center rounded-sm hover:bg-surface-muted"
                        >
                          <CheckboxBox checked={t[a.key]} />
                        </button>
                      ) : t[a.key] ? (
                        <span
                          role="img"
                          aria-label="Allowed"
                          className="inline-grid size-7 place-items-center rounded-full bg-success-tint text-success-text"
                        >
                          <Check size={16} strokeWidth={2.25} />
                        </span>
                      ) : (
                        <span
                          role="img"
                          aria-label="Not allowed"
                          className="inline-grid size-7 place-items-center rounded-full bg-surface-muted text-fg-subtle"
                        >
                          <Minus size={16} />
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        ))}
      </table>
    </div>
  )
}
