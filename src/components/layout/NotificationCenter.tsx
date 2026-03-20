import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  ClipboardCheck,
  FileText,
  Monitor,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  notifications as mockNotifications,
  type MockNotification,
} from '@/mocks/data/notifications'
import type { NotificationType } from '@/types/enums'

// ---------------------------------------------------------------------------
// Tab config
// ---------------------------------------------------------------------------

type TabValue = 'all' | NotificationType

interface TabConfig {
  value: TabValue
  label: string
  icon: React.ElementType
}

const TABS: TabConfig[] = [
  { value: 'all', label: '全部', icon: Bell },
  { value: 'alert', label: '预警', icon: AlertTriangle },
  { value: 'approval', label: '审批', icon: ClipboardCheck },
  { value: 'system', label: '系统', icon: Monitor },
  { value: 'report', label: '报告', icon: FileText },
]

const TYPE_ICON: Record<NotificationType, React.ElementType> = {
  alert: AlertTriangle,
  approval: ClipboardCheck,
  system: Monitor,
  report: FileText,
}

const TYPE_COLOR: Record<NotificationType, string> = {
  alert: 'text-amber-500',
  approval: 'text-blue-500',
  system: 'text-neutral-500',
  report: 'text-emerald-500',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin}分钟前`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}小时前`
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 7) return `${diffDay}天前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<MockNotification[]>(() => [
    ...mockNotifications,
  ])
  const [activeTab, setActiveTab] = useState<TabValue>('all')
  const navigate = useNavigate()

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items],
  )

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return items
    return items.filter((n) => n.type === activeTab)
  }, [items, activeTab])

  const markAsRead = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const handleItemClick = useCallback(
    (item: MockNotification) => {
      markAsRead(item.id)
      if (item.actionUrl) {
        setOpen(false)
        navigate({ to: item.actionUrl })
      }
    },
    [markAsRead, navigate],
  )

  return (
    <>
      {/* Bell trigger */}
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 text-neutral-500 hover:text-neutral-700"
            onClick={() => setOpen(true)}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">通知</TooltipContent>
      </Tooltip>

      {/* Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
          <SheetHeader className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-semibold">
                消息中心
              </SheetTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-7 gap-1.5 text-xs text-neutral-500 hover:text-neutral-700"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  全部标为已读
                </Button>
              )}
            </div>
            <SheetDescription className="sr-only">
              查看和管理系统通知消息
            </SheetDescription>
          </SheetHeader>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabValue)}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="border-b px-4">
              <TabsList className="h-9 w-full justify-start rounded-none bg-transparent p-0">
                {TABS.map((tab) => {
                  const tabUnread =
                    tab.value === 'all'
                      ? unreadCount
                      : items.filter(
                          (n) => n.type === tab.value && !n.read,
                        ).length
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="relative rounded-none border-b-2 border-transparent px-3 py-2 text-xs font-medium data-[state=active]:border-brand-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      {tab.label}
                      {tabUnread > 0 && (
                        <Badge
                          variant="destructive"
                          className="ml-1.5 h-4 min-w-4 px-1 text-[10px]"
                        >
                          {tabUnread}
                        </Badge>
                      )}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>

            {TABS.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="mt-0 flex-1 overflow-hidden"
              >
                <ScrollArea className="h-full">
                  <div className="divide-y">
                    {filteredItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
                        <Bell className="mb-2 h-8 w-8" />
                        <span className="text-sm">暂无消息</span>
                      </div>
                    ) : (
                      filteredItems.map((item) => {
                        const Icon = TYPE_ICON[item.type]
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={cn(
                              'flex w-full gap-3 px-6 py-4 text-left transition-colors hover:bg-neutral-50',
                              !item.read && 'bg-blue-50/50',
                            )}
                          >
                            <div
                              className={cn(
                                'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                                !item.read
                                  ? 'bg-white shadow-sm ring-1 ring-neutral-100'
                                  : 'bg-neutral-100',
                              )}
                            >
                              <Icon
                                className={cn(
                                  'h-4 w-4',
                                  TYPE_COLOR[item.type],
                                )}
                              />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className={cn(
                                    'truncate text-sm',
                                    !item.read
                                      ? 'font-semibold text-neutral-900'
                                      : 'font-medium text-neutral-700',
                                  )}
                                >
                                  {item.title}
                                </p>
                                {!item.read && (
                                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                                )}
                              </div>
                              <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">
                                {item.message}
                              </p>
                              <p className="mt-1 text-xs text-neutral-400">
                                {timeAgo(item.createdAt)}
                              </p>
                            </div>
                          </button>
                        )
                      })
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  )
}
