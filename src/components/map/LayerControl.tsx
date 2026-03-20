import { useState, useCallback } from 'react'
import { Layers, RotateCcw, Save, Check, ChevronDown } from 'lucide-react'

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LayerState {
  // Risk types
  supplyDisruption: boolean
  qualityIssue: boolean
  geopolitical: boolean
  naturalDisaster: boolean
  cyberSecurity: boolean
  // Node types
  supplier: boolean
  site: boolean
  port: boolean
  // Severity levels
  critical: boolean
  high: boolean
  medium: boolean
  low: boolean
  // Time window
  timeWindow: '7d' | '30d' | '90d' | 'all'
  // Status filter
  showActive: boolean
  showResolved: boolean
}

export const defaultLayerState: LayerState = {
  supplyDisruption: true,
  qualityIssue: true,
  geopolitical: true,
  naturalDisaster: true,
  cyberSecurity: true,
  supplier: true,
  site: true,
  port: true,
  critical: true,
  high: true,
  medium: true,
  low: true,
  timeWindow: '30d',
  showActive: true,
  showResolved: false,
}

interface LayerControlProps {
  layers: LayerState
  onChange: (layers: LayerState) => void
}

// ---------------------------------------------------------------------------
// Layer group config
// ---------------------------------------------------------------------------

interface LayerItem {
  key: keyof LayerState
  label: string
}

const riskTypeLayers: LayerItem[] = [
  { key: 'supplyDisruption', label: '供应中断' },
  { key: 'qualityIssue', label: '质量问题' },
  { key: 'geopolitical', label: '地缘政治' },
  { key: 'naturalDisaster', label: '自然灾害' },
  { key: 'cyberSecurity', label: '网络安全' },
]

const nodeTypeLayers: LayerItem[] = [
  { key: 'supplier', label: '供应商' },
  { key: 'site', label: '站点' },
  { key: 'port', label: '港口' },
]

const severityLayers: LayerItem[] = [
  { key: 'critical', label: '严重' },
  { key: 'high', label: '高危' },
  { key: 'medium', label: '中危' },
  { key: 'low', label: '低危' },
]

const timeWindowOptions = [
  { value: '7d', label: '近7天' },
  { value: '30d', label: '近30天' },
  { value: '90d', label: '近90天' },
  { value: 'all', label: '全部' },
] as const

const statusOptions = [
  { key: 'showActive', label: '活跃中' },
  { key: 'showResolved', label: '已解决' },
] as const

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LayerControl({ layers, onChange }: LayerControlProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [savedViews, setSavedViews] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('riskMapSavedViews') || '[]')
    } catch {
      return []
    }
  })

  const toggle = (key: keyof LayerState) => {
    onChange({ ...layers, [key]: !layers[key] })
  }

  const resetAll = useCallback(() => {
    onChange(defaultLayerState)
    toast.success('已重置所有筛选条件')
  }, [onChange])

  const saveView = useCallback(() => {
    const viewName = `视图 ${new Date().toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}`
    const newViews = [...savedViews, viewName].slice(-5)
    setSavedViews(newViews)
    localStorage.setItem('riskMapSavedViews', JSON.stringify(newViews))
    toast.success(`已保存视图: ${viewName}`)
  }, [savedViews])

  const activeFiltersCount = Object.entries(layers).filter(([key, value]) => {
    if (['timeWindow'].includes(key)) return false
    if (typeof value === 'boolean') return !value
    return false
  }).length

  const renderGroup = (title: string, items: LayerItem[]) => (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      {items.map((item) => (
        <div key={item.key} className="flex items-center justify-between">
          <Label htmlFor={item.key} className="cursor-pointer text-sm">
            {item.label}
          </Label>
          <Switch
            id={item.key}
            checked={layers[item.key as keyof LayerState] as boolean}
            onCheckedChange={() => toggle(item.key as keyof LayerState)}
          />
        </div>
      ))}
    </div>
  )

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">图层控制</h3>
            {activeFiltersCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={resetAll}
              title="重置筛选"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={saveView}
              title="保存视图"
            >
              <Save className="h-3.5 w-3.5" />
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isOpen ? '' : '-rotate-90'}`}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent>
          {/* Time Window */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              时间范围
            </h4>
            <Select
              value={layers.timeWindow}
              onValueChange={(value) =>
                onChange({ ...layers, timeWindow: value as LayerState['timeWindow'] })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeWindowOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-4" />

          {/* Status Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              事件状态
            </h4>
            {statusOptions.map((opt) => (
              <div key={opt.key} className="flex items-center justify-between">
                <Label htmlFor={opt.key} className="cursor-pointer text-sm">
                  {opt.label}
                </Label>
                <Switch
                  id={opt.key}
                  checked={layers[opt.key as keyof LayerState] as boolean}
                  onCheckedChange={() => toggle(opt.key as keyof LayerState)}
                />
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {renderGroup('风险类型', riskTypeLayers)}
          <Separator className="my-4" />
          {renderGroup('节点类型', nodeTypeLayers)}
          <Separator className="my-4" />
          {renderGroup('严重级别', severityLayers)}

          {/* Saved Views */}
          {savedViews.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  已保存视图
                </h4>
                <div className="space-y-1">
                  {savedViews.map((view, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                    >
                      <Check className="h-3 w-3" />
                      <span className="truncate">{view}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
