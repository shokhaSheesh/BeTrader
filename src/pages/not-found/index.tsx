import { Link } from 'react-router'
import { ROUTES } from '@/shared/config/routes'
import { useT } from '@/shared/i18n'

export default function NotFoundPage() {
  const t = useT()
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-semibold">{t('Page not found')}</h1>
      <p className="text-fg-muted">
        {t("The page you're looking for doesn't exist or was moved.")}
      </p>
      <Link
        to={ROUTES.dashboard}
        className="flex h-10 items-center rounded-full bg-accent px-5 font-medium text-on-accent transition-colors hover:bg-accent-hover"
      >
        {t('Back to dashboard')}
      </Link>
    </div>
  )
}
