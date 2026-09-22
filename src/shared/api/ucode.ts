import { http } from './http'
import type { Paginated } from '@/shared/types/api'

// Read-only access to u-code tables. Every admin section maps to a table slug (docs/API.md).

interface ListEnvelope<T> {
  data: { data: { count: number; response: T[] } }
}

interface ItemEnvelope<T> {
  data: { data: { response: T } }
}

export interface ListParams {
  page: number
  pageSize: number
  search?: string
}

/** GET /v2/items/{slug}. Paging and search go inside the JSON `data` query param. */
export async function getTableItems<T>(
  slug: string,
  { page, pageSize, search }: ListParams,
): Promise<Paginated<T>> {
  const query = { offset: (page - 1) * pageSize, limit: pageSize, ...(search ? { search } : {}) }
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

/** GET /v2/items/{slug}/{guid} */
export async function getTableItem<T>(slug: string, guid: string): Promise<T> {
  const { data } = await http.get<ItemEnvelope<T>>(`/v2/items/${slug}/${guid}`)
  return data.data.data.response
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
}

interface FieldsEnvelope {
  data: {
    fields: {
      slug: string
      type: string
      label: string
      attributes?: { label_en?: string; options?: FieldOption[] }
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
  }))
}
