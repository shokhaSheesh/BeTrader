import { useState } from 'react'
import { useInvestorOptions } from '../api/queries'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { Field, SearchSelect } from '@/shared/ui'

interface InvestorPickerFieldProps {
  label: string
  value: string
  onChange: (id: string) => void
  /** Name of the current investor, shown until the user picks another */
  initialLabel?: string
}

/** Form field: pick one investor out of 10k+, searched on the backend. */
export function InvestorPickerField({
  label,
  value,
  onChange,
  initialLabel,
}: InvestorPickerFieldProps) {
  const [search, setSearch] = useState('')
  const [selectedLabel, setSelectedLabel] = useState(initialLabel)
  const investors = useInvestorOptions(useDebouncedValue(search, 350))
  return (
    <Field label={label} htmlFor="investors_id">
      <SearchSelect
        id="investors_id"
        value={value || null}
        valueLabel={selectedLabel}
        onChange={(o) => {
          onChange(o.value)
          setSelectedLabel(o.label)
        }}
        options={investors.options}
        search={search}
        onSearchChange={setSearch}
        loading={investors.isFetching}
        placeholder="Search by name, phone or PINFL"
      />
    </Field>
  )
}
