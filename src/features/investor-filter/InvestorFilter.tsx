import { useState } from 'react'
import { useInvestorOptions, useInvestorQuery } from '@/entities/investor'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { investorLabel } from '@/shared/lib/format'
import { FilterSearchSelect } from '@/shared/ui'

/** "Investor: …" filter for tables linked to investors. Search runs on the backend. */
export function InvestorFilter({
  value,
  onChange,
}: {
  value: string | null
  onChange: (id: string | null) => void
}) {
  const [search, setSearch] = useState('')
  const options = useInvestorOptions(useDebouncedValue(search, 350))
  // The URL only has the id, so fetch the selected investor for its name.
  const selected = useInvestorQuery(value ?? undefined)
  return (
    <FilterSearchSelect
      label="Investor"
      value={value}
      valueLabel={
        selected.data ? investorLabel(selected.data.fullName, selected.data.phone) : undefined
      }
      onChange={onChange}
      options={options.options}
      search={search}
      onSearchChange={setSearch}
      loading={options.isFetching}
      placeholder="Name, phone or PINFL"
    />
  )
}
