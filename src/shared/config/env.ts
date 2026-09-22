export const env = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  authUrl: import.meta.env.VITE_AUTH_URL as string,
} as const
