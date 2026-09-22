import { useId } from 'react'
import { Switch } from './Switch'

interface SwitchFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function SwitchField({ label, checked, onChange }: SwitchFieldProps) {
  const id = useId()
  return (
    <div className="flex h-11 items-center justify-between gap-3 self-end rounded-sm bg-surface-muted px-3">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <Switch id={id} checked={checked} onChange={onChange} />
    </div>
  )
}
