import {
  ENVIRONMENTS,
  SHARED_LOGIN_FIELDS,
  SHARED_LOGIN_TABLES,
  WRITABLE_ENVIRONMENT_IDS,
} from '@/shared/config/environments'
import { useSessionStore } from '@/shared/session/store'
import { http } from './http'
import type { Paginated } from '@/shared/types/api'

// Access to u-code tables. Every admin section maps to a table slug (docs/API.md).

interface ListEnvelope<T> {
  data: { data: { count: number; response: T[] } }
}

interface ItemEnvelope<T> {
  data: { data: { response: T } }
}

/** Server-side filters, merged into the `data` JSON as-is (see docs/API.md "Filtering"). */
export type TableFilters = Record<string, unknown>

export interface ListParams {
  page: number
  pageSize: number
  search?: string
  filters?: TableFilters
  /** e.g. `{ created_time: -1 }` for newest first */
  order?: Record<string, 1 | -1>
}

/** GET /v2/items/{slug}. Paging, search, filters and order all go inside the JSON `data` query param. */
export async function getTableItems<T>(
  slug: string,
  { page, pageSize, search, filters, order }: ListParams,
): Promise<Paginated<T>> {
  const query = {
    ...filters,
    offset: (page - 1) * pageSize,
    limit: pageSize,
    ...(search ? { search } : {}),
    ...(order ? { order } : {}),
  }
  const { data } = await http.get<ListEnvelope<T>>(`/v2/items/${slug}`, {
    params: { data: JSON.stringify(query) },
  })
  return {
    items: data.data.data.response ?? [],
    total: data.data.data.count,
    page,
    limit: pageSize,
  }
}

/** u-code answers an unknown id with 200 and an empty object, so we raise this instead. */
export class RecordNotFoundError extends Error {
  constructor(slug: string, guid: string) {
    super(`${slug}/${guid} not found`)
    this.name = 'RecordNotFoundError'
  }
}

/** GET /v2/items/{slug}/{guid}. `with_relations` makes it join linked records (`*_data`) like the list does. */
export async function getTableItem<T>(slug: string, guid: string): Promise<T> {
  const { data } = await http.get<ItemEnvelope<T & { guid?: string }>>(
    `/v2/items/${slug}/${guid}`,
    {
      params: { with_relations: true },
    },
  )
  const record = data.data.data.response
  if (!record?.guid) throw new RecordNotFoundError(slug, guid)
  return record
}

export interface FieldOption {
  value: string
  label: string
}

export interface TableField {
  slug: string
  type: string
  label: string
  options: FieldOption[]
  /** The value a new record starts with, as the backend defines it (`"NOW"` on dates) */
  defaultValue?: unknown
  /** Storage folder for PHOTO / FILE fields */
  folder?: string
  /** The backend refuses a record without it */
  required: boolean
}

interface FieldsEnvelope {
  data: {
    fields: {
      slug: string
      type: string
      label: string
      required?: boolean
      attributes?: {
        label_en?: string
        options?: FieldOption[]
        defaultValue?: unknown
        path?: string
      }
    }[]
  }
}

/** GET /v2/fields/{slug}: the table schema, including backend labels for select options. */
export async function getTableFields(slug: string): Promise<TableField[]> {
  const { data } = await http.get<FieldsEnvelope>(`/v2/fields/${slug}`)
  return data.data.fields.map((f) => ({
    slug: f.slug,
    type: f.type,
    label: f.attributes?.label_en || f.label,
    options: f.attributes?.options ?? [],
    defaultValue: f.attributes?.defaultValue,
    folder: f.attributes?.path,
    required: !!f.required,
  }))
}

// Writes go exactly where u-code's own admin sends them, so whatever the backend runs on a
// write (table functions, triggers) runs for ours too (docs/API.md "Writing").

/** A write was stopped before it left the browser: this session's environment isn't writable. */
export class WriteBlockedError extends Error {
  constructor(message = 'Changes are switched off in this environment, so nothing was sent.') {
    super(message)
    this.name = 'WriteBlockedError'
  }
}

const isProduction = () =>
  useSessionStore.getState().session?.environmentId === ENVIRONMENTS.production.id

/**
 * Login rows share their account with Production (SHARED_LOGIN_TABLES): outside Production the
 * admin doesn't create them, delete them, or write the account's own fields.
 */
