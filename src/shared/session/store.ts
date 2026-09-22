import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Session {
  accessToken: string
  refreshToken: string
  /** ISO date. Login tokens live 30 days, refreshed ones 24 hours. */
  expiresAt: string
  environmentId: string
  resourceId: string
  login: string
  /** The signed-in user's role and project: permissions are looked up by these */
  roleId: string
  projectId: string
}

interface SessionState {
  session: Session | null
  setSession: (session: Session) => void
  logout: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      logout: () => set({ session: null }),
    }),
    {
      name: 'niyat-admin-auth',
      version: 2,
      // v1 sessions have no role: sign in again so permissions can be loaded.
      migrate: () => ({ session: null }) as unknown as SessionState,
    },
  ),
)

/** An expired access token is fine: the http client refreshes it before the next request. */
export const useIsAuthenticated = () => useSessionStore((s) => s.session !== null)
