import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer } from 'recharts'

import { cn } from '@/lib/utils'
import type { Trend } from '@/types/enums'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface KPICardProps {
  /** Main metric value (rendered large) */
  value: string | number
  /** Card title (small gray text) */
  title: string
  /** Trend direction */
  trend?: Trend
  /** Percentage change text (e.g., "+12.5%") */
  trendLabel?: string
  /** Mini sparkline data points */
  sparklineData?: number[]
  /** Tooltip text explaining the metric */
  description?: string
  /** Click handler for drill-down */
  onClick?: () => void
  /** Loading state */
  isLoading?: boolean
  /** Additional className */
  className?: string
}

// ---------------------------------------------------------------------------
// Trend Icon
// ---------------------------------------------------------------------------

function TrendIndicator({
  trend,
  label,
}: {
  trend: Trend
  label?: string
}) {
  const config = {
    up: { Icon: ArrowUp, color: 'text-green-600', bg: 'bg-green-50' },
    down: { Icon: ArrowDown, color: 'text-red-600', bg: 'bg-red-50' },
    stable: { Icon: Minus, color: 'text-gray-500', bg: 'bg-gray-50' },
  } as const

  const { Icon, color, bg } = config[trend]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium',
        color,
        bg
      )}
    >
      <Icon className="h-3 w-3" />
      {label && <span>{label}</span>}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Sparkline
// ---------------------------------------------------------------------------

function Sparkline({ data }: { data: number[] }) {
  const chartData = data.map((v, i) => ({ idx: i, val: v }))

  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="val"
          stroke="currentColor"
          strokeWidth={1.5}
          dot={false}
          className="text-muted-foreground"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------

function KPICardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('p-4', className)}>
      <div className="space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-24" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// KPICard
// ---------------------------------------------------------------------------

export function KPICard({
  value,
  title,
  trend,
  trendLabel,
  sparklineData,
  description,
  onClick,
  isLoading = false,
  className,
}: KPICardProps) {
  if (isLoading) {
    return <KPICardSkeleton className={className} />
  }

  const cardContent = (
    <Card
      className={cn(
        'p-4 transition-shadow',
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold leading-none tracking-tight">
              {value}
            </span>
            {trend && <TrendIndicator trend={trend} label={trendLabel} />}
          </div>
        </div>
        {sparklineData && sparklineData.length > 1 && (
          <div className="mt-3">
            <Sparkline data={sparklineData} />
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (description) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
          <TooltipContent>
            <p className="max-w-[200px] text-xs">{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return cardContent
}
