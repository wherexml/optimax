import { TooltipProvider } from '@/components/ui/tooltip'
import { useLayoutStore } from '@/stores/layout'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import ContentArea from '@/components/layout/ContentArea'
import { cn } from '@/lib/utils'

export default function AppShell() {
  const collapsed = useLayoutStore((s) => s.sidebarCollapsed)

  return (
    <TooltipProvider>
      <div className="flex h-screen min-w-[1280px] overflow-hidden bg-neutral-50">
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
          <TopBar />
          <div className="flex-1 overflow-hidden">
            <ContentArea />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
