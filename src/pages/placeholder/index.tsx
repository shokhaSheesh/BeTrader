// Stand-in for sections that aren't built yet. Delete once every route has a real page.
export default function PlaceholderPage({ title }: { title: string }) {
  return <h1 className="text-xl font-semibold">{title}</h1>
}
