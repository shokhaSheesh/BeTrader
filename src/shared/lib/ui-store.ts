import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Per-browser UI preferences. Nothing here matters if it's lost (DESIGN.md: storage is a convenience). */
interface UiState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    { name: 'niyat-admin-ui' },
  ),
)
