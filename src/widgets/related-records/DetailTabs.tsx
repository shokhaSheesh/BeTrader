import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { TabPanel, Tabs } from '@/shared/ui'

interface DetailTabsProps {
  /** The first tab is the record's own fields; the others list linked records */
  tabs: { value: string; label: string; content: ReactNode }[]
}

/**
 * Tabs of a detail page, like u-code's (Details · Project investors · Dividends…). The open tab
 * is kept in the address (`?tab=`), so Back from a linked record returns to the same tab.
 */
export function DetailTabs({ tabs }: DetailTabsProps) {
  const [params, setParams] = useSearchParams()
  const asked = params.get('tab')
  const value = tabs.some((t) => t.value === asked) ? asked! : tabs[0].value

  return (
    <Tabs
      value={value}
      onChange={(next) =>
        setParams(
          (p) => {
            if (next === tabs[0].value) p.delete('tab')
            else p.set('tab', next)
            return p
          },
          { replace: true },
        )
      }
      tabs={tabs.map(({ value, label }) => ({ value, label }))}
    >
      {tabs.map((t) => (
        <TabPanel key={t.value} value={t.value}>
          {t.content}
        </TabPanel>
      ))}
    </Tabs>
  )
}
