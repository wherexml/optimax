import { useCallback, useMemo, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'
import { navigationItems, type NavItem } from '@/config/navigation'

export default function Sidebar() {
  const collapsed = useLayoutStore((s) => s.sidebarCollapsed)
  const router = useRouter()
  const currentPath = router.state.location.pathname
  const user = useAuthStore((s) => s.user)

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-neutral-100 bg-white transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-neutral-100 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
          O
        </div>
        {!collapsed && (
          <span className="whitespace-nowrap text-base font-semibold text-brand-500">
            OptiMax
          </span>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-2">
        <nav className="flex flex-col gap-0.5 px-2">
          {navigationItems.map((item) => (
            <NavEntry
              key={item.label}
              item={item}
              collapsed={collapsed}
              currentPath={currentPath}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="shrink-0">
        <Separator />
        <div
          className={cn(
            'flex items-center gap-2 px-4 py-3',
            collapsed && 'justify-center px-0',
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-brand-100 text-xs text-brand-600">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-neutral-800">
                {user?.name ?? '用户'}
              </span>
              <span className="text-[10px] text-neutral-400">
                OptiMax v1.0
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

// ---- Nav Entry (handles both single items and groups) ----

function NavEntry({
  item,
  collapsed,
  currentPath,
}: {
  item: NavItem
  collapsed: boolean
  currentPath: string
}) {
  const router = useRouter()
  const hasChildren = !!item.children?.length

  const isActive = useMemo(() => {
    if (item.path) {
      return item.path === '/'
        ? currentPath === '/'
        : currentPath.startsWith(item.path)
    }
    return item.children?.some((c) => currentPath.startsWith(c.path)) ?? false
  }, [item, currentPath])

  const [expanded, setExpanded] = useState(isActive && hasChildren)

  const handleClick = useCallback(() => {
    if (hasChildren) {
      setExpanded((prev) => !prev)
    } else if (item.path) {
      router.navigate({ to: item.path })
    }
  }, [hasChildren, item.path, router])

  const Icon = item.icon

  const button = (
    <button
      onClick={handleClick}
      className={cn(
        'group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        'hover:bg-neutral-50',
        isActive && !hasChildren
          ? 'bg-brand-50 text-brand-500'
          : 'text-neutral-600',
        isActive && hasChildren && 'text-brand-500',
      )}
    >
      {/* Active indicator bar */}
      {isActive && !hasChildren && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand-500" />
      )}
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate text-left">{item.label}</span>
          {hasChildren && (
            <span className="text-neutral-400 transition-transform duration-200">
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
          )}
        </>
      )}
    </button>
  )

  return (
    <div>
      {collapsed ? (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {item.label}
          </TooltipContent>
        </Tooltip>
      ) : (
        button
      )}

      {/* Children */}
      {hasChildren && !collapsed && (
        <div
          className={cn(
            'overflow-hidden transition-all duration-200 ease-in-out',
            expanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          <div className="ml-5 flex flex-col gap-0.5 border-l border-neutral-200 py-1 pl-4">
            {item.children!.map((child) => {
              const childActive = currentPath.startsWith(child.path)
              return (
                <button
                  key={child.path}
                  onClick={() => router.navigate({ to: child.path })}
                  className={cn(
                    'relative rounded-md px-3 py-1.5 text-left text-sm transition-colors',
                    'hover:bg-neutral-50',
                    childActive
                      ? 'font-medium text-brand-500'
                      : 'text-neutral-500',
                  )}
                >
                  {childActive && (
                    <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-brand-500" />
                  )}
                  {child.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
