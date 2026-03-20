import { Layers } from 'lucide-react'

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LayerControl({ layers, onChange }: LayerControlProps) {
  const toggle = (key: keyof LayerState) => {
    onChange({ ...layers, [key]: !layers[key] })
  }

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
            checked={layers[item.key]}
            onCheckedChange={() => toggle(item.key)}
          />
        </div>
      ))}
    </div>
  )

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Layers className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">图层控制</h3>
      </div>

      {renderGroup('风险类型', riskTypeLayers)}
      <Separator className="my-4" />
      {renderGroup('节点类型', nodeTypeLayers)}
      <Separator className="my-4" />
      {renderGroup('严重级别', severityLayers)}
    </div>
  )
}
