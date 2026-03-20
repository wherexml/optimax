/**
 * War Room - Solution Comparison Component
 *
 * FE-072: 推荐方案与备选方案对比
 * - 推荐方案卡片高亮显示
 * - 备选方案列表
 * - 对比维度表格
 * - 操作：采纳、提交审批、退回
 */

import { useMemo, useState } from 'react'
import {
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  ThumbsUp,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import type { Solution, ConstraintConflict } from '@/types/solution'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SolutionComparisonProps {
  solutions: Solution[]
  caseId: string
  onSolutionApprove?: (solutionId: string) => void
  onSolutionReject?: (solutionId: string, reason: string) => void
  onSolutionAbandon?: (solutionId: string, reason: string) => void
  className?: string
}

// ---------------------------------------------------------------------------
// Cost Impact Display
// ---------------------------------------------------------------------------

function CostImpactDisplay({
  amount,
  percentage,
  currency,
}: {
  amount: number
  percentage: number
  currency: string
}) {
  const isPositive = amount > 0
  const formattedAmount =
    amount >= 1000000
      ? `${(amount / 1000000).toFixed(2)}M`
      : amount >= 1000
        ? `${(amount / 1000).toFixed(1)}K`
        : amount.toString()

  const currencySymbol = currency === 'CNY' ? '¥' : currency

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-1 rounded text-sm font-medium',
          isPositive
            ? 'bg-red-50 text-red-700'
            : 'bg-green-50 text-green-700'
        )}
      >
        {isPositive ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
        <span>
          {isPositive ? '+' : ''}
          {percentage}%
        </span>
      </div>
      <span className="text-sm text-muted-foreground">
        ({currencySymbol}
        {formattedAmount})
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Delivery Impact Display
// ---------------------------------------------------------------------------

function DeliveryImpactDisplay({
  days,
  description,
}: {
  days: number
  description: string
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-1 rounded text-sm font-medium',
          days > 0
            ? 'bg-amber-50 text-amber-700'
            : days < 0
              ? 'bg-green-50 text-green-700'
              : 'bg-slate-50 text-slate-700'
        )}
      >
        <Clock className="h-4 w-4" />
        <span>{days > 0 ? `+${days}天` : days < 0 ? `${days}天` : '无影响'}</span>
      </div>
      <span className="text-xs text-muted-foreground truncate max-w-[150px]">
        {description}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Confidence Badge
// ---------------------------------------------------------------------------

function ConfidenceBadge({ confidence }: { confidence: number }) {
  let variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'outline'
  let colorClass = ''

  if (confidence >= 90) {
    variant = 'default'
    colorClass = 'bg-green-100 text-green-800 hover:bg-green-100'
  } else if (confidence >= 70) {
    variant = 'secondary'
    colorClass = 'bg-blue-100 text-blue-800 hover:bg-blue-100'
  } else if (confidence >= 50) {
    variant = 'outline'
    colorClass = 'border-amber-300 text-amber-700'
  } else {
    variant = 'outline'
    colorClass = 'border-red-300 text-red-700'
  }

  return (
    <Badge variant={variant} className={cn('text-xs', colorClass)}>
      置信度 {confidence}%
    </Badge>
  )
}

// ---------------------------------------------------------------------------
// Constraint Conflict Item
// ---------------------------------------------------------------------------

function ConstraintConflictItem({ conflict }: { conflict: ConstraintConflict }) {
  const severityConfig = {
    critical: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    warning: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    info: { icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' },
  }

  const typeLabels: Record<string, string> = {
    capacity: '产能',
    budget: '预算',
    compliance: '合规',
    quality: '质量',
    contract: '合同',
  }

  const config = severityConfig[conflict.severity]
  const Icon = config.icon

  return (
    <div className={cn('flex items-start gap-2 p-2 rounded', config.bg)}>
      <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', config.color)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] h-5">
            {typeLabels[conflict.type] || conflict.type}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{conflict.description}</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Recommended Solution Card
// ---------------------------------------------------------------------------

function RecommendedSolutionCard({
  solution,
  onApprove,
  onReject,
}: {
  solution: Solution
  onApprove: () => void
  onReject: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="border-2 border-green-200 bg-green-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
              <Star className="h-4 w-4 text-green-600 fill-green-600" />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {solution.title}
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  推荐方案
                </Badge>
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Avatar className="h-5 w-5">
                  {solution.author.avatar && (
                    <AvatarImage src={solution.author.avatar} />
                  )}
                  <AvatarFallback className="text-[10px]">
                    {solution.author.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <span>{solution.author.name}</span>
                <span className="text-muted-foreground">
                  {formatDistanceToNow(new Date(solution.created_at), {
                    addSuffix: true,
                    locale: zhCN,
                  })}
                </span>
              </CardDescription>
            </div>
          </div>
          <ConfidenceBadge confidence={solution.confidence} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-foreground">{solution.description}</p>

        {/* Recommendation Reason */}
        {solution.reason && (
          <div className="bg-green-100/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <ThumbsUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">推荐理由</span>
            </div>
            <p className="text-sm text-green-700">{solution.reason}</p>
          </div>
        )}

        {/* Impact Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-muted-foreground block mb-1">成本影响</span>
            <CostImpactDisplay {...solution.cost_impact} />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-1">交期影响</span>
            <DeliveryImpactDisplay {...solution.delivery_impact} />
          </div>
        </div>

        {/* Constraint Conflicts */}
        {solution.constraint_conflicts && solution.constraint_conflicts.length > 0 && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              约束冲突 ({solution.constraint_conflicts.length})
            </button>
            {expanded && (
              <div className="mt-2 space-y-2">
                {solution.constraint_conflicts.map((conflict, idx) => (
                  <ConstraintConflictItem key={idx} conflict={conflict} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onReject}>
            <XCircle className="h-4 w-4 mr-1" />
            退回
          </Button>
          <Button size="sm" onClick={onApprove}>
            <CheckCircle2 className="h-4 w-4 mr-1" />
            采纳并提交审批
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Alternative Solution Card
// ---------------------------------------------------------------------------

function AlternativeSolutionCard({
  solution,
  onApprove,
  onAbandon,
}: {
  solution: Solution
  onApprove: () => void
  onAbandon: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  const statusConfig = {
    proposed: { label: '待评估', color: 'bg-slate-100 text-slate-700' },
    approved: { label: '已采纳', color: 'bg-green-100 text-green-700' },
    rejected: { label: '已驳回', color: 'bg-red-100 text-red-700' },
    abandoned: { label: '已放弃', color: 'bg-gray-100 text-gray-500' },
  }

  const status = statusConfig[solution.status]
  const isAbandoned = solution.status === 'abandoned'

  return (
    <Card className={cn(isAbandoned && 'opacity-60 bg-gray-50')}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              {solution.title}
              <Badge className={status.color}>{status.label}</Badge>
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Avatar className="h-5 w-5">
                {solution.author.avatar && (
                  <AvatarImage src={solution.author.avatar} />
                )}
                <AvatarFallback className="text-[10px]">
                  {solution.author.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <span>{solution.author.name}</span>
            </CardDescription>
          </div>
          <ConfidenceBadge confidence={solution.confidence} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-foreground">{solution.description}</p>

        {/* Abandon Reason */}
        {isAbandoned && solution.reason && (
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <RotateCcw className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">放弃原因</span>
            </div>
            <p className="text-sm text-gray-600">{solution.reason}</p>
          </div>
        )}

        {/* Impact Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-muted-foreground block mb-1">成本影响</span>
            <CostImpactDisplay {...solution.cost_impact} />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-1">交期影响</span>
            <DeliveryImpactDisplay {...solution.delivery_impact} />
          </div>
        </div>

        {/* Constraint Conflicts */}
        {solution.constraint_conflicts && solution.constraint_conflicts.length > 0 && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              约束冲突 ({solution.constraint_conflicts.length})
            </button>
            {expanded && (
              <div className="mt-2 space-y-2">
                {solution.constraint_conflicts.map((conflict, idx) => (
                  <ConstraintConflictItem key={idx} conflict={conflict} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions (only for proposed) */}
        {solution.status === 'proposed' && (
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onAbandon}>
              <XCircle className="h-4 w-4 mr-1" />
              放弃
            </Button>
            <Button variant="outline" size="sm" onClick={onApprove}>
              <CheckCircle2 className="h-4 w-4 mr-1" />
              采纳
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Comparison Table
// ---------------------------------------------------------------------------

function ComparisonTable({ solutions }: { solutions: Solution[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">对比维度</th>
            {solutions.map((s) => (
              <th key={s.solution_id} className="text-left py-2 px-3 font-medium min-w-[180px]">
                <div className="flex items-center gap-2">
                  {s.is_recommended && <Star className="h-3 w-3 text-green-500 fill-green-500" />}
                  <span className={cn(s.is_recommended && 'text-green-700')}>{s.title}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-3 px-3 text-muted-foreground">成本变化</td>
            {solutions.map((s) => (
              <td key={s.solution_id} className="py-3 px-3">
                <CostImpactDisplay {...s.cost_impact} />
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="py-3 px-3 text-muted-foreground">交期影响</td>
            {solutions.map((s) => (
              <td key={s.solution_id} className="py-3 px-3">
                <DeliveryImpactDisplay {...s.delivery_impact} />
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="py-3 px-3 text-muted-foreground">置信度</td>
            {solutions.map((s) => (
              <td key={s.solution_id} className="py-3 px-3">
                <ConfidenceBadge confidence={s.confidence} />
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="py-3 px-3 text-muted-foreground">约束冲突</td>
            {solutions.map((s) => (
              <td key={s.solution_id} className="py-3 px-3">
                {s.constraint_conflicts && s.constraint_conflicts.length > 0 ? (
                  <Badge variant="outline" className="text-amber-600 border-amber-300">
                    {s.constraint_conflicts.length} 项
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    无冲突
                  </Badge>
                )}
              </td>
            ))}
          </tr>
          <tr>
            <td className="py-3 px-3 text-muted-foreground">状态</td>
            {solutions.map((s) => (
              <td key={s.solution_id} className="py-3 px-3">
                <Badge
                  variant={
                    s.status === 'approved'
                      ? 'default'
                      : s.status === 'rejected' || s.status === 'abandoned'
                        ? 'destructive'
                        : 'outline'
                  }
                >
                  {s.status === 'proposed' && '待评估'}
                  {s.status === 'approved' && '已采纳'}
                  {s.status === 'rejected' && '已驳回'}
                  {s.status === 'abandoned' && '已放弃'}
                </Badge>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function SolutionComparison({
  solutions,
  caseId: _caseId,
  onSolutionApprove,
  onSolutionReject,
  onSolutionAbandon,
  className,
}: SolutionComparisonProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'approve' | 'reject' | 'abandon' | null>(null)
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null)
  const [reason, setReason] = useState('')

  const recommendedSolution = useMemo(
    () => solutions.find((s) => s.is_recommended),
    [solutions]
  )

  const alternativeSolutions = useMemo(
    () => solutions.filter((s) => !s.is_recommended),
    [solutions]
  )

  const activeSolutions = useMemo(
    () => solutions.filter((s) => s.status !== 'abandoned'),
    [solutions]
  )

  const openDialog = (type: 'approve' | 'reject' | 'abandon', solution: Solution) => {
    setDialogType(type)
    setSelectedSolution(solution)
    setReason('')
    setDialogOpen(true)
  }

  const handleConfirm = () => {
    if (!selectedSolution) return

    switch (dialogType) {
      case 'approve':
        onSolutionApprove?.(selectedSolution.solution_id)
        toast.success('方案已采纳', {
          description: `${selectedSolution.title} 已提交审批`,
        })
        break
      case 'reject':
        onSolutionReject?.(selectedSolution.solution_id, reason)
        toast.success('方案已退回', {
          description: selectedSolution.title,
        })
        break
      case 'abandon':
        onSolutionAbandon?.(selectedSolution.solution_id, reason)
        toast.success('方案已放弃', {
          description: selectedSolution.title,
        })
        break
    }
    setDialogOpen(false)
  }

  return (
    <div className={cn('h-full flex flex-col', className)}>
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                方案对比
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                共 {solutions.length} 个方案，其中 {activeSolutions.length} 个有效方案
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          {activeSolutions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">方案对比表</CardTitle>
              </CardHeader>
              <CardContent>
                <ComparisonTable solutions={activeSolutions} />
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Recommended Solution */}
          {recommendedSolution && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Star className="h-4 w-4 text-green-500" />
                推荐方案
              </h3>
              <RecommendedSolutionCard
                solution={recommendedSolution}
                onApprove={() => openDialog('approve', recommendedSolution)}
                onReject={() => openDialog('reject', recommendedSolution)}
              />
            </div>
          )}

          {/* Alternative Solutions */}
          {alternativeSolutions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                备选方案 ({alternativeSolutions.length})
              </h3>
              <div className="space-y-4">
                {alternativeSolutions.map((solution) => (
                  <AlternativeSolutionCard
                    key={solution.solution_id}
                    solution={solution}
                    onApprove={() => openDialog('approve', solution)}
                    onAbandon={() => openDialog('abandon', solution)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'approve' && '采纳方案'}
              {dialogType === 'reject' && '退回方案'}
              {dialogType === 'abandon' && '放弃方案'}
            </DialogTitle>
            <DialogDescription>
              {selectedSolution?.title}
            </DialogDescription>
          </DialogHeader>

          {(dialogType === 'reject' || dialogType === 'abandon') && (
            <div className="py-4">
              <label className="text-sm font-medium mb-2 block">
                {dialogType === 'reject' ? '退回原因' : '放弃原因'}
              </label>
              <Textarea
                placeholder="请输入原因..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          )}

          {dialogType === 'approve' && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                确认采纳此方案？采纳后将进入审批流程。
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={(dialogType === 'reject' || dialogType === 'abandon') && !reason.trim()}
              variant={dialogType === 'reject' || dialogType === 'abandon' ? 'destructive' : 'default'}
            >
              {dialogType === 'approve' && '确认采纳'}
              {dialogType === 'reject' && '确认退回'}
              {dialogType === 'abandon' && '确认放弃'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
