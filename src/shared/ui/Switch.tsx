import { Switch as S } from 'radix-ui'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  id?: string
  disabled?: boolean
}

/** On = lime track with an ink thumb, like the app's toggles. */
export function Switch({ checked, onChange, id, disabled }: SwitchProps) {
  return (
    <S.Root
      id={id}
      checked={checked}
      onCheckedChange={onChange}
      disabled={disabled}
      className="relative h-6 w-10 shrink-0 rounded-full bg-line-strong transition-colors data-[state=checked]:bg-accent disabled:opacity-50"
    >
      <S.Thumb className="block size-5 translate-x-0.5 rounded-full bg-surface transition-transform data-[state=checked]:translate-x-4.5 data-[state=checked]:bg-inverse" />
    </S.Root>
  )
}
