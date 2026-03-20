import { PanelLeftClose, PanelLeft, Keyboard, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useLayoutStore } from '@/stores/layout'
import OrgSwitcher from '@/components/layout/OrgSwitcher'
import GlobalSearch from '@/components/layout/GlobalSearch'
import NotificationCenter from '@/components/layout/NotificationCenter'
import UserMenu from '@/components/layout/UserMenu'
import { AIAssistant } from '@/components/assistant'

interface TopBarProps {
  onOpenHelp?: () => void
}

export default function TopBar({ onOpenHelp }: TopBarProps) {
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore()

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-neutral-100 bg-white px-4">
      {/* Left: Toggle + Org Switcher */}
      <div className="flex items-center gap-1">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 text-neutral-500 hover:text-neutral-700"
            >
              {sidebarCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {sidebarCollapsed ? '展开侧栏' : '收起侧栏'}
          </TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <OrgSwitcher />
      </div>

      {/* Center: Global Search */}
      <div className="ml-4 flex-1">
        <GlobalSearch />
      </div>

      {/* Right: Help + AI Assistant + Notifications + User */}
      <div className="ml-auto flex items-center gap-2">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenHelp}
              className="h-8 w-8 text-neutral-500 hover:text-neutral-700"
            >
              <Keyboard className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">快捷键帮助 (Shift+?)</TooltipContent>
        </Tooltip>

        {/* AI Assistant Trigger */}
        <AIAssistant
          trigger={
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 border-[#173F5F]/30 text-[#173F5F] hover:bg-[#173F5F]/5"
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">AI 助手</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">打开 AI 智能助手 (Cmd+Shift+A)</TooltipContent>
            </Tooltip>
          }
        />

        <NotificationCenter />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <UserMenu />
      </div>
    </header>
  )
}
