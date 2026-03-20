/**
 * Report Data Block Component
 * Supports various data block types: metrics, charts, tables, event summaries, map snapshots
 */

import { useState } from 'react'
import {
  GripVertical,
  X,
  Settings,
  BarChart3,
  Table as TableIcon,
  FileText,
  MapPin,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { StatusBadge } from '@/components/common/StatusBadge'
import type { ReportContentBlock } from '@/mocks/data/reports'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DataBlockType =
  | 'metric'
  | 'chart'
  | 'table'
  | 'event_summary'
  | 'map_snapshot'
  | 'case_conclusion'
  | 'text'

interface DataBlockProps {
  block: ReportContentBlock
  isVisible?: boolean
  isDraggable?: boolean
  isSelected?: boolean
  onSelect?: () => void
  onRemove?: () => void
  onConfigure?: () => void
  onToggleVisibility?: (visible: boolean) => void
  className?: string
}

interface MetricBlockData {
  newEvents: number
  highRisk: number
  resolved: number
  pending: number
}

interface EventSummaryData {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: string
  occurredAt: string
  affectedSuppliers: number
  affectedOrders: number
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

const blockTypeConfig: Record<
  DataBlockType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  metric: {
    label: '指标卡',
    icon: <Activity className="h-4 w-4" />,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  chart: {
    label: '图表',
    icon: <BarChart3 className="h-4 w-4" />,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  table: {
    label: '表格',
    icon: <TableIcon className="h-4 w-4" />,
    color: 'bg-violet-50 text-violet-700 border-violet-200',
  },
  event_summary: {
    label: '事件摘要',
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  map_snapshot: {
    label: '地图快照',
    icon: <MapPin className="h-4 w-4" />,
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  case_conclusion: {
    label: 'Case 结论',
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  text: {
    label: '文本',
    icon: <FileText className="h-4 w-4" />,
    color: 'bg-gray-50 text-gray-700 border-gray-200',
  },
}

// ---------------------------------------------------------------------------
// Block Content Components
// ---------------------------------------------------------------------------

function MetricBlock({ content }: { content: string }) {
  let data: MetricBlockData
  try {
    data = JSON.parse(content)
  } catch {
    data = { newEvents: 0, highRisk: 0, resolved: 0, pending: 0 }
  }

  const metrics = [
    { label: '新增事件', value: data.newEvents, color: 'text-blue-600' },
    { label: '高危事件', value: data.highRisk, color: 'text-red-600' },
    { label: '已处置', value: data.resolved, color: 'text-emerald-600' },
    { label: '待处理', value: data.pending, color: 'text-amber-600' },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="text-center">
          <div className={cn('text-2xl font-bold', metric.color)}>
            {metric.value}
          </div>
          <div className="text-xs text-muted-foreground">{metric.label}</div>
        </div>
      ))}
    </div>
  )
}

function ChartBlock() {
  // Simplified chart placeholder
  return (
    <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg border border-dashed">
      <div className="text-center">
        <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <span className="text-sm text-muted-foreground">图表占位符</span>
        <p className="text-xs text-muted-foreground mt-1">配置图表数据...</p>
      </div>
    </div>
  )
}

function TableBlock({ _content: _unused }: { _content: string }) {
  // Simplified table placeholder
  const rows = [
    { name: '供应商A', risk: '高', orders: 45 },
    { name: '供应商B', risk: '中', orders: 32 },
    { name: '供应商C', risk: '低', orders: 28 },
  ]

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-3 py-2 text-left font-medium">供应商</th>
            <th className="px-3 py-2 text-left font-medium">风险等级</th>
            <th className="px-3 py-2 text-right font-medium">关联订单</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t">
              <td className="px-3 py-2">{row.name}</td>
              <td className="px-3 py-2">
                <SeverityBadge severity={row.risk as 'high' | 'medium' | 'low'} size="sm" />
              </td>
              <td className="px-3 py-2 text-right">{row.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EventSummaryBlock({ content }: { content: string }) {
  let events: EventSummaryData[]
  try {
    events = JSON.parse(content)
  } catch {
    events = [
      {
        id: 'evt-001',
        title: '泰国洪灾影响评估',
        severity: 'critical',
        status: 'in_progress',
        occurredAt: '2026-03-15T08:00:00Z',
        affectedSuppliers: 5,
        affectedOrders: 125,
      },
      {
        id: 'evt-002',
        title: '原材料价格异常波动',
        severity: 'high',
        status: 'new',
        occurredAt: '2026-03-18T14:30:00Z',
        affectedSuppliers: 3,
        affectedOrders: 68,
      },
    ]
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className="border rounded-lg p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <SeverityBadge severity={event.severity} size="sm" />
                <span className="font-medium text-sm">{event.title}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                影响 {event.affectedSuppliers} 家供应商 · {event.affectedOrders} 个订单
              </div>
            </div>
            <StatusBadge status={event.status as 'new' | 'in_progress' | 'resolved' | 'archived' | 'rejected'} size="sm" />
          </div>
        </div>
      ))}
    </div>
  )
}

function MapSnapshotBlock({ content }: { content: string }) {
  let snapshotData: { imageUrl?: string; filters?: Record<string, unknown> }
  try {
    snapshotData = JSON.parse(content)
  } catch {
    snapshotData = {}
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {snapshotData.imageUrl ? (
        <img
          src={snapshotData.imageUrl}
          alt="地图快照"
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="h-48 bg-muted/30 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">地图快照占位符</span>
          </div>
        </div>
      )}
      <div className="px-3 py-2 bg-muted/30 text-xs text-muted-foreground">
        风险分布地图 · 20 个节点
      </div>
    </div>
  )
}

function CaseConclusionBlock({ content }: { content: string }) {
  return (
    <div className="border-l-4 border-emerald-500 bg-emerald-50/50 pl-4 py-3 pr-3 rounded-r-lg">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        <span className="font-medium text-sm">处置结论</span>
      </div>
      <div className="text-sm text-muted-foreground">
        {content || 'Case 处置结论将在此处显示...'}
      </div>
    </div>
  )
}

function TextBlock({ content }: { content: string }) {
  // Simple markdown-like rendering
  const lines = content.split('\n')
  return (
    <div className="prose prose-sm max-w-none">
      {lines.map((line, i) => {
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(2)}</h1>
        }
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-lg font-semibold mt-3 mb-2">{line.slice(3)}</h2>
        }
        if (line.startsWith('- ')) {
          return <li key={i} className="ml-4">{line.slice(2)}</li>
        }
        if (line.trim() === '') {
          return <div key={i} className="h-2" />
        }
        return <p key={i} className="text-sm leading-relaxed">{line}</p>
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function DataBlock({
  block,
  isVisible = true,
  isDraggable = false,
  isSelected = false,
  onSelect,
  onRemove,
  onConfigure,
  onToggleVisibility,
  className,
}: DataBlockProps) {
  const [isHovered, setIsHovered] = useState(false)
  const typeConfig = blockTypeConfig[block.type as DataBlockType] || blockTypeConfig.text

  const renderContent = () => {
    switch (block.type) {
      case 'metric':
        return <MetricBlock content={block.content} />
      case 'chart':
        return <ChartBlock />
      case 'table':
        return <TableBlock _content={block.content} />
      case 'event_summary':
        return <EventSummaryBlock content={block.content} />
      case 'map_snapshot':
        return <MapSnapshotBlock content={block.content} />
      case 'case_conclusion':
        return <CaseConclusionBlock content={block.content} />
      case 'text':
      default:
        return <TextBlock content={block.content} />
    }
  }

  return (
    <Card
      className={cn(
        'relative transition-all duration-200 cursor-pointer',
        !isVisible && 'opacity-50',
        isHovered && 'shadow-md',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* Block Header */}
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          {isDraggable && (
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          )}
          <Badge
            variant="outline"
            className={cn('text-xs flex items-center gap-1', typeConfig.color)}
          >
            {typeConfig.icon}
            {typeConfig.label}
          </Badge>
          {block.config?.title && typeof block.config.title === 'string' ? (
            <span className="text-sm font-medium">{block.config.title}</span>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          {/* Visibility Toggle */}
          {onToggleVisibility && (
            <div className="flex items-center gap-1.5 mr-2">
              <Switch
                checked={isVisible}
                onCheckedChange={onToggleVisibility}
                className="scale-75"
              />
              <Label className="text-xs text-muted-foreground cursor-pointer">
                {isVisible ? '显示' : '隐藏'}
              </Label>
            </div>
          )}

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onConfigure}>
                <Settings className="mr-2 h-4 w-4" />
                配置
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onRemove} className="text-destructive">
                <X className="mr-2 h-4 w-4" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Block Content */}
      <CardContent className="pt-0">
        {renderContent()}
      </CardContent>
    </Card>
  )
}

export default DataBlock
