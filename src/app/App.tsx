import { RouterProvider } from 'react-router'
import { GlobalProgress, Toaster } from '@/shared/ui'
import { AppProviders } from './providers'
import { router } from './router'

export function App() {
  return (
    <AppProviders>
      <GlobalProgress />
      <RouterProvider router={router} />
      <Toaster />
    </AppProviders>
  )
}
