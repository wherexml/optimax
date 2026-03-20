import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface TableSkeletonProps {
  className?: string
  rows?: number
}

export function TableSkeleton({ className, rows = 10 }: TableSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Filter Bar - 3 bars */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-36" />
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        {/* Table Header - fixed 44px */}
        <div className="flex items-center gap-4 border-b px-4" style={{ height: 44 }}>
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-32 flex-1" />
          <Skeleton className="h-4 w-24 flex-1" />
          <Skeleton className="h-4 w-20 flex-1" />
          <Skeleton className="h-4 w-28 flex-1" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Table Rows - each 48px */}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b px-4 last:border-b-0"
            style={{ height: 48 }}
          >
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-40 flex-1" />
            <Skeleton className="h-4 w-20 flex-1" />
            <Skeleton className="h-4 w-16 flex-1" />
            <Skeleton className="h-4 w-24 flex-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  )
}
