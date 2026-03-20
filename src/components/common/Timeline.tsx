import { useState } from 'react'
import {
  ArrowRight,
  UserPlus,
  MessageSquare,
  AlertTriangle,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Send,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import type { ActivityType } from '@/types/enums'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TimelineItemData {
  id: string
  /** Activity type determines the icon and color */
  type: ActivityType
  /** User who performed the action */
  actor: {
    name: string
    avatar?: string
  }
  /** Timestamp string */
  time: string
  /** Human-readable action description */
  description: string
  /** Previous state value (for state changes) */
  fromState?: string
  /** New state value (for state changes) */
  toState?: string
  /** For approval type: approved or rejected */
  approved?: boolean
}

interface TimelineProps {
  /** Timeline items (newest first or oldest first, consumer decides) */
  items: TimelineItemData[]
  /** Show the comment input at the bottom */
  showCommentInput?: boolean
  /** Callback when a comment is submitted */
  onComment?: (text: string) => void
  /** Additional className */
  className?: string
}

interface TimelineItemProps {
  item: TimelineItemData
  isLast: boolean
}

// ---------------------------------------------------------------------------
// Icon config
// ---------------------------------------------------------------------------

type IconConfig = {
  icon: React.ElementType
  color: string
  bg: string
}

function getActivityIcon(type: ActivityType, approved?: boolean): IconConfig {
  switch (type) {
    case 'status_change':
      return { icon: ArrowRight, color: 'text-blue-600', bg: 'bg-blue-100' }
    case 'assignment':
      return { icon: UserPlus, color: 'text-purple-600', bg: 'bg-purple-100' }
    case 'comment':
      return { icon: MessageSquare, color: 'text-gray-600', bg: 'bg-gray-100' }
    case 'severity_change':
      return {
        icon: AlertTriangle,
        color: 'text-orange-600',
        bg: 'bg-orange-100',
      }
    case 'mapping_change':
      return { icon: LinkIcon, color: 'text-green-600', bg: 'bg-green-100' }
    case 'approval':
      return approved
        ? { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' }
        : { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
    default:
      return { icon: ArrowRight, color: 'text-gray-600', bg: 'bg-gray-100' }
  }
}

// ---------------------------------------------------------------------------
// TimelineItem
// ---------------------------------------------------------------------------

export function TimelineItem({ item, isLast }: TimelineItemProps) {
  const { icon: Icon, color, bg } = getActivityIcon(item.type, item.approved)

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
          bg
        )}
      >
        <Icon className={cn('h-4 w-4', color)} />
      </div>

      {/* Content */}
      <div className="flex-1 pt-0.5">
        <div className="flex items-center gap-2">
          <Avatar className="h-5 w-5">
            {item.actor.avatar && <AvatarImage src={item.actor.avatar} />}
            <AvatarFallback className="text-[10px]">
              {item.actor.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{item.actor.name}</span>
          <span className="text-xs text-muted-foreground">{item.time}</span>
        </div>

        <p className="mt-1 text-sm text-foreground">{item.description}</p>

        {/* State change display */}
        {item.fromState && item.toState && (
          <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5">
              {item.fromState}
            </span>
            <ArrowRight className="h-3 w-3" />
            <span className="rounded bg-muted px-1.5 py-0.5">
              {item.toState}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

export function Timeline({
  items,
  showCommentInput = false,
  onComment,
  className,
}: TimelineProps) {
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    const text = comment.trim()
    if (!text) return
    onComment?.(text)
    setComment('')
  }

  return (
    <div className={cn('space-y-0', className)}>
      {/* Timeline items */}
      <div>
        {items.map((item, idx) => (
          <TimelineItem
            key={item.id}
            item={item}
            isLast={idx === items.length - 1 && !showCommentInput}
          />
        ))}
      </div>

      {/* Comment input */}
      {showCommentInput && (
        <div className="relative flex gap-3">
          {/* Vertical line connector */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-border" />
          </div>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="添加评论..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmit()
                }
              }}
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!comment.trim()}
              >
                <Send className="mr-1 h-4 w-4" />
                发送
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
