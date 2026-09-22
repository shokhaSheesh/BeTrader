import { Link } from 'react-router'
import { ROUTES } from '@/shared/config/routes'

export default function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">404 — Page not found</h1>
      <Link to={ROUTES.dashboard}>Back to dashboard</Link>
    </div>
  )
}
