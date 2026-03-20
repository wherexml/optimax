import { TooltipProvider } from '@/components/ui/tooltip'
import { useLayoutStore } from '@/stores/layout'
import { useHotkeys } from '@/hooks/useHotkeys'
import { useResponsive } from '@/hooks/useResponsive'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import ContentArea from '@/components/layout/ContentArea'
import { ShortcutHelpModal } from '@/components/common/ShortcutHelpModal'
import { cn } from '@/lib/utils'

export default function AppShell() {
  const collapsed = useLayoutStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useLayoutStore((s) => s.setSidebarCollapsed)
  const navigate = useNavigate()
  const responsive = useResponsive()
  const [helpOpen, setHelpOpen] = useState(false)

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    if (responsive.shouldCollapseSidebar && !collapsed) {
      setSidebarCollapsed(true)
    } else if (!responsive.shouldCollapseSidebar && collapsed) {
      setSidebarCollapsed(false)
    }
  }, [responsive.shouldCollapseSidebar, setSidebarCollapsed])

  // Register global shortcuts
  useHotkeys({
    shortcuts: [
      // Global shortcuts
      {
        combo: 'alt+n',
        handler: () => {
          // Open notification center - this would need a global state or event
          // For now, we'll just navigate to a relevant page
          navigate({ to: '/' })
        },
        description: '消息中心',
        category: 'global',
      },
      {
        combo: 'alt+h',
        handler: () => {
          navigate({ to: '/' })
        },
        description: '返回首页',
        category: 'global',
      },
      {
        combo: 'shift+?',
        handler: () => {
          setHelpOpen(true)
        },
        description: '快捷键帮助',
        category: 'global',
      },
      // Navigation shortcuts
      {
        combo: 'alt+w',
        handler: () => {
          navigate({ to: '/risk/workbench' })
        },
        description: '跳转到工作台',
        category: 'navigation',
      },
      {
        combo: 'alt+m',
        handler: () => {
          navigate({ to: '/map' })
        },
        description: '跳转到风险地图',
        category: 'navigation',
      },
      {
        combo: 'alt+r',
        handler: () => {
          navigate({ to: '/reports' })
        },
        description: '跳转到报告中心',
        category: 'navigation',
      },
    ],
  })

  return (
    <TooltipProvider>
      <div className={cn(
        'flex h-screen overflow-hidden bg-neutral-50',
        'min-w-[1280px]' // FE-153: Minimum width constraint
      )}>
        {/* Sidebar */}
        <div
          className={cn(
            'shrink-0 transition-all duration-300 ease-in-out',
            collapsed ? 'w-16' : 'w-60',
          )}
        >
          <Sidebar />
        </div>

        {/* Main area */}
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onOpenHelp={() => setHelpOpen(true)} />
          <div className="flex-1 overflow-hidden">
            <ContentArea />
          </div>
        </div>
      </div>
      {/* Shortcut Help Modal - Global */}
      <ShortcutHelpModal open={helpOpen} onOpenChange={setHelpOpen} />
    </TooltipProvider>
  )
}
