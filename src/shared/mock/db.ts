import fieldsFixture from './data/fields.json'
import { seed, type Row, type Tables } from './seed'

// The mock backend's tables: seeded once per page load and changed in memory by create, edit
// and delete. A refresh brings the original demo data back.

let tables: Tables | null = null
export const db = (): Tables => (tables ??= seed())

export const FIELDS = fieldsFixture as Record<
  string,
  { slug: string; type: string; label: string; attributes?: Record<string, unknown> }[]
>

const RESERVED = new Set(['offset', 'limit', 'search', 'order', 'with_relations'])

/** `investors_id` / `investors_id_2` → `investors`; `policy_Type_id` → `policy_Type` */
const lookupTable = (key: string) => {
  const m = /^(.+?)_id(_2)?$/.exec(key)
  if (!m || key === 'user_id_auth') return null
  return db()[m[1]] ? m[1] : null
}

/** Like u-code: each linked record joined in as `<field>_data` (one level deep). */
export function withJoins(row: Row): Row {
  const out: Row = { ...row }
  for (const [key, value] of Object.entries(row)) {
    const table = lookupTable(key)
    if (!table) continue
    const linked = typeof value === 'string' ? db()[table].find((x) => x.guid === value) : undefined
    out[`${key}_data`] = linked ? { ...linked } : null
  }
  return out
}

const asTime = (v: unknown) => (typeof v === 'string' ? Date.parse(v) : NaN)

/** u-code's filter syntax: equality, arrays (any of), `{ $gte, $lt }` ranges. */
function matches(row: Row, key: string, want: unknown): boolean {
  const have = row[key]
  if (want && typeof want === 'object' && !Array.isArray(want)) {
    const range = want as { $gte?: string | number; $lt?: string | number }
    const cmp = (bound: string | number) => {
      // A plain day compares with the day part of the value (DATE fields)
      if (typeof bound === 'string' && bound.length === 10)
        return String(have ?? '')
          .slice(0, 10)
          .localeCompare(bound)
      if (typeof bound === 'number') return Number(have) - bound
      return asTime(have) - asTime(bound)
    }
    if (have === null || have === undefined) return false
    if (range.$gte !== undefined && cmp(range.$gte) < 0) return false
    if (range.$lt !== undefined && cmp(range.$lt) >= 0) return false
    return true
  }
  if (Array.isArray(want)) {
    if (!want.length) return true
    const values = Array.isArray(have) ? have : [have]
    return want.some((w) => values.includes(w))
  }
  if (typeof want === 'boolean') return !!have === want
  if (Array.isArray(have)) return have.includes(want)
  if (typeof want === 'string' && typeof have === 'string')
    return have.toLowerCase().includes(want.toLowerCase())
  return have === want
}

const searchable = (row: Row) =>
  Object.entries(row)
    .filter(
      ([k, v]) =>
        typeof v === 'string' && k !== 'guid' && !k.endsWith('_at') && !/_id(_2)?$/.test(k),
    )
    .map(([, v]) => (v as string).toLowerCase())
    .join(' ')

export function listRows(slug: string, query: Record<string, unknown>) {
  let rows = db()[slug] ?? []
  for (const [key, want] of Object.entries(query)) {
    if (RESERVED.has(key)) continue
    rows = rows.filter((row) => matches(row, key, want))
  }
  const search = typeof query.search === 'string' ? query.search.trim().toLowerCase() : ''
  if (search) rows = rows.filter((row) => searchable(row).includes(search))

  const order = (query.order as Record<string, 1 | -1> | undefined) ?? { created_at: -1 }
  const [[field, dir]] = Object.entries(order).length ? Object.entries(order) : [['created_at', -1]]
  rows = [...rows].sort((a, b) => {
    const [x, y] = [a[field], b[field]]
    if (x === y) return 0
    if (x === null || x === undefined) return 1
    if (y === null || y === undefined) return -1
    return (
      (typeof x === 'number' && typeof y === 'number'
        ? x - y
        : String(x).localeCompare(String(y))) * dir
    )
  })

  const offset = Number(query.offset ?? 0)
  const limit = Number(query.limit ?? 10)
  return { count: rows.length, response: rows.slice(offset, offset + limit).map(withJoins) }
}

export const getRow = (slug: string, guid: string) => {
  const row = db()[slug]?.find((x) => x.guid === guid)
  return row ? withJoins(row) : undefined
}

const now = () => new Date().toISOString()

/** Values as u-code stores them: `NOW` / `now()` defaults become the current time. */
const stored = (values: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(values).map(([k, v]) => [k, v === 'NOW' || v === 'now()' ? now() : v]),
  )

export function createRow(slug: string, values: Record<string, unknown>): Row {
  const row: Row = {
    ...stored(values),
    guid: crypto.randomUUID(),
    created_at: now(),
    updated_at: now(),
  }
  ;(db()[slug] ??= []).unshift(row)
  return row
}

export function updateRow(slug: string, guid: string, values: Record<string, unknown>) {
  const row = db()[slug]?.find((x) => x.guid === guid)
  if (!row) return false
  Object.assign(row, stored(values), { updated_at: now() })
  return true
}

export function deleteRow(slug: string, guid: string) {
  const rows = db()[slug] ?? []
  const i = rows.findIndex((x) => x.guid === guid)
  if (i < 0) return false
  rows.splice(i, 1)
  return true
}
