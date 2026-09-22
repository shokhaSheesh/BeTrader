import { DropdownMenu as D } from 'radix-ui'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useUiStore, type Language } from '@/shared/lib/ui-store'
import { Badge } from '@/shared/ui'
import { menuItem, popoverSurface } from '@/shared/ui/styles'

const LANGUAGES: { code: Language; label: string; ready: boolean }[] = [
  { code: 'en', label: 'English', ready: true },
  // Listed so the switch is discoverable; enabled once their translations exist.
  { code: 'ru', label: 'Русский', ready: false },
  { code: 'uz', label: 'O‘zbek', ready: false },
]

export function LanguageMenu() {
  const language = useUiStore((s) => s.language)
  const setLanguage = useUiStore((s) => s.setLanguage)

  return (
    <D.Root modal={false}>
      <D.Trigger
        aria-label="Language"
        className="flex h-10 items-center gap-2 rounded-full px-3 font-medium text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg data-[state=open]:bg-surface-muted data-[state=open]:text-fg"
      >
        <Globe size={18} strokeWidth={1.75} />
        <span className="uppercase">{language}</span>
        <ChevronDown size={14} />
      </D.Trigger>
      <D.Portal>
        <D.Content align="end" sideOffset={8} className={cn(popoverSurface, 'min-w-48')}>
          {LANGUAGES.map((l) => (
            <D.Item
              key={l.code}
              disabled={!l.ready}
              onSelect={() => setLanguage(l.code)}
              className={cn(menuItem, 'justify-between')}
            >
              {l.label}
              {l.ready ? language === l.code && <Check size={16} /> : <Badge>Soon</Badge>}
            </D.Item>
          ))}
        </D.Content>
      </D.Portal>
    </D.Root>
  )
}
