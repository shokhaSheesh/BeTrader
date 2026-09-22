// u-code's public API hosts are the defaults, so a build without a .env (e.g. on Vercel) still works.
// Set VITE_API_URL / VITE_AUTH_URL only to point the admin at a different backend.
const DEFAULT_API_URL = 'https://api.admin.u-code.io'
const DEFAULT_AUTH_URL = 'https://api.auth.u-code.io'

const orDefault = (value: string | undefined, fallback: string) =>
  value && value.trim() ? value.trim().replace(/\/+$/, '') : fallback

export const env = {
  apiUrl: orDefault(import.meta.env.VITE_API_URL, DEFAULT_API_URL),
  authUrl: orDefault(import.meta.env.VITE_AUTH_URL, DEFAULT_AUTH_URL),
} as const
