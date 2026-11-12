import { useT } from '@/shared/i18n'

// Stand-in for sections that aren't built yet. Delete once every route has a real page.
// The title is a navigation label (English), so it goes through the dictionary.
export default function PlaceholderPage({ title }: { title: string }) {
  const t = useT()
  return <h1 className="text-xl font-semibold">{t(title)}</h1>
}
