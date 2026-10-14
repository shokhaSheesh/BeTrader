import axios from 'axios'

/**
 * The reason the backend gave for a failed request, to show the user as-is.
 * u-code answers `{ status, description, data }`, where `data` often holds the real cause
 * wrapped in gRPC noise ("rpc error: code = Internal desc = …"), so that prefix is dropped.
 */
export function backendMessage(error: unknown): string | undefined {
  if (!axios.isAxiosError(error)) return undefined
  if (!error.response) return 'No connection to the server.'
  const body = error.response.data as { description?: unknown; data?: unknown } | undefined
  const detail = typeof body?.data === 'string' ? body.data : undefined
  const message = detail?.replace(/^rpc error: code = \w+ desc = /, '').trim()
  return message || (typeof body?.description === 'string' ? body.description : undefined)
}
