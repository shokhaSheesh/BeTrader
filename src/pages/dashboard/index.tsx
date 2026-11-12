import { ExternalLink } from 'lucide-react'
import { DASHBOARDS } from '@/shared/config/dashboards'
import { MOCK_MODE } from '@/shared/config/mock'
import { Button, PageHeader } from '@/shared/ui'
import { EmbeddedDashboard } from '@/widgets/embedded-dashboard'
import { NativeDashboard } from './NativeDashboard'

/**
 * The analysts' Yandex DataLens dashboard, as u-code's Dashboard shows it.
 *
 * Unlike Metabase, a public DataLens link ignores URL parameters: its filters live in
 * a server-side state, so our period filter can't drive it. The dashboard's own date
 * picker and tabs, inside the frame, do the filtering (docs/DASHBOARDS.md).
 */
/** Demo mode draws the dashboard natively from the mock backend; the real backend keeps the DataLens embed. */
export default function DashboardPage() {
  return MOCK_MODE ? <NativeDashboard /> : <DataLensDashboard />
}

function DataLensDashboard() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Investors, deposits, investments and dividends. Pick the period and tab inside the dashboard."
        actions={
          <Button
            variant="secondary"
            icon={ExternalLink}
            onClick={() => window.open(DASHBOARDS.overview, '_blank', 'noopener,noreferrer')}
          >
            Open full screen
          </Button>
        }
      />
      <EmbeddedDashboard src={DASHBOARDS.overview} title="Niyat overview dashboard" noFilters />
    </>
  )
}
