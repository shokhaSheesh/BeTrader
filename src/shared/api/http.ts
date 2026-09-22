import axios from 'axios'
import { useAuthStore } from '@/features/auth/model/store'
import { env } from '@/shared/config/env'

export const http = axios.create({
  baseURL: env.apiUrl,
  timeout: 20_000,
})

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)
