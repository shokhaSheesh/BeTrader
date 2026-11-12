import { Check, Minus } from 'lucide-react'
import { NAVIGATION } from '@/shared/config/navigation'
import type { Action, TablePermission } from '@/shared/permissions'
import { useT, type Vars } from '@/shared/i18n'
import { CheckboxBox } from '@/shared/ui'

const ACTIONS: { key: Action; label: string }[] = [
  { key: 'read', label: 'View' },
  { key: 'create', label: 'Create' },
  { key: 'update', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
]

type Tables = Map<string, TablePermission & { label: string }>

/** Tables grouped like the sidebar ("Finance → Orders"); u-code system tables go last. */
function groups(tables: Tables, t: (text: string, vars?: Vars) => string) {
  const seen = new Set<string>()
  const out: { title: string; rows: { slug: string; label: string }[] }[] = []
  for (const entry of NAVIGATION) {
    const leaves = entry.kind === 'link' ? [entry] : entry.items
    const rows = leaves.flatMap((l) =>
      l.resource.table && tables.has(l.resource.table)
        ? [{ slug: l.resource.table, label: t(l.label) }]
        : [],
    )
    rows.forEach((r) => seen.add(r.slug))
    if (rows.length) out.push({ title: t(entry.label), rows })
  }
  const rest = [...tables.entries()]
    .filter(([slug]) => !seen.has(slug))
    .map(([slug, t]) => ({ slug, label: t.label || slug }))
  if (rest.length) out.push({ title: t('Other tables (not in this admin)'), rows: rest })
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
  const t = useT()
  const all = [...tables.values()]
  const columnState = (a: Action) =>
    all.every((p) => p[a]) ? true : all.some((p) => p[a]) ? 'mixed' : false
  const th = 'h-10 px-4 text-xs font-medium whitespace-nowrap text-fg-muted'
  return (
    <div className="overflow-x-auto rounded-md border border-line bg-surface">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface-muted">
            <th className={`${th} text-left`}>{t('Page')}</th>
            {ACTIONS.map((a) => (
              <th key={a.key} className={`${th} w-28 text-center`}>
                {onToggleColumn ? (
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={columnState(a.key)}
                    aria-label={t('{action}: all pages', { action: t(a.label) })}
                    onClick={() => onToggleColumn(a.key, columnState(a.key) !== true)}
                    className="inline-flex items-center gap-2 rounded-sm px-2 py-1 hover:bg-line"
                  >
                    <CheckboxBox checked={columnState(a.key) === true} />
                    {t(a.label)}
                  </button>
                ) : (
                  t(a.label)
                )}
              </th>
            ))}
          </tr>
        </thead>
        {groups(tables, t).map((g) => (
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
              const p = tables.get(r.slug)!
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
                          aria-checked={p[a.key]}
                          aria-label={t('{action} {page}', { action: t(a.label), page: r.label })}
                          onClick={() => onToggle(r.slug, a.key)}
                          className="inline-grid size-8 place-items-center rounded-sm hover:bg-surface-muted"
                        >
                          <CheckboxBox checked={p[a.key]} />
                        </button>
                      ) : p[a.key] ? (
                        <span
                          role="img"
                          aria-label={t('Allowed')}
                          className="inline-grid size-7 place-items-center rounded-full bg-success-tint text-success-text"
                        >
                          <Check size={16} strokeWidth={2.25} />
                        </span>
                      ) : (
                        <span
                          role="img"
                          aria-label={t('Not allowed')}
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
