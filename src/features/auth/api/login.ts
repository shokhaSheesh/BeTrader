import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { env } from '@/shared/config/env'
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
    }
  }
}

async function login({ login, password }: LoginCredentials): Promise<Session> {
  // Plain axios: the shared `http` instance would attach a (missing) token.
  const { data } = await axios.post<LoginResponse>(`${env.authUrl}/v3/multicompany/default-login`, {
    username: login,
    password,
  })
  const { token, environment_id, resource_id } = data.data.response
  return {
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    expiresAt: token.expires_at,
    environmentId: environment_id,
    resourceId: resource_id,
    login,
  }
}

export function useLoginMutation() {
  const setSession = useSessionStore((s) => s.setSession)
  return useMutation({ mutationFn: login, onSuccess: setSession })
}

/** u-code answers a wrong login with HTTP 500 "cannot get user", so any server reply means bad credentials. */
export function loginErrorMessage(error: unknown) {
  if (axios.isAxiosError(error) && error.response) return 'Wrong login or password'
  return "Couldn't reach the server. Check your connection and try again."
}
