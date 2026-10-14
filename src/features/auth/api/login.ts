import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { env } from '@/shared/config/env'
import { TARGET_ENVIRONMENT } from '@/shared/config/environments'
import { useSessionStore, type Session } from '@/shared/session/store'

export interface LoginCredentials {
  login: string
  password: string
}

interface LoginResponse {
  data: {
    response: {
      token: { access_token: string; refresh_token: string; expires_at: string }
      environment_id: string
      resource_id: string
      role: { id: string; project_id: string }
    }
  }
}

interface TokenResponse {
  data: { token: { access_token: string; refresh_token: string; expires_at: string } }
}

/** Thrown when the session can't be moved into the target environment: we never fall back. */
export class EnvironmentSwitchError extends Error {
  constructor() {
    super(`Couldn't open the ${TARGET_ENVIRONMENT.label} environment`)
    this.name = 'EnvironmentSwitchError'
  }
}

async function login({ login, password }: LoginCredentials): Promise<Session> {
  // Plain axios: the shared `http` instance would attach a (missing) token.
  const { data } = await axios.post<LoginResponse>(`${env.authUrl}/v3/multicompany/default-login`, {
    username: login,
    password,
  })
  const { token, environment_id, role } = data.data.response
  // Login always lands in Production. The environment belongs to the session on u-code's side,
  // so move this session into the target one before anything is read or written.
  const tokens = environment_id === TARGET_ENVIRONMENT.id ? token : await switchEnvironment(token)
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: tokens.expires_at,
    environmentId: TARGET_ENVIRONMENT.id,
    resourceId: TARGET_ENVIRONMENT.resourceId,
    login,
    roleId: role.id,
    projectId: role.project_id,
  }
}

/** PUT /v2/refresh with `env_id`: the same call u-code's own app uses to change environment. */
async function switchEnvironment(token: TokenResponse['data']['token']) {
  try {
    const { data } = await axios.put<TokenResponse>(
      `${env.authUrl}/v2/refresh`,
      { refresh_token: token.refresh_token, env_id: TARGET_ENVIRONMENT.id },
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          'environment-id': TARGET_ENVIRONMENT.id,
        },
      },
    )
    return data.data.token
  } catch {
    throw new EnvironmentSwitchError()
  }
}

export function useLoginMutation() {
  const setSession = useSessionStore((s) => s.setSession)
  return useMutation({ mutationFn: login, onSuccess: setSession })
}

/** u-code answers a wrong login with HTTP 500 "cannot get user", so any server reply means bad credentials. */
export function loginErrorMessage(error: unknown) {
  if (error instanceof EnvironmentSwitchError) return `${error.message}. Please try again.`
  if (axios.isAxiosError(error) && error.response) return 'Wrong login or password'
  return "Couldn't reach the server. Check your connection and try again."
}
