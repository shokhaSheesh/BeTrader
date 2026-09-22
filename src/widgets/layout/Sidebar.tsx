import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { ChevronDown } from 'lucide-react'
import { NAVIGATION, type NavGroupEntry, type NavLeaf } from '@/shared/config/navigation'
import { cn } from '@/shared/lib/cn'
import { Logo } from './Logo'

const itemClass =
  'flex items-center gap-3 rounded-sm px-3 text-on-inverse-muted transition-colors hover:bg-inverse-hover hover:text-on-inverse focus-visible:outline-accent'

export function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-inverse">
      <div className="flex h-16 shrink-0 items-center px-6">
        <Logo />
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-4">
        {NAVIGATION.map((entry) =>
          entry.kind === 'link' ? (
            <NavLink
              key={entry.to}
              to={entry.to}
              className={cn(
                itemClass,
                'h-10 aria-[current=page]:bg-inverse-hover aria-[current=page]:font-medium aria-[current=page]:text-accent',
              )}
            >
              <entry.icon size={18} strokeWidth={1.75} />
              {entry.label}
            </NavLink>
          ) : (
            <SidebarGroup key={entry.root} group={entry} />
          ),
        )}
      </nav>
    </aside>
  )
}

/** The deepest nav item whose path is a prefix of the URL: /projects/abc → "Projects", /projects/types → "Project types". */
function activeItemPath(items: NavLeaf[], pathname: string) {
  return items
    .filter((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))
    .sort((a, b) => b.to.length - a.to.length)[0]?.to
}

function SidebarGroup({ group }: { group: NavGroupEntry }) {
  const { pathname } = useLocation()
  const activePath = activeItemPath(group.items, pathname)
  const containsActive = activePath !== undefined
  // null = follow the active route; boolean = the user toggled it explicitly.
  const [toggled, setToggled] = useState<boolean | null>(null)
  const open = toggled ?? containsActive

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setToggled(!open)}
        className={cn(itemClass, 'h-10 w-full text-left', containsActive && 'text-on-inverse')}
      >
        <group.icon size={18} strokeWidth={1.75} className={cn(containsActive && 'text-accent')} />
        <span className="flex-1">{group.label}</span>
        <ChevronDown
          size={16}
          className={cn('transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-0.5 py-1 pl-4">
          {group.items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              aria-current={item.to === activePath ? 'page' : undefined}
              className={cn(
                itemClass,
                'h-9 aria-[current=page]:bg-inverse-hover aria-[current=page]:font-medium aria-[current=page]:text-accent',
              )}
            >
              <item.icon size={16} strokeWidth={1.75} />
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
