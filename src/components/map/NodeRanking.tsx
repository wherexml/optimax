import { useState } from 'react'
import { MapPin, Building2, Factory, ChevronRight, ExternalLink, Navigation } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

import { SeverityBadge } from '@/components/common/SeverityBadge'
import type { Severity } from '@/types/enums'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RankingItem {
  id: string
  name: string
  eventCount: number
  severity: Severity
  lat?: number
  lng?: number
  nodeId?: string
}

interface NodeRankingProps {
  topRegions: RankingItem[]
  topSites: RankingItem[]
  topSuppliers?: RankingItem[]
  onFocusNode?: (nodeId: string) => void
}

// ---------------------------------------------------------------------------
// Ranking list
// ---------------------------------------------------------------------------

function RankingList({
  title,
  icon,
  items,
  onItemClick,
}: {
  title: string
  icon: React.ReactNode
  items: RankingItem[]
  onItemClick?: (item: RankingItem) => void
}) {
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggle = (item: RankingItem) => {
    if (expandedId === item.id) {
      setExpandedId(null)
    } else {
      setExpandedId(item.id)
      onItemClick?.(item)
    }
  }

  const handleViewDetail = (item: RankingItem, e: React.MouseEvent) => {
    e.stopPropagation()
    if (item.nodeId) {
      navigate({ to: '/suppliers/$supplierId', params: { supplierId: item.nodeId } })
    } else {
      toast.info(`查看 ${item.name} 详情`)
    }
  }

  const handleFocusOnMap = (item: RankingItem, e: React.MouseEvent) => {
    e.stopPropagation()
    onItemClick?.(item)
    toast.success(`已定位: ${item.name}`)
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="text-sm font-semibold">{title}</h4>
        </div>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
          查看全部
          <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
      <div className="space-y-1">
        {items.map((item, idx) => (
          <Collapsible
            key={item.id}
            open={expandedId === item.id}
            onOpenChange={() => handleToggle(item)}
          >
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    idx < 3
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="flex-1 truncate">{item.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {item.eventCount} 件
                </span>
                <SeverityBadge severity={item.severity} size="sm" />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-2 pb-2 pl-9">
                <div className="rounded-md border bg-muted/50 px-3 py-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">事件数量</span>
                      <span className="font-medium">{item.eventCount} 件</span>
                    </div>
                    {item.lat && item.lng && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">坐标</span>
                        <span className="font-mono text-muted-foreground">
                          {item.lat.toFixed(1)}, {item.lng.toFixed(1)}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      {item.nodeId && onItemClick && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={(e) => handleFocusOnMap(item, e)}
                        >
                          <Navigation className="mr-1 h-3 w-3" />
                          地图定位
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={(e) => handleViewDetail(item, e)}
                      >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        查看详情
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NodeRanking({
  topRegions,
  topSites,
  topSuppliers = [],
  onFocusNode,
}: NodeRankingProps) {
  const handleItemClick = (item: RankingItem) => {
    if (item.nodeId && onFocusNode) {
      onFocusNode(item.nodeId)
    }
  }

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold">风险排行</h3>
      <RankingList
        title="Top 风险区域"
        icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
        items={topRegions}
      />
      <div className="my-4 border-t" />
      <RankingList
        title="Top 风险站点"
        icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
        items={topSites}
        onItemClick={handleItemClick}
      />
      {topSuppliers.length > 0 && (
        <>
          <div className="my-4 border-t" />
          <RankingList
            title="Top 风险供应商"
            icon={<Factory className="h-4 w-4 text-muted-foreground" />}
            items={topSuppliers}
            onItemClick={handleItemClick}
          />
        </>
      )}
    </div>
  )
}
