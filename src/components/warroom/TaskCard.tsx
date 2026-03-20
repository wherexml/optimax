/**
 * War Room - Task Card Component
 *
 * Individual task card for the kanban board.
 */

import { useMemo } from 'react'
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  RotateCcw,
  User,
  MoreHorizontal,
  FileText,
  Shield,
  Bell,
  Zap,
  Gavel,
} from 'lucide-react'
import { format, differenceInHours, differenceInDays, isPast, isToday } from 'date-fns'
import { zhCN } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import type { CaseTask } from '@/types/case'
import type { Severity, TaskType } from '@/types/enums'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TaskCardProps {
  task: CaseTask
  onStatusChange?: (taskId: string, newStatus: string) => void
  onAssign?: (taskId: string) => void
  onClick?: (task: CaseTask) => void
  className?: string
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const taskTypeConfig: Record<TaskType, { icon: React.ElementType; label: string; color: string }> = {
  investigation: { icon: FileText, label: '调查', color: 'text-blue-600 bg-blue-50' },
  mitigation: { icon: Shield, label: '缓解', color: 'text-green-600 bg-green-50' },
  notification: { icon: Bell, label: '通知', color: 'text-purple-600 bg-purple-50' },
  approval: { icon: Gavel, label: '审批', color: 'text-amber-600 bg-amber-50' },
  execution: { icon: Zap, label: '执行', color: 'text-red-600 bg-red-50' },
}

const priorityConfig: Record<Severity, { label: string; color: string; dot: string }> = {
  critical: { label: 'P0', color: 'text-red-600 bg-red-50 border-red-200', dot: 'bg-red-500' },
  high: { label: 'P1', color: 'text-orange-600 bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
  medium: { label: 'P2', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500' },
  low: { label: 'P3', color: 'text-green-600 bg-green-50 border-green-200', dot: 'bg-green-500' },
  info: { label: 'P4', color: 'text-blue-600 bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
}

// ---------------------------------------------------------------------------
// Due Date Display
// ---------------------------------------------------------------------------

function DueDateDisplay({ dueAt, status }: { dueAt: string; status: string }) {
  const dueInfo = useMemo(() => {
    const due = new Date(dueAt)
    const now = new Date()
    const isOverdue = isPast(due) && status !== 'completed'
    const isDueToday = isToday(due)
    const daysLeft = differenceInDays(due, now)
    const hoursLeft = differenceInHours(due, now)

    if (isOverdue) {
      const days = Math.abs(daysLeft)
      const hours = Math.abs(hoursLeft)
      return {
        text: days >= 1 ? `超时 ${days} 天` : `超时 ${hours} 小时`,
        color: 'text-red-600 bg-red-50',
        icon: AlertCircle,
      }
    }

    if (isDueToday) {
      return {
        text: '今天截止',
        color: 'text-amber-600 bg-amber-50',
        icon: Clock,
      }
    }

    if (daysLeft === 1) {
      return {
        text: '明天截止',
        color: 'text-amber-600 bg-amber-50',
        icon: Clock,
      }
    }

    if (daysLeft > 1) {
      return {
        text: `${daysLeft} 天后截止`,
        color: 'text-slate-600 bg-slate-50',
        icon: Clock,
      }
    }

    return {
      text: `${hoursLeft} 小时后截止`,
      color: 'text-amber-600 bg-amber-50',
      icon: Clock,
    }
  }, [dueAt, status])

  const Icon = dueInfo.icon

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium', dueInfo.color)}>
            <Icon className="h-3 w-3" />
            {dueInfo.text}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>截止时间: {format(new Date(dueAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function TaskCard({
  task,
  onStatusChange,
  onAssign,
  onClick,
  className,
}: TaskCardProps) {
  const typeConfig = taskTypeConfig[task.type]
  const priority = priorityConfig[task.priority]
  const TypeIcon = typeConfig.icon

  const isOverdue = task.status === 'overdue'

  return (
    <div
      className={cn(
        'group bg-white border rounded-lg p-4 cursor-pointer transition-all duration-200',
        'hover:shadow-md hover:border-blue-300',
        isOverdue && 'border-red-300 bg-red-50/30',
        className
      )}
      onClick={() => onClick?.(task)}
    >
      {/* Header: Type and Priority */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn('flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium', typeConfig.color)}>
            <TypeIcon className="h-3 w-3" />
            {typeConfig.label}
          </div>
          {task.approval_required && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-300 text-amber-700">
              需审批
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className={cn('w-2 h-2 rounded-full', priority.dot)} />
          <span className="text-xs font-medium text-muted-foreground">{priority.label}</span>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-foreground mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {task.title}
      </h4>

      {/* Description (if available) */}
      {task.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer: Assignee and Due Date */}
      <div className="flex items-center justify-between pt-3 border-t border-dashed">
        {/* Assignee */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">
                    {task.owner_name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{task.owner_name}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>负责人: {task.owner_name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Due Date */}
        <DueDateDisplay dueAt={task.due_at} status={task.status} />
      </div>

      {/* Quick Actions (visible on hover) */}
      <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={(e) => {
            e.stopPropagation()
            onStatusChange?.(task.task_id, 'in_progress')
          }}
        >
          <Circle className="h-3 w-3 mr-1" />
          领取
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={(e) => {
            e.stopPropagation()
            onAssign?.(task.task_id)
          }}
        >
          <User className="h-3 w-3 mr-1" />
          转派
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange?.(task.task_id, 'in_progress') }}>
              <Circle className="h-4 w-4 mr-2" />
              标记进行中
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange?.(task.task_id, 'completed') }}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              标记完成
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAssign?.(task.task_id) }}>
              <RotateCcw className="h-4 w-4 mr-2" />
              转派任务
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
