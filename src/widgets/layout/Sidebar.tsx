import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { DropdownMenu as D } from 'radix-ui'
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import {
  NAVIGATION,
  type NavEntry,
  type NavGroupEntry,
  type NavLeaf,
} from '@/shared/config/navigation'
import { cn } from '@/shared/lib/cn'
import { useUiStore } from '@/shared/lib/ui-store'
import { usePermissions } from '@/shared/permissions'
import { Loader, Tooltip } from '@/shared/ui'
import { menuItem, popoverSurface } from '@/shared/ui/styles'
import { Logo } from './Logo'

const itemClass =
  'flex items-center gap-3 rounded-sm px-3 text-on-inverse-muted transition-colors hover:bg-inverse-hover hover:text-on-inverse focus-visible:outline-accent'
const activeClass =
  'aria-[current=page]:bg-inverse-hover aria-[current=page]:font-medium aria-[current=page]:text-accent'

/** The deepest nav item whose path is a prefix of the URL: /projects/abc → "Projects", /projects/types → "Project types". */
function activeItemPath(items: NavLeaf[], pathname: string) {
  return items
    .filter((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))
    .sort((a, b) => b.to.length - a.to.length)[0]?.to
}

export function Sidebar() {
  const permissions = usePermissions()
  // Only what the signed-in role may see (Menu API + table read rights); empty sections disappear.
  const navigation = NAVIGATION.flatMap<NavEntry>((entry) => {
    if (entry.kind === 'link') return permissions.canSee(entry.resource) ? [entry] : []
    const items = entry.items.filter((item) => permissions.canSee(item.resource))
    return items.length ? [{ ...entry, items }] : []
  })
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggle = useUiStore((s) => s.toggleSidebar)
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose

  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col bg-inverse transition-[width] duration-200',
        collapsed ? 'w-18' : 'w-64',
      )}
    >
      <div className={cn('flex h-16 shrink-0 items-center', collapsed ? 'justify-center' : 'px-6')}>
        <Logo compact={collapsed} />
      </div>
      <nav
        className={cn(
          'flex flex-1 flex-col gap-0.5 overflow-y-auto pb-4 [&>*]:shrink-0',
          collapsed ? 'items-center px-2' : 'px-3',
        )}
      >
        {permissions.isPending && (
          <div className="flex justify-center py-6">
            <Loader size={28} label="Loading menu" />
          </div>
        )}
        {navigation.map((entry) =>
          entry.kind === 'link' ? (
            collapsed ? (
              <Tooltip key={entry.to} content={entry.label}>
                <NavLink
                  to={entry.to}
                  aria-label={entry.label}
                  className={cn(itemClass, activeClass, 'size-10 justify-center px-0')}
                >
                  <entry.icon size={18} strokeWidth={1.75} />
                </NavLink>
              </Tooltip>
            ) : (
              <NavLink key={entry.to} to={entry.to} className={cn(itemClass, activeClass, 'h-10')}>
                <entry.icon size={18} strokeWidth={1.75} />
                {entry.label}
              </NavLink>
            )
          ) : collapsed ? (
            <CollapsedGroup key={entry.root} group={entry} />
          ) : (
            <SidebarGroup key={entry.root} group={entry} />
          ),
        )}
      </nav>
      <div
        className={cn(
          'shrink-0 border-t border-inverse-line p-3',
          collapsed && 'flex justify-center px-2',
        )}
      >
        {collapsed ? (
          <Tooltip content="Expand sidebar">
            <button
              type="button"
              onClick={toggle}
              aria-label="Expand sidebar"
              className={cn(itemClass, 'size-10 justify-center px-0')}
            >
              <ToggleIcon size={18} strokeWidth={1.75} />
            </button>
          </Tooltip>
        ) : (
          <button type="button" onClick={toggle} className={cn(itemClass, 'h-10 w-full')}>
            <ToggleIcon size={18} strokeWidth={1.75} />
            Collapse
          </button>
        )}
      </div>
    </aside>
  )
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
              className={cn(itemClass, activeClass, 'h-9')}
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

/** Collapsed: the section icon opens its pages in a flyout to the right. */
function CollapsedGroup({ group }: { group: NavGroupEntry }) {
  const { pathname } = useLocation()
  const activePath = activeItemPath(group.items, pathname)

  return (
    <D.Root modal={false}>
      <Tooltip content={group.label}>
        <D.Trigger
          aria-label={group.label}
          className={cn(
            itemClass,
            'size-10 justify-center px-0 data-[state=open]:bg-inverse-hover',
            activePath && 'bg-inverse-hover text-accent',
          )}
        >
          <group.icon size={18} strokeWidth={1.75} />
        </D.Trigger>
      </Tooltip>
      <D.Portal>
        <D.Content
          side="right"
          align="start"
          sideOffset={12}
          className={cn(popoverSurface, 'min-w-52')}
        >
          <D.Label className="px-2.5 py-1.5 text-xs font-medium text-fg-muted">
            {group.label}
          </D.Label>
          {group.items.map((item) => (
            <D.Item
              key={item.to}
              asChild
              className={cn(menuItem, item.to === activePath && 'font-medium')}
            >
              <Link to={item.to} aria-current={item.to === activePath ? 'page' : undefined}>
                <item.icon size={16} strokeWidth={1.75} />
                {item.label}
              </Link>
            </D.Item>
          ))}
        </D.Content>
      </D.Portal>
    </D.Root>
  )
}
