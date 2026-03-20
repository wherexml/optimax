/**
 * War Room - Timeline Component
 *
 * FE-074: 完整事件时间线
 * - 纵向时间线：事件升级、任务变化、审批记录、通知回执
 */

import { useMemo } from 'react'
import {
  ArrowRight,
  UserPlus,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  FileText,
  Upload,
  Star,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Minus,
  Edit3,
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import type { WarRoomActivity, WarRoomActivityType } from '@/types/solution'
import { getActivityTypeLabel, getActivityTypeColor } from '@/mocks/data/warroom-activities'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WarRoomTimelineProps {
  activities: WarRoomActivity[]
  className?: string
}

// ---------------------------------------------------------------------------
// Activity Icon
// ---------------------------------------------------------------------------

function ActivityIcon({ type }: { type: WarRoomActivityType }) {
  const icons: Record<WarRoomActivityType, React.ElementType> = {
    case_created: Plus,
    case_escalated: AlertTriangle,
    task_created: Plus,
    task_status_changed: ArrowRight,
    task_assigned: UserPlus,
    solution_proposed: Star,
    solution_approved: ThumbsUp,
    solution_rejected: ThumbsDown,
    minute_created: FileText,
    minute_updated: Edit3,
    attachment_uploaded: Upload,
    participant_added: Plus,
    participant_removed: Minus,
    comment_added: MessageSquare,
    decision_made: CheckCircle,
  }

  const Icon = icons[type] || ArrowRight
  return <Icon className="h-4 w-4" />
}

// ---------------------------------------------------------------------------
// Activity Item
// ---------------------------------------------------------------------------

function ActivityItem({
  activity,
  isLast,
}: {
  activity: WarRoomActivity
  isLast: boolean
}) {
  const colorClass = getActivityTypeColor(activity.type)

  return (
    <div className="relative flex gap-3 pb-6">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />
      )}

      {/* Icon node */}
      <div
        className={cn(
          'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          colorClass
        )}
      >
        <ActivityIcon type={activity.type} />
      </div>

      {/* Content */}
      <div className="flex-1 pt-0.5">
        <div className="flex items-center gap-2">
          <Avatar className="h-5 w-5">
            {activity.actor.avatar && <AvatarImage src={activity.actor.avatar} />}
            <AvatarFallback className="text-[10px]">
              {activity.actor.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{activity.actor.name}</span>
          <Badge variant="outline" className="text-[10px] h-5">
            {getActivityTypeLabel(activity.type)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(activity.created_at), {
              addSuffix: true,
              locale: zhCN,
            })}
          </span>
        </div>

        <p className="mt-1 text-sm text-foreground">{activity.description}</p>

        {/* State change display */}
        {activity.from_state && activity.to_state && (
          <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5">{activity.from_state}</span>
            <ArrowRight className="h-3 w-3" />
            <span className="rounded bg-muted px-1.5 py-0.5">{activity.to_state}</span>
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground mt-1">
          {format(new Date(activity.created_at), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function WarRoomTimeline({ activities, className }: WarRoomTimelineProps) {
  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups: { date: string; activities: WarRoomActivity[] }[] = []

    activities.forEach((activity) => {
      const date = format(new Date(activity.created_at), 'yyyy-MM-dd', { locale: zhCN })
      const existingGroup = groups.find((g) => g.date === date)

      if (existingGroup) {
        existingGroup.activities.push(activity)
      } else {
        groups.push({ date, activities: [activity] })
      }
    })

    return groups
  }, [activities])

  return (
    <div className={cn('h-full flex flex-col', className)}>
      <ScrollArea className="flex-1">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-blue-500" />
              事件时间线
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              共 {activities.length} 条活动记录
            </p>
          </div>

          {/* Timeline */}
          {activities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ArrowRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无活动记录</p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedActivities.map((group) => (
                <div key={group.date}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-sm font-medium text-muted-foreground bg-slate-100 px-3 py-1 rounded-full">
                      {group.date === format(new Date(), 'yyyy-MM-dd') ? '今天' : group.date}
                    </div>
                    <Separator className="flex-1" />
                  </div>
                  <div className="space-y-0">
                    {group.activities.map((activity, idx) => (
                      <ActivityItem
                        key={activity.activity_id}
                        activity={activity}
                        isLast={
                          idx === group.activities.length - 1 &&
                          group.date === groupedActivities[groupedActivities.length - 1].date
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
