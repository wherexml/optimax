import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  CheckCircle2,
  AlertCircle,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  TrendingUp,
  TrendingDown,
  Shield,
  FileCheck,
  Globe,
  Factory,
  BarChart3,
  GitCompare,
  Zap,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'

import { alternativeSuppliers, getComparisonSummary } from '@/mocks/data/alternative-suppliers'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface AlternativeComparisonProps {
  currentSupplierId: string
  currentSupplierName: string
  currentRiskScore: number
  currentLeadTimeDays?: number
}

// ---------------------------------------------------------------------------
// Utility Components
// ---------------------------------------------------------------------------

function CostIndicator({ delta }: { delta: number }) {
  if (delta > 0) {
    return (
      <div className="flex items-center gap-1 text-orange-600">
        <ArrowUpRight className="h-3.5 w-3.5" />
        <span className="font-medium">+{delta}%</span>
      </div>
    )
  }
  if (delta < 0) {
    return (
      <div className="flex items-center gap-1 text-green-600">
        <ArrowDownRight className="h-3.5 w-3.5" />
        <span className="font-medium">{delta}%</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <Minus className="h-3.5 w-3.5" />
      <span className="font-medium">0%</span>
    </div>
  )
}

function LeadTimeIndicator({ delta }: { delta: number }) {
  if (delta > 0) {
    return (
      <div className="flex items-center gap-1 text-orange-600">
        <TrendingUp className="h-3.5 w-3.5" />
        <span className="font-medium">+{delta}天</span>
      </div>
    )
  }
  if (delta < 0) {
    return (
      <div className="flex items-center gap-1 text-green-600">
        <TrendingDown className="h-3.5 w-3.5" />
        <span className="font-medium">{delta}天</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <Minus className="h-3.5 w-3.5" />
      <span className="font-medium">持平</span>
    </div>
  )
}

function RiskScoreBadge({ score, highlight = false }: { score: number; highlight?: boolean }) {
  let variant: 'default' | 'destructive' | 'secondary' | 'outline' = 'default'
  let className = ''

  if (score < 30) {
    variant = 'default'
    className = 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100'
  } else if (score < 50) {
    variant = 'default'
    className = 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
  } else if (score < 70) {
    variant = 'default'
    className = 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100'
  } else {
    variant = 'destructive'
    className = ''
  }

  if (highlight) {
    className += ' ring-2 ring-offset-1 ring-blue-500'
  }

  return (
    <Badge variant={variant} className={cn('text-xs font-semibold', className)}>
      {score}分
    </Badge>
  )
}

function QualificationBadge({ qualification }: { qualification: string }) {
  const isCritical = ['AEC-Q100', 'ASIL-D', '军工保密资质'].includes(qualification)
  return (
    <Badge
      variant={isCritical ? 'default' : 'outline'}
      className={cn(
        'text-[10px] mr-1 mb-1',
        isCritical && 'bg-blue-100 text-blue-700 border-blue-200'
      )}
    >
      {qualification}
    </Badge>
  )
}

function ConstraintBadge({ constraint }: { constraint: string }) {
  const isRestriction = constraint.includes('限') || constraint.includes('管制') || constraint.includes('需')
  return (
    <div className="flex items-start gap-1 text-xs text-muted-foreground">
      <AlertCircle className={cn('h-3 w-3 mt-0.5 flex-shrink-0', isRestriction && 'text-orange-500')} />
      <span className={cn(isRestriction && 'text-orange-700')}>{constraint}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function AlternativeComparison({
  currentSupplierId,
  currentSupplierName,
  currentRiskScore,
  currentLeadTimeDays = 28,
}: AlternativeComparisonProps) {
  const navigate = useNavigate()
  const [selectedSuppliers, setSelectedSuppliers] = useState<Set<string>>(new Set())
  const [compareMode, setCompareMode] = useState(false)

  const summary = useMemo(() => getComparisonSummary(alternativeSuppliers), [])

  const toggleSelection = (supplierId: string) => {
    const newSelected = new Set(selectedSuppliers)
    if (newSelected.has(supplierId)) {
      newSelected.delete(supplierId)
    } else {
      newSelected.add(supplierId)
    }
    setSelectedSuppliers(newSelected)
  }

  const handleCompare = () => {
    if (selectedSuppliers.size < 2) {
      toast.warning('请至少选择2个供应商进行对比')
      return
    }
    setCompareMode(true)
    toast.success(`已选择 ${selectedSuppliers.size} 个供应商进行对比`)
  }

  const handleGoToOptimization = () => {
    navigate({ to: '/optimization', search: { source: 'alternative_comparison', supplier_id: currentSupplierId } })
    toast.info('跳转到优化中心进行深度分析')
  }

  const handleViewSupplierDetail = (supplierId: string) => {
    navigate({ to: '/suppliers/$supplierId', params: { supplierId } })
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">候选替代供应商对比</h3>
            <Badge variant="outline" className="text-xs">
              {alternativeSuppliers.length} 个候选
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {selectedSuppliers.size > 0 && (
              <span className="text-sm text-muted-foreground">
                已选择 {selectedSuppliers.size} 个
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCompare}
              disabled={selectedSuppliers.size < 2}
              className="gap-1.5"
            >
              <BarChart3 className="h-4 w-4" />
              发起比较
            </Button>
            <Button
              size="sm"
              onClick={handleGoToOptimization}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700"
            >
              <Zap className="h-4 w-4" />
              跳转优化中心
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Factory className="h-4 w-4" />
                <span>当前供应商</span>
              </div>
              <div className="mt-2 font-semibold text-blue-900 truncate">{currentSupplierName}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">风险评分:</span>
                <RiskScoreBadge score={currentRiskScore} highlight />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>平均成本变化</span>
              </div>
              <div className="mt-2 text-2xl font-bold">
                {summary.avgCostDelta > 0 ? '+' : ''}{summary.avgCostDelta}%
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                相比当前供应商
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>平均风险评分</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{summary.avgRiskScore}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                当前: {currentRiskScore}分
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                <span>最低风险候选</span>
              </div>
              <div className="mt-2 text-sm font-semibold truncate">
                {alternativeSuppliers.find(s => s.supplier_id === summary.lowestRiskId)?.name ?? '-'}
              </div>
              <div className="mt-1 text-xs text-green-600">
                风险评分 {alternativeSuppliers.find(s => s.supplier_id === summary.lowestRiskId)?.risk_score ?? '-'}分
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              成本/交期/风险三维对比
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px]">选择</TableHead>
                  <TableHead className="w-[200px]">供应商名称</TableHead>
                  <TableHead className="w-[80px]">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 cursor-help">
                        <MapPin className="h-3.5 w-3.5" />
                        区域
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>供应商所在区域</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 cursor-help">
                        <TrendingUp className="h-3.5 w-3.5" />
                        成本变化
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>与当前供应商相比的成本变化百分比</p>
                        <p className="text-green-500">负值表示更便宜</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 cursor-help">
                        <ArrowRight className="h-3.5 w-3.5" />
                        交期变化
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>与当前供应商相比的交期变化天数</p>
                        <p className="text-green-500">负值表示更快</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 cursor-help">
                        <Shield className="h-3.5 w-3.5" />
                        风险评分
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>综合风险评分（0-100）</p>
                        <p>分数越低风险越小</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="w-[250px]">资格约束</TableHead>
                  <TableHead className="w-[100px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Current Supplier Row */}
                <TableRow className="bg-blue-50/50">
                  <TableCell>
                    <div className="h-4 w-4 rounded bg-blue-500/20 flex items-center justify-center">
                      <span className="text-[8px] text-blue-600 font-bold">原</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-blue-900">{currentSupplierName}</div>
                    <div className="text-xs text-muted-foreground">当前供应商</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      华南
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">-</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">{currentLeadTimeDays}天（基准）</div>
                  </TableCell>
                  <TableCell>
                    <RiskScoreBadge score={currentRiskScore} highlight />
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">基准供应商</div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" disabled>
                      当前
                    </Button>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={8} className="py-1">
                    <Separator className="my-1" />
                  </TableCell>
                </TableRow>

                {/* Alternative Suppliers */}
                {alternativeSuppliers.map((supplier) => {
                  const isSelected = selectedSuppliers.has(supplier.supplier_id)
                  const isLowestRisk = supplier.supplier_id === summary.lowestRiskId
                  const isLowestCost = supplier.supplier_id === summary.lowestCostId
                  const isFastest = supplier.supplier_id === summary.fastestDeliveryId

                  return (
                    <TableRow
                      key={supplier.supplier_id}
                      className={cn(
                        'transition-colors',
                        isSelected && 'bg-blue-50',
                        'hover:bg-muted/50'
                      )}
                    >
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelection(supplier.supplier_id)}
                          aria-label={`选择 ${supplier.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-xs text-muted-foreground">{supplier.supplier_id}</div>
                        {isLowestRisk && (
                          <Badge variant="outline" className="mt-1 text-[10px] bg-green-50 text-green-700 border-green-200">
                            <Shield className="h-3 w-3 mr-0.5" />
                            风险最低
                          </Badge>
                        )}
                        {isLowestCost && (
                          <Badge variant="outline" className="mt-1 text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                            <TrendingDown className="h-3 w-3 mr-0.5" />
                            成本最优
                          </Badge>
                        )}
                        {isFastest && (
                          <Badge variant="outline" className="mt-1 text-[10px] bg-purple-50 text-purple-700 border-purple-200">
                            <Zap className="h-3 w-3 mr-0.5" />
                            交期最短
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          {supplier.region}
                        </div>
                      </TableCell>
                      <TableCell>
                        <CostIndicator delta={supplier.cost_delta} />
                      </TableCell>
                      <TableCell>
                        <LeadTimeIndicator delta={supplier.lead_time_delta} />
                      </TableCell>
                      <TableCell>
                        <RiskScoreBadge score={supplier.risk_score} />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {/* Qualifications */}
                          <div className="flex flex-wrap gap-0.5">
                            {supplier.qualifications.map((qual) => (
                              <QualificationBadge key={qual} qualification={qual} />
                            ))}
                          </div>
                          {/* Constraints */}
                          <div className="space-y-0.5">
                            {supplier.constraints.map((constraint) => (
                              <ConstraintBadge key={constraint} constraint={constraint} />
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleViewSupplierDetail(supplier.supplier_id)}
                          >
                            查看
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Constraint Legend */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-muted-foreground" />
              资格约束说明
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <span>区域限制</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 仅限大陆区域供货</li>
                  <li>• 需外汇结算（境外供应商）</li>
                  <li>• MOQ最低订货量要求</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileCheck className="h-4 w-4 text-green-600" />
                  <span>认证要求</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• AEC-Q100 车规级认证</li>
                  <li>• ASIL-D 功能安全最高等级</li>
                  <li>• 军工保密资质（如需）</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span>合规提醒</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 出口管制清单筛查</li>
                  <li>• 产能受限需提前预订</li>
                  <li>• 军工产品需专项审批</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compare Mode Indicator */}
        {compareMode && selectedSuppliers.size >= 2 && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GitCompare className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">对比模式已激活</div>
                    <div className="text-sm text-blue-700">
                      已选择 {selectedSuppliers.size} 个供应商进行详细对比
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSuppliers(new Set())
                      setCompareMode(false)
                    }}
                  >
                    清除选择
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleGoToOptimization}
                  >
                    在优化中心深度分析
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}

export default AlternativeComparison
