import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface DashboardSkeletonProps {
  className?: string
}

export function DashboardSkeleton({ className }: DashboardSkeletonProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* KPI Cards Row - 5 cards */}
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Chart Row 1 - left wide, right narrow */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-lg border bg-card p-4 space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="rounded-lg border bg-card p-4 space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>

      {/* Chart Row 2 - left wide, right narrow */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-lg border bg-card p-4 space-y-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="rounded-lg border bg-card p-4 space-y-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>

      {/* Bottom List */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <Skeleton className="h-4 w-36" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}
