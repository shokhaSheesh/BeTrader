import { ExternalLink } from 'lucide-react'
import { DASHBOARDS, metabaseUrl } from '@/shared/config/dashboards'
import { useListParams } from '@/shared/hooks/useListParams'
import { Button, DateRangeFilter, FilterBar, PageHeader } from '@/shared/ui'
import { EmbeddedDashboard } from '@/widgets/embedded-dashboard'

const TITLE = 'Dividends per investor'

export default function AnalyticsDividendsPage() {
  const list = useListParams(['from', 'to'])
  const range = { from: list.filter('from'), to: list.filter('to') }
  const src = metabaseUrl(DASHBOARDS.dividends, range)

  return (
    <>
      <PageHeader
        title="Dividends analytics"
        description="Dividends, taxable base and tax withheld per investor."
        actions={
          <Button
            variant="secondary"
            icon={ExternalLink}
            onClick={() => window.open(src, '_blank', 'noopener,noreferrer')}
          >
            Open full screen
          </Button>
        }
      />

      <FilterBar active={list.hasFilters} onReset={list.resetAll}>
        <DateRangeFilter
          label="Period"
          from={range.from}
          to={range.to}
          onChange={({ from, to }) => list.setFilters({ from, to })}
        />
      </FilterBar>

      <EmbeddedDashboard src={src} title={TITLE} />
    </>
  )
}
