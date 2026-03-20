import {
  FileCheck2,
  Repeat2,
  Truck,
  Bell,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RecommendedAction {
  id: string
  title: string
  description: string
  icon: React.ElementType
  needsApproval: boolean
  confidence: number
  actionLabel: string
  actionType: 'case' | 'approval' | 'navigate' | 'notify'
}

interface RecommendedActionsProps {
  eventSeverity: string
  className?: string
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockActions: RecommendedAction[] = [
  {
    id: 'act-1',
    title: '创建应急响应 Case',
    description: '基于当前风险等级和影响范围，建议立即创建应急响应案例，统一协调各方资源进行处置。',
    icon: FileCheck2,
    needsApproval: false,
    confidence: 95,
    actionLabel: '创建 Case',
    actionType: 'case',
  },
  {
    id: 'act-2',
    title: '启动替代供应商评估',
    description: '系统已识别 3 家潜在替代供应商，建议发起商务评估流程，确保供应链连续性。',
    icon: Repeat2,
    needsApproval: true,
    confidence: 88,
    actionLabel: '发起审批',
    actionType: 'approval',
  },
  {
    id: 'act-3',
    title: '执行库存调拨方案',
    description: '将苏州仓库冗余库存调拨至受影响产线，预计可覆盖 5 天额外需求。',
    icon: Truck,
    needsApproval: true,
    confidence: 82,
    actionLabel: '跳转优化中心',
    actionType: 'navigate',
  },
  {
    id: 'act-4',
    title: '通知相关责任人',
    description: '向采购经理、供应链总监及相关业务线负责人发送风险预警通知。',
    icon: Bell,
    needsApproval: false,
    confidence: 92,
    actionLabel: '立即通知',
    actionType: 'notify',
  },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RecommendedActions({ eventSeverity, className }: RecommendedActionsProps) {
  const handleAction = (action: RecommendedAction) => {
    switch (action.actionType) {
      case 'case':
        toast.success('Case 创建成功', { description: 'CASE-2026-0042 已创建' })
        break
      case 'approval':
        toast.info('审批已发起', { description: '等待供应链总监审批...' })
        break
      case 'navigate':
        toast.info('即将跳转', { description: '正在跳转到优化中心...' })
        break
      case 'notify':
        toast.success('通知已发送', { description: '已通知 3 位相关责任人' })
        break
    }
  }

  const handleEscalate = () => {
    toast.warning('已升级到 War Room', {
      description: '正在创建紧急作战室...',
    })
  }

  const showEscalate = eventSeverity === 'critical' || eventSeverity === 'high'

  return (
    <div className={cn('space-y-4', className)}>
      {/* Escalate banner */}
      {showEscalate && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-900">
                高风险事件 - 建议升级到 War Room
              </p>
              <p className="text-xs text-red-700 mt-0.5">
                当前事件风险等级较高，建议创建作战室进行集中处置
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleEscalate}
          >
            一键升级
          </Button>
        </div>
      )}

      {/* Actions list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-violet-500" />
            系统推荐动作
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            基于 AI 分析，以下是建议的处置措施
          </p>
        </CardHeader>
        <CardContent className="space-y-0">
          {mockActions.map((action, idx) => {
            const Icon = action.icon

            return (
              <div key={action.id}>
                {idx > 0 && <Separator className="my-3" />}
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-4.5 w-4.5 text-muted-foreground" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{action.title}</span>
                      {action.needsApproval && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-orange-200 text-orange-700 bg-orange-50">
                          <ShieldCheck className="mr-0.5 h-3 w-3" />
                          需审批
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        置信度 {action.confidence}%
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {action.description}
                    </p>
                  </div>

                  {/* Action button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 mt-0.5"
                    onClick={() => handleAction(action)}
                  >
                    {action.actionLabel}
                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
