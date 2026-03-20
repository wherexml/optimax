import { cn } from '@/lib/utils'
import type { EventStatus } from '@/types/enums'
import { status as statusTokens } from '@/lib/tokens/colors'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BadgeSize = 'sm' | 'md' | 'lg'

interface StatusBadgeProps {
  /** Event status */
  status: EventStatus
  /** Display size */
  size?: BadgeSize
  /** Additional className */
  className?: string
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

type StatusColorConfig = {
  label: string
  bg: string
  text: string
  border: string
  dot: string
}

const statusConfig: Record<EventStatus, StatusColorConfig> = {
  new: {
    label: '新入库',
    bg: statusTokens.new.bg,
    text: statusTokens.new.text,
    border: statusTokens.new.border,
    dot: statusTokens.new.DEFAULT,
  },
  merged: {
    label: '已归并',
    bg: statusTokens.archived.bg,
    text: statusTokens.archived.text,
    border: statusTokens.archived.border,
    dot: statusTokens.archived.DEFAULT,
  },
  pending_mapping: {
    label: '待映射',
    bg: statusTokens.investigating.bg,
    text: statusTokens.investigating.text,
    border: statusTokens.investigating.border,
    dot: statusTokens.investigating.DEFAULT,
  },
  pending_analysis: {
    label: '待分析',
    bg: statusTokens.investigating.bg,
    text: statusTokens.investigating.text,
    border: statusTokens.investigating.border,
    dot: statusTokens.investigating.DEFAULT,
  },
  alerted: {
    label: '已预警',
    bg: statusTokens.inProgress.bg,
    text: statusTokens.inProgress.text,
    border: statusTokens.inProgress.border,
    dot: statusTokens.inProgress.DEFAULT,
  },
  in_progress: {
    label: '处理中',
    bg: statusTokens.inProgress.bg,
    text: statusTokens.inProgress.text,
    border: statusTokens.inProgress.border,
    dot: statusTokens.inProgress.DEFAULT,
  },
  resolved: {
    label: '已解决',
    bg: statusTokens.resolved.bg,
    text: statusTokens.resolved.text,
    border: statusTokens.resolved.border,
    dot: statusTokens.resolved.DEFAULT,
  },
  archived: {
    label: '已归档',
    bg: statusTokens.archived.bg,
    text: statusTokens.archived.text,
    border: statusTokens.archived.border,
    dot: statusTokens.archived.DEFAULT,
  },
  rejected: {
    label: '已驳回',
    bg: statusTokens.rejected.bg,
    text: statusTokens.rejected.text,
    border: statusTokens.rejected.border,
    dot: statusTokens.rejected.DEFAULT,
  },
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[11px] gap-1',
  md: 'px-2 py-0.5 text-xs gap-1.5',
  lg: 'px-2.5 py-1 text-sm gap-1.5',
}

const dotSizes: Record<BadgeSize, string> = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-2 w-2',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StatusBadge({
  status,
  size = 'md',
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border,
      }}
    >
      <span
        className={cn('rounded-full', dotSizes[size])}
        style={{ backgroundColor: config.dot }}
      />
      {config.label}
    </span>
  )
}
