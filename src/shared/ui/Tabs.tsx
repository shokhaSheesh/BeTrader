import type { ReactNode } from 'react'
import { Tabs as T } from 'radix-ui'

interface TabsProps {
  value: string
  onChange: (value: string) => void
  tabs: { value: string; label: string }[]
  children: ReactNode
}

/** Segmented tabs (custom, keyboard-accessible via Radix). Panels are `TabPanel`s. */
export function Tabs({ value, onChange, tabs, children }: TabsProps) {
  return (
    <T.Root value={value} onValueChange={onChange}>
      <T.List className="mb-6 inline-flex rounded-full bg-surface p-1">
        {tabs.map((t) => (
          <T.Trigger
            key={t.value}
            value={t.value}
            className="h-9 rounded-full px-4 font-medium text-fg-muted transition-colors hover:text-fg data-[state=active]:bg-inverse data-[state=active]:text-on-inverse"
          >
            {t.label}
          </T.Trigger>
        ))}
      </T.List>
      {children}
    </T.Root>
  )
}

export function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  return (
    <T.Content value={value} className="outline-none">
      {children}
    </T.Content>
  )
}
