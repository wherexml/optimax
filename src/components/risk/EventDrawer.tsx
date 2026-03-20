import { useMemo } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
  MapPin,
  Link2,
  FileCheck,
  Bell,
  UserPlus,
  ArrowUpCircle,
  ExternalLink,
  Package,
  Truck,
  ShoppingCart,
  Globe,
  Users,
  Factory,
} from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Timeline, type TimelineItemData } from '@/components/common/Timeline'

import type { RiskEventListItem } from '@/types/event'
import type { ImpactObjectType } from '@/types/enums'
import {
  mockFullEvents,
  generateActivities,
  generateSources,
} from '@/mocks/data/events'

// ---------------------------------------------------------------------------
// Impact object icon
// ---------------------------------------------------------------------------

const impactIcons: Record<ImpactObjectType, React.ElementType> = {
  supplier: Truck,
  material: Package,
  order: ShoppingCart,
  region: Globe,
  customer: Users,
  site: Factory,
}

const impactTypeLabels: Record<ImpactObjectType, string> = {
  supplier: '供应商',
  material: '物料',
  order: '订单',
  region: '区域',
  customer: '客户',
  site: '站点',
}

// ---------------------------------------------------------------------------
// Risk type labels
// ---------------------------------------------------------------------------

const riskTypeLabels: Record<string, string> = {
  supply_disruption: '供应中断',
  quality_issue: '质量问题',
  compliance_violation: '合规违规',
  financial_risk: '财务风险',
  geopolitical: '地缘政治',
  natural_disaster: '自然灾害',
  cyber_security: '网络安全',
  regulatory_change: '法规变更',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface EventDrawerProps {
  /** The selected event (null = closed) */
  event: RiskEventListItem | null
  /** Close callback */
  onClose: () => void
}

export function EventDrawer({ event, onClose }: EventDrawerProps) {
  const fullEvent = event ? mockFullEvents[event.event_id] : null
  const activities = useMemo(
    () => (event ? generateActivities(event.event_id) : []),
    [event]
  )
  const sources = useMemo(
    () => (event ? generateSources(event.event_id) : []),
    [event]
  )

  const timelineItems: TimelineItemData[] = useMemo(
    () =>
      activities.map((a) => ({
        id: a.id,
        type: a.type,
        actor: { name: a.actor_name },
        time: format(new Date(a.timestamp), 'MM-dd HH:mm', { locale: zhCN }),
        description: a.description,
        fromState: a.before_value,
        toState: a.after_value,
      })),
    [activities]
  )

  // Mock impact quantification
  const impactOrders = fullEvent
    ? Math.max(1, fullEvent.impact_objects.filter((o) => o.type === 'order').length) * 12
    : 0
  const impactAmount = fullEvent
    ? `¥${(Math.random() * 500 + 50).toFixed(0)}万`
    : ''

  return (
    <Sheet open={!!event} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-[480px] max-w-full p-0 sm:max-w-[480px]"
      >
        {event && fullEvent && (
          <div className="flex h-full flex-col">
            {/* Header */}
            <SheetHeader className="space-y-3 border-b px-6 pb-4 pt-6">
              <div className="flex items-start gap-2">
                <SeverityBadge severity={event.severity} size="md" />
                <StatusBadge status={event.status} size="sm" />
              </div>
              <SheetTitle className="text-base leading-snug">
                {event.title}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-3 text-xs">
                <span>
                  {riskTypeLabels[event.type] ?? event.type}
                </span>
                <span>|</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {fullEvent.region}
                </span>
                <span>|</span>
                <span>
                  {format(new Date(event.occurred_at), 'yyyy-MM-dd HH:mm', {
                    locale: zhCN,
                  })}
                </span>
              </SheetDescription>
            </SheetHeader>

            {/* Scrollable body */}
            <ScrollArea className="flex-1">
              <div className="space-y-6 px-6 py-5">
                {/* AI Summary */}
                {fullEvent.ai_summary && (
                  <section>
                    <h3 className="mb-2 text-sm font-semibold text-foreground">
                      来源摘要
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {fullEvent.ai_summary}
                    </p>
                    {sources.length > 0 && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {sources[0].excerpt}
                      </p>
                    )}
                  </section>
                )}

                <Separator />

                {/* Related objects */}
                <section>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">
                    关联对象
                  </h3>
                  <div className="space-y-2">
                    {fullEvent.impact_objects.map((obj, i) => {
                      const Icon = impactIcons[obj.type] ?? Package
                      return (
                        <div
                          key={`${obj.id}-${i}`}
                          className="flex items-center gap-2 rounded-md border px-3 py-2"
                        >
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="text-[11px]">
                            {impactTypeLabels[obj.type]}
                          </Badge>
                          <span className="flex-1 truncate text-sm">
                            {obj.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {obj.confidence}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </section>

                <Separator />

                {/* Impact quantification */}
                <section>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">
                    影响量化
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-md border px-3 py-2">
                      <div className="text-xs text-muted-foreground">
                        影响订单数
                      </div>
                      <div className="mt-1 text-lg font-semibold tabular-nums">
                        {impactOrders}
                      </div>
                    </div>
                    <div className="rounded-md border px-3 py-2">
                      <div className="text-xs text-muted-foreground">
                        预估影响金额
                      </div>
                      <div className="mt-1 text-lg font-semibold tabular-nums">
                        {impactAmount}
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Recommended actions */}
                <section>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">
                    推荐动作
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Link2 className="mr-1 h-4 w-4" />
                      确认映射
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileCheck className="mr-1 h-4 w-4" />
                      建案
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bell className="mr-1 h-4 w-4" />
                      订阅
                    </Button>
                  </div>
                </section>

                <Separator />

                {/* Activity log */}
                <section>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">
                    操作日志
                  </h3>
                  <Timeline items={timelineItems} />
                </section>
              </div>
            </ScrollArea>

            {/* Footer actions */}
            <SheetFooter className="flex-row gap-2 border-t px-6 py-4">
              <Button variant="outline" size="sm" className="flex-1">
                <UserPlus className="mr-1 h-4 w-4" />
                指派
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <ArrowUpCircle className="mr-1 h-4 w-4" />
                升级
              </Button>
              <Button size="sm" className="flex-1">
                <ExternalLink className="mr-1 h-4 w-4" />
                详情页
              </Button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
