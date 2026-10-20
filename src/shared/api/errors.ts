import axios from 'axios'
import { WriteBlockedError } from './ucode'

/**
 * The reason the backend gave for a failed request, to show the user as-is.
 * u-code answers `{ status, description, data }`, where `data` often holds the real cause
 * wrapped in gRPC noise ("rpc error: code = Internal desc = …"), so that prefix is dropped.
 */
export function backendMessage(error: unknown): string | undefined {
  if (error instanceof WriteBlockedError) return error.message
  if (!axios.isAxiosError(error)) return undefined
  if (!error.response) return 'No connection to the server.'
  const body = error.response.data as { description?: unknown; data?: unknown } | undefined
  const detail = typeof body?.data === 'string' ? body.data : undefined
  const message = detail?.replace(/^rpc error: code = \w+ desc = /, '').trim()
  const reason = message || (typeof body?.description === 'string' ? body.description : undefined)
  // The table's backend function failed: it runs after u-code saves, so the change may be in
  return reason && /in Table actions/.test(reason)
    ? `${reason}. The backend's checks failed after receiving the change, so it may still have been saved: the list has been refreshed.`
    : reason
}
