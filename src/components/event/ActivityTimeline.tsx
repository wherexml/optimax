import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'
import type { EventActivity } from '@/types/event'
import type { TimelineItemData } from '@/components/common/Timeline'
import { Timeline } from '@/components/common/Timeline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ActivityTimelineProps {
  activities: EventActivity[]
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRelativeTime(isoStr: string): string {
  const now = Date.now()
  const then = new Date(isoStr).getTime()
  const diffMs = now - then
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  if (hours < 24) return `${hours} 小时前`
  if (days < 7) return `${days} 天前`
  return new Date(isoStr).toLocaleDateString('zh-CN')
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
  const [localActivities, setLocalActivities] = useState(activities)

  const timelineItems: TimelineItemData[] = useMemo(
    () =>
      localActivities.map((act) => ({
        id: act.id,
        type: act.type,
        actor: {
          name: act.actor_name,
          avatar: act.actor_avatar,
        },
        time: formatRelativeTime(act.timestamp),
        description: act.description,
        fromState: act.before_value,
        toState: act.after_value,
      })),
    [localActivities],
  )

  const handleComment = (text: string) => {
    const newActivity: EventActivity = {
      id: `comment-${Date.now()}`,
      actor_id: 'u-001',
      actor_name: '当前用户',
      action: text,
      description: text,
      timestamp: new Date().toISOString(),
      type: 'comment',
    }
    setLocalActivities((prev) => [newActivity, ...prev])
    toast.success('评论已添加')
  }

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">活动时间线</CardTitle>
        <p className="text-xs text-muted-foreground">
          共 {localActivities.length} 条活动记录
        </p>
      </CardHeader>
      <CardContent>
        <Timeline
          items={timelineItems}
          showCommentInput
          onComment={handleComment}
        />
      </CardContent>
    </Card>
  )
}
