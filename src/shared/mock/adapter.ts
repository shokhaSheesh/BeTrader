import {
  AxiosError,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { env } from '@/shared/config/env'
import { TARGET_ENVIRONMENT } from '@/shared/config/environments'
import { UCODE_ROOT_MENU_ID } from '@/shared/config/ucode'
import { runMockAggregation } from './aggregation'
import { mockDashboard } from './dashboard'
import { mockDividendAnalytics } from './dividend-analytics'
import menusFixture from './data/menus.json'
import permissionTables from './data/permission-tables.json'
import { FIELDS, createRow, db, deleteRow, getRow, listRows, updateRow } from './db'
import { ADMIN_ROLE_ID, CLIENT_TYPES } from './seed'

// The mock backend: answers every request the admin makes, the way u-code would, from the
// in-memory demo tables (db.ts). Plugged in as axios' adapter, so the app's own API code runs
// unchanged and nothing leaves the browser.

const PROJECT_ID = '5f459ad9-fd89-418a-9304-373407cde756'

type Handler = (req: {
  path: string
  match: RegExpExecArray
  params: Record<string, unknown>
  body: unknown
}) => unknown

const ok = (data: unknown) => ({ status: 'OK', description: 'The request has succeeded', data })

class MockHttpError extends Error {
  readonly status: number
  readonly body: unknown
  constructor(status: number, body: unknown) {
    super(`Mock backend: ${status}`)
    this.status = status
    this.body = body
  }
}
const fail = (status: number, message: string): never => {
  throw new MockHttpError(status, { status: 'ERROR', description: message, data: message })
}

// ── Auth ──────────────────────────────────────────────────────────────────────
const token = (days: number) => ({
  access_token: `mock.${crypto.randomUUID()}`,
  refresh_token: `mock.${crypto.randomUUID()}`,
  expires_at: new Date(Date.now() + days * 86_400_000).toISOString(),
})

// ── Roles: table rights per role, kept in memory like the tables ─────────────
type Rights = Record<'read' | 'write' | 'update' | 'delete', 'Yes' | 'No'>
const ALL: Rights = { read: 'Yes', write: 'Yes', update: 'Yes', delete: 'Yes' }
const READ: Rights = { read: 'Yes', write: 'No', update: 'No', delete: 'No' }
const NONE: Rights = { read: 'No', write: 'No', update: 'No', delete: 'No' }
const FINANCE = [
  'orders',
  'transactions',
  'dividend',
  'currency_rates',
  'currency_percent',
  'transaction_policy',
  'rba_matrix',
  'financial_modeling',
  'account',
]
const CONTENT = [
  'news',
  'faq',
  'documents',
  'about_us',
  'contact_info',
  'notification',
  'sms_template',
  'referral_links',
  'link_settings',
]

const rights = new Map<string, Map<string, Rights>>()
function rightsOf(roleId: string) {
  let map = rights.get(roleId)
  if (!map) {
    const role = db().role.find((x) => x.guid === roleId)
    const name = String(role?.name ?? '')
    const base = (slug: string): Rights => {
      if (['DEFAULT ADMIN', 'Admin', 'Director'].includes(name) || !role) return { ...ALL }
      if (name === 'Finance') return FINANCE.includes(slug) ? { ...ALL } : { ...READ }
      if (name === 'Marketing Manager') return CONTENT.includes(slug) ? { ...ALL } : { ...NONE }
      if (name === 'OctoBank') return { ...READ }
      return { ...NONE }
    }
    map = new Map(permissionTables.map((t) => [t.slug, base(t.slug)]))
    rights.set(roleId, map)
  }
  return map
}

const menus = {
  ...(menusFixture as Record<string, unknown[]>),
  // The Dashboard and Analytics pages follow these u-code menu links (shared/config/navigation.ts)
  [UCODE_ROOT_MENU_ID]: [
    ...((menusFixture as Record<string, unknown[]>)[UCODE_ROOT_MENU_ID] ?? []),
    { id: '0ee1c323-a290-4616-a0db-c343a5bff302', type: 'LINK', label: 'Dashboard' },
    { id: '11074988-7d86-427a-91c3-3472c1db7b08', type: 'LINK', label: 'Dividends analytics' },
    { id: '049c81c9-01a8-42f0-908e-b73054d110fc', type: 'LINK', label: 'Analytics by tariff' },
  ],
} as Record<string, { id: string; type: string; label?: string | null }[]>

const AUTH: [string, RegExp, Handler][] = [
  [
    'POST',
    /^\/v3\/multicompany\/default-login$/,
    ({ body }) => {
      const { username, password } = (body ?? {}) as { username?: string; password?: string }
      if (!username?.trim() || !password) fail(500, 'cannot get user')
      return ok({
        response: {
          token: token(30),
          environment_id: TARGET_ENVIRONMENT.id,
          resource_id: TARGET_ENVIRONMENT.resourceId,
          role: { id: ADMIN_ROLE_ID, project_id: PROJECT_ID, name: 'DEFAULT ADMIN' },
        },
      })
    },
  ],
  ['PUT', /^\/v2\/refresh$/, () => ok({ token: token(1) })],
  [
    'GET',
    /^\/v2\/role$/,
    () => {
      const response = db().role.map((x) => ({ ...x, status: x.status ?? true }))
      return ok({ table_slug: 'role', data: { count: response.length, response } })
    },
  ],
  [
    'POST',
    /^\/v2\/role$/,
    ({ body }) => {
      const { name, client_type_id } = body as { name: string; client_type_id?: string }
      const guid = crypto.randomUUID()
      db().role.push({
        guid,
        name,
        client_type_id: client_type_id ?? CLIENT_TYPES.employee,
        is_system: false,
        status: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      // u-code starts a new role with every right on
      rights.set(guid, new Map(permissionTables.map((t) => [t.slug, { ...ALL }])))
      return ok({ guid })
    },
  ],
  [
    'DELETE',
    /^\/v2\/role\/([^/]+)$/,
    ({ match }) => {
      const roles = db().role
      const i = roles.findIndex((x) => x.guid === match[1])
      if (i < 0) fail(404, 'role not found')
      roles.splice(i, 1)
      return ok(null)
    },
  ],
  [
    'GET',
    /^\/v2\/role-permission\/detailed\/([^/]+)\/([^/]+)$/,
    ({ match }) => {
      const role = db().role.find((x) => x.guid === match[2])
      const map = rightsOf(match[2])
      return ok({
        project_id: match[1],
        data: {
          name: role?.name ?? '',
          guid: match[2],
          project_id: match[1],
          client_type_id: role?.client_type_id ?? CLIENT_TYPES.employee,
          tables: permissionTables.map((t) => ({
            slug: t.slug,
            label: t.label,
            record_permissions: { ...map.get(t.slug)! },
            field_permissions: [],
          })),
        },
      })
    },
  ],
  [
    'PUT',
    /^\/v2\/role-permission\/detailed$/,
    ({ body }) => {
      const { data, role_id } = body as {
        role_id: string
        data: { tables: { slug: string; record_permissions: Rights }[] }
      }
      const map = rightsOf(role_id)
      for (const t of data.tables) map.set(t.slug, { ...t.record_permissions })
      return ok(null)
    },
  ],
  [
    'GET',
    /^\/v2\/menu-permission\/detailed\/([^/]+)\/([^/]+)\/([^/]+)$/,
    ({ match }) =>
      ok({
        menus: (menus[match[3]] ?? []).map((m) => ({
          id: m.id,
          label: m.label,
          type: m.type,
          permission: { read: true, write: true, update: true, delete: true },
        })),
      }),
  ],
]

const ADMIN: [string, RegExp, Handler][] = [
  ['GET', /^\/v1\/analytics\/dividends$/, ({ params }) => ok(mockDividendAnalytics(params))],
  [
    'GET',
    /^\/v1\/analytics\/dashboard$/,
    ({ params }) => ok(mockDashboard(params as { from?: string; to?: string })),
  ],
  ['GET', /^\/v3\/menus$/, ({ params }) => ok({ menus: menus[String(params.parent_id)] ?? null })],
  [
    'GET',
    /^\/v2\/fields\/([^/]+)$/,
    ({ match }) =>
      ok({ fields: FIELDS[match[1]] ?? fail(500, 'error getting table: no rows in result set') }),
  ],
  [
    'POST',
    /^\/v2\/items\/([^/]+)\/aggregation$/,
    ({ body }) => {
      const request = (body as { data: Parameters<typeof runMockAggregation>[0] }).data
      return ok({ data: { data: runMockAggregation(request) } })
    },
  ],
  [
    'GET',
    /^\/v2\/items\/([^/]+)\/([^/]+)$/,
    ({ match }) => ok({ data: { response: getRow(match[1], match[2]) ?? {} } }),
  ],
  [
    'GET',
    /^\/v2\/items\/([^/]+)$/,
    ({ match, params }) => {
      if (!db()[match[1]]) fail(500, 'error getting table: no rows in result set')
      const query = typeof params.data === 'string' ? JSON.parse(params.data) : {}
      return ok({ table_slug: match[1], data: listRows(match[1], query) })
    },
  ],
  [
    'POST',
    /^\/v2\/items\/([^/]+)$/,
    ({ match, body }) =>
      ok({ data: createRow(match[1], (body as { data: Record<string, unknown> }).data) }),
  ],
  [
    'PUT',
    /^\/v2\/items\/([^/]+)$/,
    ({ match, body }) => {
      const { guid, ...values } = (body as { data: { guid: string } & Record<string, unknown> })
        .data
      if (!updateRow(match[1], guid, values)) fail(404, 'record not found')
      return ok({ data: { guid } })
    },
  ],
  [
    'DELETE',
    /^\/v2\/items\/([^/]+)\/([^/]+)$/,
    ({ match }) => {
      if (!deleteRow(match[1], match[2])) fail(404, 'record not found')
      return ok(null)
    },
  ],
  [
    'POST',
    /^\/v1\/files\/folder_upload$/,
    ({ body }) => {
      // Nothing is uploaded: the file is shown from the browser until the page is reloaded
      const file = (body as FormData).get('file') as File
      return ok({ link: URL.createObjectURL(file) })
    },
  ],
]

function resolve(config: InternalAxiosRequestConfig) {
  const url = config.url ?? ''
  const full = /^https?:\/\//.test(url)
    ? url
    : `${(config.baseURL ?? '').replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`
  const parsed = new URL(full)
  const isAuth = full.startsWith(env.authUrl)
  return { path: parsed.pathname, routes: isAuth ? AUTH : ADMIN }
}

const parseBody = (data: unknown) => {
  if (typeof data !== 'string') return data
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

/** A short wait, so loaders and pending buttons show as they do against the real backend. */
const latency = () => new Promise((r) => setTimeout(r, 180 + Math.random() * 270))

export const mockAdapter: AxiosAdapter = async (config) => {
  await latency()
  const method = (config.method ?? 'get').toUpperCase()
  const { path, routes } = resolve(config)
  const respond = (status: number, data: unknown): AxiosResponse => ({
    data,
    status,
    statusText: String(status),
    headers: {},
    config,
    request: {},
  })

  for (const [m, pattern, handler] of routes) {
    if (m !== method) continue
    const match = pattern.exec(path)
    if (!match) continue
    try {
      return respond(
        200,
        handler({ path, match, params: config.params ?? {}, body: parseBody(config.data) }),
      )
    } catch (error) {
      if (!(error instanceof MockHttpError)) throw error
      const response = respond(error.status, error.body)
      throw new AxiosError(error.message, AxiosError.ERR_BAD_RESPONSE, config, {}, response)
    }
  }
  console.warn(`[mock] no handler for ${method} ${path}`)
  const response = respond(404, {
    status: 'NOT_FOUND',
    description: `Mock backend has no ${method} ${path}`,
    data: null,
  })
  throw new AxiosError(
    `No mock for ${method} ${path}`,
    AxiosError.ERR_BAD_REQUEST,
    config,
    {},
    response,
  )
}
