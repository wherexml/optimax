import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface MapSkeletonProps {
  className?: string
}

export function MapSkeleton({ className }: MapSkeletonProps) {
  return (
    <div className={cn('grid grid-cols-4 gap-4', className)} style={{ minHeight: 600 }}>
      {/* Map Area - large block */}
      <div className="col-span-3 rounded-lg border bg-card p-4 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        <Skeleton className="h-full min-h-[520px] w-full rounded-md" />
      </div>

      {/* Right Side - Ranking List */}
      <div className="rounded-lg border bg-card p-4 space-y-4">
        <Skeleton className="h-5 w-24" />
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
