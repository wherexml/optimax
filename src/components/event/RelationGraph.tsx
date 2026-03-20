import {
  Factory,
  MapPin,
  Package,
  FileText,
  Globe2,
  Users,
  ChevronRight,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import type { ImpactObject } from '@/types/event'
import type { ImpactObjectType } from '@/types/enums'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const typeConfig: Record<
  ImpactObjectType,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  supplier: { label: '供应商', icon: Factory, color: 'text-blue-600', bg: 'bg-blue-50' },
  site: { label: '站点', icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50' },
  material: { label: '物料', icon: Package, color: 'text-green-600', bg: 'bg-green-50' },
  order: { label: '订单', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
  region: { label: '区域', icon: Globe2, color: 'text-teal-600', bg: 'bg-teal-50' },
  customer: { label: '客户', icon: Users, color: 'text-rose-600', bg: 'bg-rose-50' },
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface RelationGraphProps {
  eventTitle: string
  impactObjects: ImpactObject[]
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RelationGraph({ eventTitle, impactObjects, className }: RelationGraphProps) {
  // Group by type
  const grouped = impactObjects.reduce<Record<string, ImpactObject[]>>((acc, obj) => {
    ;(acc[obj.type] ??= []).push(obj)
    return acc
  }, {})

  const handleNodeClick = (obj: ImpactObject) => {
    toast.info(`跳转到 ${typeConfig[obj.type].label}：${obj.name}`, {
      description: '功能开发中...',
    })
  }

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">关联对象图谱</CardTitle>
        <p className="text-xs text-muted-foreground">
          共 {impactObjects.length} 个关联对象
        </p>
      </CardHeader>
      <CardContent>
        {/* Root node */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-sm font-medium truncate">{eventTitle}</span>
            <Badge variant="outline" className="ml-auto text-[10px] shrink-0">
              风险事件
            </Badge>
          </div>

          {/* Grouped children */}
          <div className="ml-4 border-l pl-4 space-y-3 pt-2">
            {Object.entries(grouped).map(([type, objects]) => {
              const config = typeConfig[type as ImpactObjectType]
              const Icon = config.icon

              return (
                <div key={type} className="space-y-1">
                  {/* Group label */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Icon className={cn('h-3.5 w-3.5', config.color)} />
                    <span className="font-medium">{config.label}</span>
                    <span className="text-muted-foreground/60">({objects.length})</span>
                  </div>

                  {/* Nodes */}
                  {objects.map((obj) => {
                    const isLowConfidence = obj.confidence < 70

                    return (
                      <Button
                        key={obj.id}
                        variant="ghost"
                        className={cn(
                          'w-full justify-between h-auto py-2 px-3 hover:bg-muted/50',
                          isLowConfidence && 'border border-dashed border-orange-300',
                        )}
                        onClick={() => handleNodeClick(obj)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded', config.bg)}>
                            <Icon className={cn('h-3.5 w-3.5', config.color)} />
                          </div>
                          <span
                            className={cn(
                              'text-sm truncate',
                              isLowConfidence ? 'text-orange-600' : 'text-foreground',
                            )}
                          >
                            {obj.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={cn(
                              'text-xs font-medium',
                              isLowConfidence ? 'text-orange-500' : 'text-muted-foreground',
                            )}
                          >
                            {obj.confidence}%
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      </Button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
