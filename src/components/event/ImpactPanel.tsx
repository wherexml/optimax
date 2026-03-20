import {
  Download,
  ShoppingCart,
  DollarSign,
  Clock,
  Package,
  Crown,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ImpactDetail {
  id: string
  name: string
  type: string
  amount: string
  status: string
}

interface ImpactPanelProps {
  className?: string
}

// ---------------------------------------------------------------------------
// Mock KPI data
// ---------------------------------------------------------------------------

const kpiItems = [
  {
    title: '影响订单数',
    value: '12',
    icon: ShoppingCart,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: '影响金额',
    value: '¥2,580万',
    icon: DollarSign,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  {
    title: '交付延迟估计',
    value: '7天',
    icon: Clock,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    title: '库存缓冲',
    value: '14天',
    icon: Package,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    title: '受影响客户等级',
    value: 'A级',
    icon: Crown,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
]

// ---------------------------------------------------------------------------
// Mock detail data
// ---------------------------------------------------------------------------

const impactDetails: ImpactDetail[] = [
  { id: '1', name: 'PO-2026-03-0158', type: '采购订单', amount: '¥680万', status: '延迟中' },
  { id: '2', name: 'PO-2026-03-0231', type: '采购订单', amount: '¥520万', status: '风险预警' },
  { id: '3', name: '华为终端-Q1批次', type: '客户订单', amount: '¥890万', status: '延迟中' },
  { id: '4', name: '苏州工厂 A 区', type: '生产站点', amount: '¥320万', status: '部分受影响' },
  { id: '5', name: 'MLCC 电容安全库存', type: '库存', amount: '¥170万', status: '低于警戒线' },
]

const statusColors: Record<string, string> = {
  '延迟中': 'bg-red-50 text-red-700 border-red-200',
  '风险预警': 'bg-orange-50 text-orange-700 border-orange-200',
  '部分受影响': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  '低于警戒线': 'bg-amber-50 text-amber-700 border-amber-200',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ImpactPanel({ className }: ImpactPanelProps) {
  const handleExport = () => {
    toast.success('导出成功', { description: '影响量化报告已开始下载' })
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {kpiItems.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.title} className="p-3">
              <CardContent className="p-0">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      kpi.bg,
                    )}
                  >
                    <Icon className={cn('h-4 w-4', kpi.color)} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground truncate">{kpi.title}</p>
                    <p className="text-lg font-bold leading-tight">{kpi.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Impact Detail Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">影响明细</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            导出
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead className="text-right">影响金额</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {impactDetails.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{item.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn('text-xs', statusColors[item.status])}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
