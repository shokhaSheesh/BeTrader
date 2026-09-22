import { create } from 'zustand'

export type ToastTone = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  tone: ToastTone
  title: string
  description?: string
}

interface ToastState {
  toasts: ToastItem[]
  dismiss: (id: number) => void
}

let nextId = 1

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

function push(tone: ToastTone, title: string, description?: string) {
  const id = nextId++
  useToastStore.setState((s) => ({ toasts: [...s.toasts, { id, tone, title, description }] }))
  setTimeout(() => useToastStore.getState().dismiss(id), 5000)
}

export const toast = {
  success: (title: string, description?: string) => push('success', title, description),
  error: (title: string, description?: string) => push('error', title, description),
  info: (title: string, description?: string) => push('info', title, description),
}
