import { MapPin, Building2 } from 'lucide-react'
import { toast } from 'sonner'

import { SeverityBadge } from '@/components/common/SeverityBadge'
import type { Severity } from '@/types/enums'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RankingItem {
  id: string
  name: string
  eventCount: number
  severity: Severity
}

interface NodeRankingProps {
  topRegions: RankingItem[]
  topSites: RankingItem[]
}

// ---------------------------------------------------------------------------
// Ranking list
// ---------------------------------------------------------------------------

function RankingList({
  title,
  icon,
  items,
}: {
  title: string
  icon: React.ReactNode
  items: RankingItem[]
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted"
            onClick={() => toast.info(`定位到: ${item.name}`)}
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
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NodeRanking({ topRegions, topSites }: NodeRankingProps) {
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
      />
    </div>
  )
}
