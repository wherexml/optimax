/**
 * War Room - Case Summary Component
 *
 * Displays the case header with level badge, owner, participants,
 * SLA countdown, decision status, and action buttons.
 */

import { useMemo } from 'react'
import {
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  UserPlus,
  UserCog,
  X,
  ChevronRight,
} from 'lucide-react'
import { format, differenceInHours, differenceInMinutes, isPast } from 'date-fns'
import { zhCN } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import type { Case } from '@/types/case'
import type { CaseStatus } from '@/types/enums'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

interface CaseSummaryProps {
  caseData: Case
  onAddParticipant?: () => void
  onChangeOwner?: () => void
  onCloseCase?: () => void
  className?: string
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const caseStatusConfig: Record<CaseStatus, { label: string; color: string }> = {
  draft: { label: '草案', color: 'bg-gray-100 text-gray-700' },
  open: { label: '已开启', color: 'bg-blue-100 text-blue-700' },
  analyzing: { label: '分析中', color: 'bg-yellow-100 text-yellow-700' },
  deciding: { label: '决策中', color: 'bg-purple-100 text-purple-700' },
  executing: { label: '执行中', color: 'bg-green-100 text-green-700' },
  reviewing: { label: '复盘中', color: 'bg-orange-100 text-orange-700' },
  closed: { label: '已关闭', color: 'bg-gray-100 text-gray-500' },
}

// ---------------------------------------------------------------------------
// SLA Countdown Component
// ---------------------------------------------------------------------------

function SLACountdown({ dueAt }: { dueAt: string }) {
  const slaInfo = useMemo(() => {
    const due = new Date(dueAt)
    const now = new Date()
    const isOverdue = isPast(due)
    const totalHours = differenceInHours(due, now)
    const totalMinutes = differenceInMinutes(due, now)

    let timeText: string
    let urgency: 'normal' | 'warning' | 'critical'
    let progress: number

    if (isOverdue) {
      const overdueHours = Math.abs(totalHours)
      const overdueMinutes = Math.abs(totalMinutes)
      timeText = overdueHours >= 1
        ? `已超时 ${overdueHours} 小时`
        : `已超时 ${overdueMinutes} 分钟`
      urgency = 'critical'
      progress = 100
    } else if (totalHours <= 0) {
      timeText = `剩余 ${totalMinutes} 分钟`
      urgency = 'critical'
      progress = 95
    } else if (totalHours < 4) {
      timeText = `剩余 ${totalHours} 小时`
      urgency = 'critical'
      progress = 80 + (4 - totalHours) * 5
    } else if (totalHours < 12) {
      timeText = `剩余 ${totalHours} 小时`
      urgency = 'warning'
      progress = 60 + (12 - totalHours) * 2.5
    } else if (totalHours < 24) {
      timeText = `剩余 ${totalHours} 小时`
      urgency = 'normal'
      progress = 40 + (24 - totalHours) * 0.83
    } else {
      const days = Math.floor(totalHours / 24)
      const hours = totalHours % 24
      timeText = `剩余 ${days} 天 ${hours} 小时`
      urgency = 'normal'
      progress = Math.min(40, (totalHours / 72) * 40)
    }

    return { timeText, urgency, progress, isOverdue, due }
  }, [dueAt])

  const urgencyColors = {
    normal: 'text-blue-600 bg-blue-50',
    warning: 'text-amber-600 bg-amber-50',
    critical: 'text-red-600 bg-red-50',
  }

  const progressColors = {
    normal: 'bg-blue-500',
    warning: 'bg-amber-500',
    critical: 'bg-red-500',
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded', urgencyColors[slaInfo.urgency])}>
                  {slaInfo.timeText}
                </span>
              </div>
            </div>
            <div className="relative h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn('h-full transition-all duration-500', progressColors[slaInfo.urgency])}
                style={{ width: `${slaInfo.progress}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              截止: {format(slaInfo.due, 'MM-dd HH:mm', { locale: zhCN })}
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>SLA 截止时间: {format(slaInfo.due, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN })}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// ---------------------------------------------------------------------------
// Decision Status Badge
// ---------------------------------------------------------------------------

function DecisionStatusBadge({ status }: { status?: string }) {
  if (!status || status === '无需决策') {
    return (
      <Badge variant="secondary" className="text-xs">
        <MinusIcon className="h-3 w-3 mr-1" />
        无需决策
      </Badge>
    )
  }

  const config: Record<string, { icon: React.ReactNode; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    '待决策': { icon: <AlertCircle className="h-3 w-3 mr-1" />, variant: 'outline' },
    '已通过': { icon: <CheckCircle className="h-3 w-3 mr-1" />, variant: 'default' },
    '已驳回': { icon: <XCircle className="h-3 w-3 mr-1" />, variant: 'destructive' },
  }

  const conf = config[status] || config['待决策']

  return (
    <Badge variant={conf.variant} className="text-xs">
      {conf.icon}
      {status}
    </Badge>
  )
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 12h14" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Participant Avatars
// ---------------------------------------------------------------------------

function ParticipantAvatars({ participants, maxDisplay = 5 }: { participants: Case['participants']; maxDisplay?: number }) {
  const displayParticipants = participants.slice(0, maxDisplay)
  const remaining = participants.length - maxDisplay

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {displayParticipants.map((p, idx) => (
          <TooltipProvider key={p.user_id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar
                  className="h-8 w-8 border-2 border-white ring-0 hover:z-10 transition-transform hover:scale-110"
                  style={{ zIndex: displayParticipants.length - idx }}
                >
                  {p.avatar && <AvatarImage src={p.avatar} alt={p.name} />}
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                    {p.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.role}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      {remaining > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="ml-2 flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-xs font-medium text-gray-600 border-2 border-white">
                +{remaining}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>还有 {remaining} 位参会人</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function CaseSummary({
  caseData,
  onAddParticipant,
  onChangeOwner,
  onCloseCase,
  className,
}: CaseSummaryProps) {
  const statusConfig = caseStatusConfig[caseData.status]

  return (
    <div className={cn('bg-white border-b', className)}>
      {/* Severity Banner */}
      <div
        className={cn(
          'h-1 w-full',
          caseData.level === 'critical' && 'bg-red-500',
          caseData.level === 'high' && 'bg-orange-500',
          caseData.level === 'medium' && 'bg-yellow-500',
          caseData.level === 'low' && 'bg-green-500',
          caseData.level === 'info' && 'bg-blue-500'
        )}
      />

      <div className="p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>协同处置</span>
          <ChevronRight className="h-4 w-4" />
          <span>Case 列表</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{caseData.case_id}</span>
        </div>

        {/* Main Content */}
        <div className="flex items-start justify-between gap-6">
          {/* Left: Title and Badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <SeverityBadge severity={caseData.level} size="lg" />
              <Badge className={cn('text-xs', statusConfig.color)}>
                {statusConfig.label}
              </Badge>
              <DecisionStatusBadge status={caseData.decision_status} />
            </div>
            <h1 className="text-xl font-semibold text-foreground mb-2 truncate">
              {caseData.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              关联事件:
              <span className="text-foreground ml-1">{caseData.related_event_title}</span>
            </p>
          </div>

          {/* Right: SLA and Actions */}
          <div className="flex items-center gap-6">
            {/* SLA Countdown */}
            <SLACountdown dueAt={caseData.sla_due_at} />

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onChangeOwner}>
                <UserCog className="h-4 w-4 mr-1.5" />
                负责人
              </Button>
              <Button variant="outline" size="sm" onClick={onAddParticipant}>
                <UserPlus className="h-4 w-4 mr-1.5" />
                参会人
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onCloseCase}>
                    <X className="h-4 w-4 mr-2" />
                    关闭 Case
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>导出报告</DropdownMenuItem>
                  <DropdownMenuItem>查看审计日志</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Bottom: Owner and Participants */}
        <div className="flex items-center gap-8 mt-6 pt-4 border-t">
          {/* Owner */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">负责人</span>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                  {caseData.owner_name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{caseData.owner_name}</span>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">参会人</span>
            <ParticipantAvatars participants={caseData.participants} />
          </div>

          {/* Next Action */}
          {caseData.next_action && (
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm text-muted-foreground">下一步</span>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {caseData.next_action}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
