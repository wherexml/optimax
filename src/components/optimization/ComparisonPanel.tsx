/**
 * ComparisonPanel Component
 *
 * FE-113: 双方案并列对比
 * - 左右并列对比两个方案
 * - 对比维度：成本增量、交期改善、受影响订单数、风险降低效果
 * - 差异高亮标注
 * - 导出对比截图
 */

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Scale,
  TrendingUp,
  TrendingDown,
  Clock,
  Package,
  Shield,
  AlertCircle,
  Camera,
  CheckCircle2,
  XCircle,
  Sparkles,
  Star,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import type { OptimizationSolution, ConstraintIndicator } from '@/types/optimization'

interface ComparisonPanelProps {
  solutions: [OptimizationSolution, OptimizationSolution]
  onExport?: () => void
  onAdopt?: (solutionId: string) => void
  className?: string
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

// Status config
const statusConfig = {
  recommended: {
    label: '推荐',
    icon: Sparkles,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  feasible: {
    label: '可行',
    icon: CheckCircle2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  infeasible: {
    label: '不可行',
    icon: XCircle,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
}

// Constraint labels
const constraintLabels: Record<string, string> = {
  cost: '成本',
  delivery: '交付',
  capacity: '产能',
  compliance: '合规',
  inventory: '库存',
  logistics: '物流',
}

// Format change value
function formatChange(value: number, type: 'cost' | 'delivery' | 'number' | 'percent'): string {
  switch (type) {
    case 'cost':
      const sign = value >= 0 ? '+' : ''
      return `${sign}${value.toFixed(1)}%`
    case 'delivery':
      if (value < 0) return `提前 ${Math.abs(value)} 天`
      if (value > 0) return `延期 ${value} 天`
      return '按时'
    case 'percent':
      return `${value}%`
    case 'number':
      return value.toString()
    default:
      return value.toString()
  }
}

// Comparison Row Component
interface ComparisonRowProps {
  label: string
  left: React.ReactNode
  right: React.ReactNode
  better?: 'left' | 'right' | 'equal' | 'none'
  tooltip?: string
}

function ComparisonRow({ label, left, right, better, tooltip }: ComparisonRowProps) {
  const getBetterStyle = (side: 'left' | 'right') => {
    if (better === 'equal' || better === 'none') return ''
    if (better === side) {
      return 'bg-green-50 border-green-200'
    }
    return 'bg-gray-50 border-gray-200'
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="grid grid-cols-[140px_1fr_1fr] gap-4 items-center py-3 border-b last:border-0">
            <div className="text-sm text-gray-600 font-medium">{label}</div>
            <div className={cn('p-3 rounded-lg border transition-colors', getBetterStyle('left'))}>
              {left}
            </div>
            <div className={cn('p-3 rounded-lg border transition-colors', getBetterStyle('right'))}>
              {right}
            </div>
          </div>
        </TooltipTrigger>
        {tooltip && <TooltipContent><p>{tooltip}</p></TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  )
}

// Constraint Comparison Component
function ConstraintComparison({
  left,
  right,
}: {
  left: ConstraintIndicator[]
  right: ConstraintIndicator[]
}) {
  const getStatus = (satisfied: boolean) =>
    satisfied ? (
      <span className="flex items-center gap-1 text-green-600 text-sm">
        <CheckCircle2 className="w-4 h-4" />
        满足
      </span>
    ) : (
      <span className="flex items-center gap-1 text-red-600 text-sm">
        <XCircle className="w-4 h-4" />
        违反
      </span>
    )

  return (
    <div className="space-y-2">
      {left.map(constraint => {
        const rightConstraint = right.find(c => c.type === constraint.type)
        if (!rightConstraint) return null

        const leftBetter = constraint.satisfied && !rightConstraint.satisfied
        const rightBetter = !constraint.satisfied && rightConstraint.satisfied
        const bothSatisfied = constraint.satisfied && rightConstraint.satisfied
        const leftMargin = constraint.margin
        const rightMargin = rightConstraint.margin
        const marginBetter = leftMargin > rightMargin ? 'left' : rightMargin > leftMargin ? 'right' : 'equal'

        return (
          <ComparisonRow
            key={constraint.type}
            label={constraintLabels[constraint.type]}
            better={leftBetter ? 'left' : rightBetter ? 'right' : bothSatisfied ? marginBetter : 'none'}
            left={
              <div className="flex items-center justify-between">
                {getStatus(constraint.satisfied)}
                <span className="text-xs text-gray-500">余量: {constraint.margin.toFixed(1)}</span>
              </div>
            }
            right={
              <div className="flex items-center justify-between">
                {getStatus(rightConstraint.satisfied)}
                <span className="text-xs text-gray-500">余量: {rightConstraint.margin.toFixed(1)}</span>
              </div>
            }
          />
        )
      })}
    </div>
  )
}

export function ComparisonPanel({ solutions, onExport, onAdopt, className }: ComparisonPanelProps) {
  const [left, right] = solutions
  const [exporting, setExporting] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const leftStatus = statusConfig[left.status]
  const rightStatus = statusConfig[right.status]
  const LeftIcon = leftStatus.icon
  const RightIcon = rightStatus.icon

  // Determine which is better for each metric
  const comparisons = {
    cost: left.costChange < right.costChange ? 'left' as const : right.costChange < left.costChange ? 'right' as const : 'equal' as const,
    delivery: left.deliveryChange < right.deliveryChange ? 'left' as const : right.deliveryChange < left.deliveryChange ? 'right' as const : 'equal' as const,
    confidence: left.confidence > right.confidence ? 'left' as const : right.confidence > left.confidence ? 'right' as const : 'equal' as const,
    riskReduction: left.riskReduction > right.riskReduction ? 'left' as const : right.riskReduction > left.riskReduction ? 'right' as const : 'equal' as const,
    orders: left.affectedOrders < right.affectedOrders ? 'left' as const : right.affectedOrders < left.affectedOrders ? 'right' as const : 'equal' as const,
  }

  const handleExport = () => {
    setExporting(true)
    // Simulate export
    setTimeout(() => {
      setExporting(false)
      onExport?.()
    }, 1500)
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={cn('space-y-6', className)}
      ref={panelRef}
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-500" />
            方案对比分析
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            并排对比两个优化方案的关键指标和约束满足情况
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
            <Camera className="w-4 h-4 mr-2" />
            {exporting ? '导出中...' : '导出截图'}
          </Button>
        </div>
      </motion.div>

      {/* Comparison Table */}
      <motion.div variants={fadeInUp}>
        <Card className="overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-[140px_1fr_1fr] gap-4 p-4 bg-gray-50 border-b">
            <div className="text-sm font-medium text-gray-500">对比维度</div>
            {/* Left Solution Header */}
            <div className={cn('p-3 rounded-lg border-2', leftStatus.borderColor, leftStatus.bgColor)}>
              <div className="flex items-center gap-2">
                <LeftIcon className={cn('w-5 h-5', leftStatus.color)} />
                <span className="font-semibold text-gray-900">{left.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={left.status === 'recommended' ? 'default' : 'secondary'}
                  className={cn(
                    'text-xs',
                    left.status === 'recommended' && 'bg-green-500',
                    left.status === 'feasible' && 'bg-blue-500',
                    left.status === 'infeasible' && 'bg-gray-400'
                  )}
                >
                  {leftStatus.label}
                </Badge>
                {left.isStarred && <Star className="w-4 h-4 text-amber-500 fill-current" />}
              </div>
            </div>
            {/* Right Solution Header */}
            <div className={cn('p-3 rounded-lg border-2', rightStatus.borderColor, rightStatus.bgColor)}>
              <div className="flex items-center gap-2">
                <RightIcon className={cn('w-5 h-5', rightStatus.color)} />
                <span className="font-semibold text-gray-900">{right.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={right.status === 'recommended' ? 'default' : 'secondary'}
                  className={cn(
                    'text-xs',
                    right.status === 'recommended' && 'bg-green-500',
                    right.status === 'feasible' && 'bg-blue-500',
                    right.status === 'infeasible' && 'bg-gray-400'
                  )}
                >
                  {rightStatus.label}
                </Badge>
                {right.isStarred && <Star className="w-4 h-4 text-amber-500 fill-current" />}
              </div>
            </div>
          </div>

          {/* Comparison Content */}
          <div className="p-4">
            {/* Key Metrics */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                关键指标
              </h3>

              {/* Cost */}
              <ComparisonRow
                label="成本变化"
                better={comparisons.cost as 'left' | 'right' | 'equal' | 'none'}
                tooltip="成本增幅越小越好"
                left={
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span
                      className={cn(
                        'font-semibold',
                        left.costChange > 15 ? 'text-red-600' : left.costChange > 5 ? 'text-amber-600' : 'text-green-600'
                      )}
                    >
                      {formatChange(left.costChange, 'cost')}
                    </span>
                  </div>
                }
                right={
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span
                      className={cn(
                        'font-semibold',
                        right.costChange > 15 ? 'text-red-600' : right.costChange > 5 ? 'text-amber-600' : 'text-green-600'
                      )}
                    >
                      {formatChange(right.costChange, 'cost')}
                    </span>
                  </div>
                }
              />

              {/* Delivery */}
              <ComparisonRow
                label="交期变化"
                better={comparisons.delivery as 'left' | 'right' | 'equal' | 'none'}
                tooltip="延期越短越好，提前更好"
                left={
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span
                      className={cn(
                        'font-semibold',
                        left.deliveryChange < 0 ? 'text-green-600' : left.deliveryChange > 0 ? 'text-amber-600' : 'text-gray-600'
                      )}
                    >
                      {formatChange(left.deliveryChange, 'delivery')}
                    </span>
                  </div>
                }
                right={
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span
                      className={cn(
                        'font-semibold',
                        right.deliveryChange < 0 ? 'text-green-600' : right.deliveryChange > 0 ? 'text-amber-600' : 'text-gray-600'
                      )}
                    >
                      {formatChange(right.deliveryChange, 'delivery')}
                    </span>
                  </div>
                }
              />

              {/* Confidence */}
              <ComparisonRow
                label="置信度"
                better={comparisons.confidence as 'left' | 'right' | 'equal' | 'none'}
                tooltip="置信度越高表示方案越可靠"
                left={
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-blue-600">{left.confidence}%</span>
                    <Progress value={left.confidence} className="w-20 h-2" />
                  </div>
                }
                right={
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-blue-600">{right.confidence}%</span>
                    <Progress value={right.confidence} className="w-20 h-2" />
                  </div>
                }
              />

              {/* Risk Reduction */}
              <ComparisonRow
                label="风险降低"
                better={comparisons.riskReduction as 'left' | 'right' | 'equal' | 'none'}
                tooltip="风险降低幅度越大越好"
                left={
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-green-600">{left.riskReduction}%</span>
                  </div>
                }
                right={
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-green-600">{right.riskReduction}%</span>
                  </div>
                }
              />

              {/* Affected Orders */}
              <ComparisonRow
                label="受影响订单"
                better={comparisons.orders as 'left' | 'right' | 'equal' | 'none'}
                tooltip="受影响订单数越少越好"
                left={
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">{left.affectedOrders}</span>
                    <span className="text-xs text-gray-500">单</span>
                  </div>
                }
                right={
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">{right.affectedOrders}</span>
                    <span className="text-xs text-gray-500">单</span>
                  </div>
                }
              />
            </div>

            <Separator className="my-4" />

            {/* Constraints */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                约束满足情况
              </h3>
              <ConstraintComparison left={left.constraints} right={right.constraints} />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <AlertCircle className="w-4 h-4" />
              <span>高亮单元格表示该维度表现更优的方案</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onAdopt?.(left.id)}
                disabled={left.status === 'infeasible'}
              >
                采纳方案 A
              </Button>
              <Button
                variant="outline"
                onClick={() => onAdopt?.(right.id)}
                disabled={right.status === 'infeasible'}
              >
                采纳方案 B
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Summary Card */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">对比结论</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {/* Left Summary */}
              <div className={cn('p-4 rounded-lg border', leftStatus.bgColor, leftStatus.borderColor)}>
                <h4 className="font-semibold text-gray-900 mb-2">{left.name}</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    {comparisons.cost === 'left' && <Badge className="bg-green-500 text-white text-xs">优</Badge>}
                    <span className="text-gray-600">成本{comparisons.cost === 'left' ? '更' : comparisons.cost === 'equal' ? '持平' : '较高'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {comparisons.delivery === 'left' && <Badge className="bg-green-500 text-white text-xs">优</Badge>}
                    <span className="text-gray-600">交付{comparisons.delivery === 'left' ? '更快' : comparisons.delivery === 'equal' ? '相同' : '较慢'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {comparisons.riskReduction === 'left' && <Badge className="bg-green-500 text-white text-xs">优</Badge>}
                    <span className="text-gray-600">风险降低{comparisons.riskReduction === 'left' ? '更多' : comparisons.riskReduction === 'equal' ? '相同' : '较少'}</span>
                  </li>
                </ul>
              </div>

              {/* Right Summary */}
              <div className={cn('p-4 rounded-lg border', rightStatus.bgColor, rightStatus.borderColor)}>
                <h4 className="font-semibold text-gray-900 mb-2">{right.name}</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    {comparisons.cost === 'right' && <Badge className="bg-green-500 text-white text-xs">优</Badge>}
                    <span className="text-gray-600">成本{comparisons.cost === 'right' ? '更' : comparisons.cost === 'equal' ? '持平' : '较高'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {comparisons.delivery === 'right' && <Badge className="bg-green-500 text-white text-xs">优</Badge>}
                    <span className="text-gray-600">交付{comparisons.delivery === 'right' ? '更快' : comparisons.delivery === 'equal' ? '相同' : '较慢'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {comparisons.riskReduction === 'right' && <Badge className="bg-green-500 text-white text-xs">优</Badge>}
                    <span className="text-gray-600">风险降低{comparisons.riskReduction === 'right' ? '更多' : comparisons.riskReduction === 'equal' ? '相同' : '较少'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

