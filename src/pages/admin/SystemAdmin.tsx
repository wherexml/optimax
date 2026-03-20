import { Outlet, Link, useMatches } from '@tanstack/react-router'
import {
  Building2,
  Database,
  Bell,
  Clock,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Sidebar menu items
// ---------------------------------------------------------------------------

const adminMenuItems = [
  {
    path: '/admin/org-roles',
    label: '组织与角色',
    icon: Building2,
  },
  {
    path: '/admin/data-sources',
    label: '数据源',
    icon: Database,
  },
  {
    path: '/admin/subscriptions',
    label: '订阅配置',
    icon: Bell,
  },
  {
    path: '/admin/sla',
    label: 'SLA 配置',
    icon: Clock,
  },
  {
    path: '/admin/audit',
    label: '审计日志',
    icon: FileText,
  },
]

// ---------------------------------------------------------------------------
// SystemAdmin Layout
// ---------------------------------------------------------------------------

export default function SystemAdmin() {
  const matches = useMatches()
  const currentPath = matches[matches.length - 1]?.pathname ?? ''

  return (
    <div className="flex h-full">
      {/* Left sidebar */}
      <aside className="w-56 shrink-0 border-r bg-gray-50/50">
        <div className="p-6 pb-4">
          <h1 className="text-lg font-bold text-gray-900">系统管理</h1>
          <p className="mt-1 text-xs text-gray-500">
            系统配置与维护
          </p>
        </div>
        <nav className="space-y-1 px-3">
          {adminMenuItems.map((item) => {
            const isActive = currentPath === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:bg-white/60 hover:text-gray-900',
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4',
                    isActive ? 'text-blue-600' : 'text-gray-400',
                  )}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Right content area */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
