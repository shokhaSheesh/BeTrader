import axios from 'axios'
import { env } from '@/shared/config/env'
import { useSessionStore, type Session } from './store'

interface RefreshResponse {
  data: { token: { access_token: string; refresh_token: string; expires_at: string } }
}

let inflight: Promise<Session | null> | null = null

/**
 * PUT /v2/refresh. Single-flight: parallel callers share one request.
 * Resolves to the new session, or null (and logs out) when the refresh token is rejected.
 */
export function refreshSession(): Promise<Session | null> {
  inflight ??= doRefresh().finally(() => {
    inflight = null
  })
  return inflight
}

async function doRefresh(): Promise<Session | null> {
  const { session, setSession, logout } = useSessionStore.getState()
  if (!session) return null

  try {
    // Plain axios: going through `http` would re-enter its refresh interceptor.
    const { data } = await axios.put<RefreshResponse>(
      `${env.authUrl}/v2/refresh`,
      { refresh_token: session.refreshToken, env_id: session.environmentId },
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'environment-id': session.environmentId,
        },
      },
    )
    const { token } = data.data
    const next: Session = {
      ...session,
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: token.expires_at,
    }
    setSession(next)
    return next
  } catch {
    logout()
    return null
  }
}

/** Refresh a minute early so a request never goes out with a token that dies in flight. */
export const isExpiringSoon = (session: Session) =>
  Date.parse(session.expiresAt) - Date.now() < 60_000
