import { X, ExternalLink } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import type { Severity } from '@/types/enums'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MapInfoWindowProps {
  /** Node / entity name */
  name: string
  /** 1-2 line risk summary */
  riskSummary: string
  /** Number of recent events */
  recentEventCount: number
  /** Risk severity level */
  severity: Severity
  /** "View details" click handler */
  onViewDetail?: () => void
  /** Close handler */
  onClose?: () => void
  /** Arrow direction pointing to the marker */
  arrowPosition?: 'bottom' | 'top' | 'left' | 'right'
  /** Additional className */
  className?: string
}

// ---------------------------------------------------------------------------
// Arrow CSS classes
// ---------------------------------------------------------------------------

const arrowClasses: Record<string, string> = {
  bottom:
    'left-1/2 -translate-x-1/2 -bottom-2 border-l-transparent border-r-transparent border-b-transparent border-l-[8px] border-r-[8px] border-t-[8px] border-t-white',
  top: 'left-1/2 -translate-x-1/2 -top-2 border-l-transparent border-r-transparent border-t-transparent border-l-[8px] border-r-[8px] border-b-[8px] border-b-white',
  left: 'top-1/2 -translate-y-1/2 -left-2 border-t-transparent border-b-transparent border-l-transparent border-t-[8px] border-b-[8px] border-r-[8px] border-r-white',
  right:
    'top-1/2 -translate-y-1/2 -right-2 border-t-transparent border-b-transparent border-r-transparent border-t-[8px] border-b-[8px] border-l-[8px] border-l-white',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MapInfoWindow({
  name,
  riskSummary,
  recentEventCount,
  severity,
  onViewDetail,
  onClose,
  arrowPosition = 'bottom',
  className,
}: MapInfoWindowProps) {
  return (
    <div
      className={cn(
        'relative w-[280px] rounded-lg border bg-white p-4 shadow-lg',
        className
      )}
    >
      {/* Close button */}
      <button
        type="button"
        className="absolute right-2 top-2 rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={onClose}
        aria-label="关闭"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Header */}
      <div className="mb-2 flex items-start gap-2 pr-6">
        <h4 className="text-sm font-bold leading-tight text-foreground">
          {name}
        </h4>
        <SeverityBadge severity={severity} size="sm" />
      </div>

      {/* Risk summary */}
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {riskSummary}
      </p>

      {/* Recent events */}
      <div className="mb-3 text-xs text-muted-foreground">
        最近事件:{' '}
        <span className="font-semibold text-foreground">
          {recentEventCount}
        </span>{' '}
        条
      </div>

      {/* Action */}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={onViewDetail}
      >
        <ExternalLink className="mr-1 h-3.5 w-3.5" />
        查看详情
      </Button>

      {/* CSS triangle arrow */}
      <div
        className={cn(
          'absolute h-0 w-0 border-solid',
          arrowClasses[arrowPosition]
        )}
      />
    </div>
  )
}
