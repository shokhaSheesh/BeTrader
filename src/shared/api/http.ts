import axios, { type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/shared/config/env'
import { isExpiringSoon, refreshSession } from '@/shared/session/refresh'
import { useSessionStore } from '@/shared/session/store'

export const http = axios.create({
  baseURL: env.apiUrl,
  timeout: 20_000,
})

http.interceptors.request.use(async (config) => {
  let session = useSessionStore.getState().session
  if (session && isExpiringSoon(session)) session = await refreshSession()
  if (session) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
    config.headers['environment-id'] = session.environmentId
    config.headers['resource-id'] = session.resourceId
  }
  return config
})

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

// A 401 means the access token was rejected: refresh once and replay the request.
// If the refresh fails too, refreshSession() logs out and the router sends the user to /login.
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = axios.isAxiosError(error)
      ? (error.config as RetriableConfig | undefined)
      : undefined
    if (error.response?.status !== 401 || !config || config._retried) throw error

    config._retried = true
    const session = await refreshSession()
    if (!session) throw error
    return http(config)
  },
)
