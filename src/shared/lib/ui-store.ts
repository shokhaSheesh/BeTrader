import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Per-browser UI preferences. Nothing here matters if it's lost (DESIGN.md: storage is a convenience). */
export type Language = 'en' | 'ru' | 'uz'

interface UiState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  /** Interface language. Only English has translations so far (the others are listed as "Soon"). */
  language: Language
  setLanguage: (language: Language) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    { name: 'niyat-admin-ui' },
  ),
)
