import { Search, X } from 'lucide-react'
import { useT } from '@/shared/i18n'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  const t = useT()
  return (
    <div className="relative w-72">
      <Search
        size={16}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-muted"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t('Search')}
        className="h-10 w-full rounded-sm border border-transparent bg-surface px-9 outline-none placeholder:text-fg-subtle focus:border-focus [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={t('Clear search')}
          className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-fg-muted hover:bg-surface-muted hover:text-fg"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
