/**
 * RecommendationList Component
 *
 * FE-112: 推荐/可行/不可行方案列表
 * - 推荐(绿)/可行/不可行(灰)分组
 * - 成本/交期/置信度/约束展示
 * - 查看细节展开
 * - 标星收藏操作
 * - 解释为什么推荐/淘汰
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertTriangle,
  Info,
  Filter,
  ArrowUpDown,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { success } from '@/lib/tokens/colors'

import type { OptimizationSolution, SolutionStatus, SolutionSortField } from '@/types/optimization'
import { mockSolutions } from '@/mocks/data/optimization'

interface RecommendationListProps {
  solutions?: OptimizationSolution[]
  onSelect?: (solution: OptimizationSolution) => void
  onCompare?: (solutions: OptimizationSolution[]) => void
  onStar?: (solutionId: string, starred: boolean) => void
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
const statusConfig: Record<
  SolutionStatus,
  {
    label: string
    icon: typeof CheckCircle2
    color: string
    bgColor: string
    borderColor: string
    textColor: string
  }
> = {
  recommended: {
    label: '推荐方案',
    icon: Sparkles,
    color: success.DEFAULT,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
  },
  feasible: {
    label: '可行方案',
    icon: CheckCircle2,
    color: '#2F6FED',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
  },
  infeasible: {
    label: '不可行',
    icon: XCircle,
    color: '#6B7280',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-600',
  },
}

// Constraint type labels
const constraintLabels: Record<string, string> = {
  cost: '成本',
  delivery: '交付',
  capacity: '产能',
  compliance: '合规',
  inventory: '库存',
  logistics: '物流',
}

// Format change value
function formatChange(value: number, type: 'cost' | 'delivery'): string {
  if (type === 'cost') {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }
  // delivery
  if (value < 0) {
    return `提前 ${Math.abs(value)} 天`
  } else if (value > 0) {
    return `延期 ${value} 天`
  }
  return '按时'
}

// Solution Card Component
interface SolutionCardProps {
  solution: OptimizationSolution
  onSelect?: (solution: OptimizationSolution) => void
  onStar?: (solutionId: string, starred: boolean) => void
  isSelected?: boolean
}

function SolutionCard({ solution, onSelect, onStar, isSelected }: SolutionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [starred, setStarred] = useState(solution.isStarred || false)
  const status = statusConfig[solution.status]
  const StatusIcon = status.icon

  const handleStar = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newStarred = !starred
    setStarred(newStarred)
    onStar?.(solution.id, newStarred)
  }

  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        'rounded-lg border-2 transition-all duration-200 overflow-hidden',
        status.borderColor,
        status.bgColor,
        isSelected && 'ring-2 ring-offset-2',
        isSelected && solution.status === 'recommended' && 'ring-green-400',
        isSelected && solution.status === 'feasible' && 'ring-blue-400',
        isSelected && solution.status === 'infeasible' && 'ring-gray-400'
      )}
    >
      {/* Card Header */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => onSelect?.(solution)}
      >
        <div className="flex items-start gap-3">
          {/* Status Icon */}
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
              solution.status === 'recommended' && 'bg-green-100',
              solution.status === 'feasible' && 'bg-blue-100',
              solution.status === 'infeasible' && 'bg-gray-200'
            )}
          >
            <StatusIcon
              className={cn(
                'w-5 h-5',
                solution.status === 'recommended' && 'text-green-600',
                solution.status === 'feasible' && 'text-blue-600',
                solution.status === 'infeasible' && 'text-gray-500'
              )}
            />
          </div>

          {/* Title & Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 truncate">{solution.name}</h3>
              <Badge
                variant="outline"
                className={cn(
                  'text-xs',
                  solution.status === 'recommended' && 'border-green-300 text-green-700 bg-green-50',
                  solution.status === 'feasible' && 'border-blue-300 text-blue-700 bg-blue-50',
                  solution.status === 'infeasible' && 'border-gray-300 text-gray-600 bg-gray-100'
                )}
              >
                {status.label}
              </Badge>
              {solution.status === 'recommended' && (
                <Badge className="bg-green-500 text-white text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI 推荐
                </Badge>
              )}
            </div>

            {/* Key Metrics */}
            <div className="flex flex-wrap gap-4 mt-2">
              {/* Cost */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span
                        className={cn(
                          solution.costChange > 15
                            ? 'text-red-600'
                            : solution.costChange > 5
                              ? 'text-amber-600'
                              : 'text-green-600'
                        )}
                      >
                        {formatChange(solution.costChange, 'cost')}
                      </span>
                      <span className="text-gray-500 text-xs">成本</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>相对于基准成本的变化</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Delivery */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span
                        className={cn(
                          solution.deliveryChange < 0
                            ? 'text-green-600'
                            : solution.deliveryChange > 0
                              ? 'text-amber-600'
                              : 'text-gray-600'
                        )}
                      >
                        {formatChange(solution.deliveryChange, 'delivery')}
                      </span>
                      <span className="text-gray-500 text-xs">交期</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>预计交付时间变化</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Confidence */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1 text-sm">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{solution.confidence}%</span>
                      <span className="text-gray-500 text-xs">置信度</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>方案成功实施的可信度评分</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Risk Reduction */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingDown className="w-4 h-4 text-gray-400" />
                      <span className="text-green-600">{solution.riskReduction}%</span>
                      <span className="text-gray-500 text-xs">风险降低</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>预计风险缓解程度</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Affected Orders */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-gray-900 font-medium">{solution.affectedOrders}</span>
                      <span className="text-gray-500 text-xs">受影响订单</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>将被此方案影响的订单数量</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Star & Expand Actions */}
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={handleStar}
              className={cn(
                'p-2 rounded-lg transition-colors',
                starred
                  ? 'text-amber-500 hover:bg-amber-50'
                  : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100'
              )}
            >
              <Star className={cn('w-5 h-5', starred && 'fill-current')} />
            </button>
            <button
              onClick={e => {
                e.stopPropagation()
                setExpanded(!expanded)
              }}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {expanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Constraint Indicators */}
        <div className="flex flex-wrap gap-2 mt-3">
          {solution.constraints.map(constraint => (
            <TooltipProvider key={constraint.type}>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs cursor-help',
                      constraint.satisfied
                        ? 'border-green-300 text-green-700 bg-green-50'
                        : 'border-red-300 text-red-700 bg-red-50'
                    )}
                  >
                    {constraint.satisfied ? (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    ) : (
                      <XCircle className="w-3 h-3 mr-1" />
                    )}
                    {constraintLabels[constraint.type]}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {constraint.satisfied
                      ? `${constraintLabels[constraint.type]}约束满足 (余量: ${constraint.margin.toFixed(1)})`
                      : `${constraintLabels[constraint.type]}约束违反 (缺口: ${Math.abs(constraint.margin).toFixed(1)})`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t"
          >
            <div className="p-4 space-y-4">
              {/* Why Recommended / Infeasible */}
              {solution.whyRecommended && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-green-800">为什么推荐</span>
                      <p className="text-sm text-green-700 mt-1">{solution.whyRecommended}</p>
                    </div>
                  </div>
                </div>
              )}

              {solution.infeasibleReasons && solution.infeasibleReasons.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-red-800">不可行原因</span>
                      <ul className="text-sm text-red-700 mt-1 space-y-1">
                        {solution.infeasibleReasons.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-3 border">
                  <span className="text-xs text-gray-500">成本变化</span>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {formatChange(solution.costChange, 'cost')}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <span className="text-xs text-gray-500">交期变化</span>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {formatChange(solution.deliveryChange, 'delivery')}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <span className="text-xs text-gray-500">风险降低</span>
                  <div className="text-lg font-semibold text-green-600 mt-1">
                    {solution.riskReduction}%
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <span className="text-xs text-gray-500">置信度</span>
                  <div className="text-lg font-semibold text-blue-600 mt-1">
                    {solution.confidence}%
                  </div>
                </div>
              </div>

              {/* Constraint Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">约束满足情况</h4>
                <div className="space-y-2">
                  {solution.constraints.map(constraint => (
                    <div key={constraint.type} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-16">{constraintLabels[constraint.type]}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            constraint.satisfied ? 'bg-green-500' : 'bg-red-500'
                          )}
                          style={{
                            width: `${Math.min(Math.max(constraint.margin + 50, 0), 100)}%`,
                          }}
                        />
                      </div>
                      <span
                        className={cn(
                          'text-xs w-20 text-right',
                          constraint.satisfied ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {constraint.satisfied ? '满足' : '违反'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function RecommendationList({
  solutions = mockSolutions,
  onSelect,
  onCompare,
  onStar,
  className,
}: RecommendationListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SolutionSortField>('confidence')
  const [sortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterStatus, setFilterStatus] = useState<SolutionStatus | 'all'>('all')

  // Filter and sort solutions
  const filteredSolutions = useMemo(() => {
    let filtered = solutions
    if (filterStatus !== 'all') {
      filtered = filtered.filter(s => s.status === filterStatus)
    }
    return [...filtered].sort((a, b) => {
      const aVal = a[sortBy] as number
      const bVal = b[sortBy] as number
      const multiplier = sortDirection === 'asc' ? 1 : -1
      return (aVal - bVal) * multiplier
    })
  }, [solutions, filterStatus, sortBy, sortDirection])

  // Group solutions by status
  const groupedSolutions = useMemo(() => {
    const groups: Record<SolutionStatus, OptimizationSolution[]> = {
      recommended: [],
      feasible: [],
      infeasible: [],
    }
    filteredSolutions.forEach(s => {
      groups[s.status].push(s)
    })
    return groups
  }, [filteredSolutions])

  const handleSelect = (solution: OptimizationSolution) => {
    if (selectedIds.includes(solution.id)) {
      setSelectedIds(prev => prev.filter(id => id !== solution.id))
    } else if (selectedIds.length < 2) {
      setSelectedIds(prev => [...prev, solution.id])
    } else {
      setSelectedIds([solution.id])
    }
    onSelect?.(solution)
  }

  const selectedSolutions = solutions.filter(s => selectedIds.includes(s.id))

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={cn('space-y-4', className)}
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">优化方案列表</h2>
          <p className="text-sm text-gray-500 mt-1">
            共 {solutions.length} 个方案，
            <span className="text-green-600 font-medium"> {groupedSolutions.recommended.length} 个推荐</span>，
            <span className="text-blue-600 font-medium"> {groupedSolutions.feasible.length} 个可行</span>，
            <span className="text-gray-500"> {groupedSolutions.infeasible.length} 个不可行</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter */}
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as SolutionStatus | 'all')}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="筛选..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部方案</SelectItem>
              <SelectItem value="recommended">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  推荐方案
                </span>
              </SelectItem>
              <SelectItem value="feasible">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  可行方案
                </span>
              </SelectItem>
              <SelectItem value="infeasible">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  不可行
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SolutionSortField)}>
            <SelectTrigger className="w-[160px]">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="排序..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confidence">按置信度</SelectItem>
              <SelectItem value="costChange">按成本变化</SelectItem>
              <SelectItem value="deliveryChange">按交期变化</SelectItem>
              <SelectItem value="riskReduction">按风险降低</SelectItem>
            </SelectContent>
          </Select>

          {/* Compare Button */}
          <Button
            variant="outline"
            size="sm"
            disabled={selectedIds.length !== 2}
            onClick={() => onCompare?.(selectedSolutions)}
          >
            对比选中方案 ({selectedIds.length}/2)
          </Button>
        </div>
      </motion.div>

      {/* Selected Solutions Banner */}
      {selectedIds.length > 0 && (
        <motion.div
          variants={fadeInUp}
          className="bg-blue-50 border border-blue-200 rounded-lg p-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-700">
                已选择 {selectedIds.length} 个方案
                {selectedIds.length === 2 ? '，点击"对比"查看详细对比' : '，请选择另一个方案进行对比'}
              </span>
            </div>
            <button
              onClick={() => setSelectedIds([])}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              清除选择
            </button>
          </div>
        </motion.div>
      )}

      {/* Solution Groups */}
      <div className="space-y-6">
        {/* Recommended */}
        {groupedSolutions.recommended.length > 0 && (
          <motion.div variants={fadeInUp}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-900">推荐方案</h3>
              <Badge className="bg-green-100 text-green-700">
                {groupedSolutions.recommended.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {groupedSolutions.recommended.map(solution => (
                <SolutionCard
                  key={solution.id}
                  solution={solution}
                  onSelect={handleSelect}
                  onStar={onStar}
                  isSelected={selectedIds.includes(solution.id)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Feasible */}
        {groupedSolutions.feasible.length > 0 && (
          <motion.div variants={fadeInUp}>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">可行方案</h3>
              <Badge className="bg-blue-100 text-blue-700">
                {groupedSolutions.feasible.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {groupedSolutions.feasible.map(solution => (
                <SolutionCard
                  key={solution.id}
                  solution={solution}
                  onSelect={handleSelect}
                  onStar={onStar}
                  isSelected={selectedIds.includes(solution.id)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Infeasible */}
        {groupedSolutions.infeasible.length > 0 && (
          <motion.div variants={fadeInUp}>
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-gray-500">不可行方案</h3>
              <Badge className="bg-gray-100 text-gray-600">
                {groupedSolutions.infeasible.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {groupedSolutions.infeasible.map(solution => (
                <SolutionCard
                  key={solution.id}
                  solution={solution}
                  onSelect={handleSelect}
                  onStar={onStar}
                  isSelected={selectedIds.includes(solution.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