function assertLoginSafe(slug: string, action: 'create' | 'update' | 'delete', values?: object) {
  if (!SHARED_LOGIN_TABLES.includes(slug) || isProduction()) return
  const noun = slug === 'employee' ? 'employees' : 'investors'
  if (action !== 'update')
    throw new WriteBlockedError(
      `${action === 'create' ? 'Creating' : 'Deleting'} ${noun} is off in the Test environment: their logins are shared with Production, so it could affect a real account. Nothing was sent.`,
    )
  const touched = (SHARED_LOGIN_FIELDS[slug] ?? []).filter((f) => values && f in values)
  if (touched.length)
    throw new WriteBlockedError(
      `Changing ${touched.join(', ')} is off in the Test environment: it belongs to a login shared with Production. Nothing was sent.`,
    )
}

/**
 * Every write passes through here first. Only sessions in a writable environment (Test, for
 * now) may write; anything else, including a stale Production session, is refused locally.
 */
export function assertWritable() {
  const environmentId = useSessionStore.getState().session?.environmentId
  if (!environmentId || !WRITABLE_ENVIRONMENT_IDS.includes(environmentId)) {
    throw new WriteBlockedError()
  }
}

interface WriteEnvelope {
  data: { data?: Record<string, unknown> & { guid?: string; data?: { guid?: string } } }
}

/** POST /v2/items/{slug}: creates a record. Returns its guid when the backend sends it back. */
export async function createTableItem(
  slug: string,
  values: Record<string, unknown>,
): Promise<string | undefined> {
  assertWritable()
  assertLoginSafe(slug, 'create')
  const { data } = await http.post<WriteEnvelope>(`/v2/items/${slug}`, { data: values })
  const created = data.data.data
  return created?.guid ?? created?.data?.guid
}

/** PUT /v2/items/{slug}: updates the record named by `guid` with the values sent. */
export async function updateTableItem(
  slug: string,
  guid: string,
  values: Record<string, unknown>,
): Promise<void> {
  assertWritable()
  assertLoginSafe(slug, 'update', values)
  await http.put(`/v2/items/${slug}`, { data: { guid, ...values } })
}

/**
 * DELETE /v2/items/{slug}/{guid}, with the body u-code's own admin sends: `{ data: {} }`.
 * Without a body it answers 400 "EOF"; with a bare `{}`, 500. Tables whose backend function reads
 * the record on delete get those fields in `data`.
 */
export async function deleteTableItem(
  slug: string,
  guid: string,
  /** Fields of the record a table's backend function reads on delete (e.g. `currency_percent.type`) */
  data: Record<string, unknown> = {},
): Promise<void> {
  assertWritable()
  assertLoginSafe(slug, 'delete')
  await http.delete(`/v2/items/${slug}/${guid}`, { data: { data } })
}

/**
 * POST /v1/files/folder_upload: stores a file in u-code's media storage, into the field's
 * folder, and returns its public URL, the value a PHOTO or FILE field holds.
 */
export async function uploadFile(file: File, folder?: string): Promise<string> {
  assertWritable()
  const form = new FormData()
  form.append('file', file)
  const { data } = await http.post<{ data: { link: string } }>('/v1/files/folder_upload', form, {
    params: { folder_name: folder, format: file.name.split('.').pop()?.toUpperCase() },
    // Large images on a slow line take longer than a regular request
    timeout: 120_000,
  })
  return `https://cdn.u-code.io/${data.data.link}`
}

export interface AggregationRequest {
  /** FROM clause: a table name or a sub-select with an alias */
  table: string
  columns: string[]
  joins?: { type: 'LEFT' | 'INNER'; table: string; condition: string }[]
  where?: string
  group_by?: string[]
  order_by?: string[]
}

interface AggregationEnvelope<T> {
  data: { data: { data: T[] } }
}

/**
 * POST /v2/items/{slug}/aggregation: u-code's read-only SQL endpoint (SELECT only).
 * It's a POST, but it only reads; it's what u-code's own analytics microfrontends use (docs/API.md).
 * The slug in the path must be a real table the role may read ("orders"), not an id.
 */
export async function runAggregation<T>(slug: string, request: AggregationRequest): Promise<T[]> {
  const { data } = await http.post<AggregationEnvelope<T>>(`/v2/items/${slug}/aggregation`, {
    data: { operation: 'SELECT', ...request },
  })
  return data.data.data.data ?? []
}
