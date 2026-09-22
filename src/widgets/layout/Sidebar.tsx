import { NavLink } from 'react-router'
import { NAV_ITEMS } from './nav'

// Unstyled skeleton — visual treatment comes from docs/DESIGN.md.
export function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-1 p-4">
      <div className="mb-6 px-3 text-xl font-semibold">Niyat</div>
      {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
        <NavLink key={to} to={to} className="flex items-center gap-3 rounded-lg px-3 py-2">
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </aside>
  )
}
