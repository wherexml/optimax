/**
 * ExecutionChecklist Component
 *
 * FE-114: 执行清单
 * - 拆解为执行动作/审批动作/外部同步
 * - 责任人/截止时间/状态
 * - 发起审批按钮
 * - 推送任务按钮
 */

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Play,
  Send,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react'
import { format, isPast, isToday, isTomorrow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import type {
  ExecutionTask,
  ExecutionTaskType,
  ExecutionTaskStatus,
  ExecutionChecklist,
  ExternalSystem,
} from '@/types/optimization'
import { mockExecutionChecklists, mockUsersForAssignment } from '@/mocks/data/optimization'

interface ExecutionChecklistProps {
  checklist?: ExecutionChecklist
  onTaskUpdate?: (taskId: string, status: ExecutionTaskStatus) => void
  onInitiateApproval?: () => void
  onPushTasks?: () => void
  className?: string
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

// Type config
const typeConfig: Record<
  ExecutionTaskType,
  { label: string; icon: typeof Play; color: string; bgColor: string }
> = {
  action: {
    label: '执行动作',
    icon: Play,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  approval: {
    label: '审批动作',
    icon: CheckCircle2,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  sync: {
    label: '外部同步',
    icon: ExternalLink,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
}

// Status config
const statusConfig: Record<
  ExecutionTaskStatus,
  { label: string; icon: typeof Clock; color: string; bgColor: string; borderColor: string }
> = {
  pending: {
    label: '待处理',
    icon: Clock,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
  in_progress: {
    label: '进行中',
    icon: Play,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  completed: {
    label: '已完成',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  rejected: {
    label: '已驳回',
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
}

// External system labels
const systemLabels: Record<ExternalSystem, string> = {
  erp: 'ERP系统',
  scm: '供应链系统',
  wms: '仓储系统',
  tms: '运输系统',
  crm: '客户系统',
}

// Format due date
function formatDueDate(dateStr: string): { text: string; color: string } {
  const date = new Date(dateStr)
  if (isToday(date)) return { text: '今天截止', color: 'text-orange-600' }
  if (isTomorrow(date)) return { text: '明天截止', color: 'text-amber-600' }
  if (isPast(date)) return { text: `已逾期 ${format(date, 'MM月dd日')}`, color: 'text-red-600' }
  return { text: format(date, 'MM月dd日', { locale: zhCN }), color: 'text-gray-600' }
}

// Task Card Component
interface TaskCardProps {
  task: ExecutionTask
  onStatusChange?: (taskId: string, status: ExecutionTaskStatus) => void
  onReassign?: (taskId: string, userId: string) => void
}

function TaskCard({ task, onStatusChange, onReassign }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false)
  const type = typeConfig[task.type]
  const status = statusConfig[task.status]
  const TypeIcon = type.icon
  const StatusIcon = status.icon
  const dueDate = formatDueDate(task.dueDate)

  const canComplete = task.status === 'pending' || task.status === 'in_progress'
  const canStart = task.status === 'pending'

  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        'rounded-lg border transition-all duration-200',
        status.borderColor,
        status.bgColor
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Type Icon */}
          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', type.bgColor)}>
            <TypeIcon className={cn('w-5 h-5', type.color)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', status.color, status.borderColor)}
                  >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {canComplete && (
                  <Button
                    size="sm"
                    onClick={() => onStatusChange?.(task.id, 'completed')}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    完成
                  </Button>
                )}
                {canStart && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusChange?.(task.id, 'in_progress')}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    开始
                  </Button>
                )}
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-4 mt-3">
              {/* Assignee */}
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={task.assignee.avatar} />
                  <AvatarFallback className="text-xs bg-gray-200">
                    {task.assignee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">{task.assignee.name}</span>
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className={cn('text-sm', dueDate.color)}>{dueDate.text}</span>
              </div>

              {/* External System */}
              {task.externalSystem && (
                <Badge variant="secondary" className="text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {systemLabels[task.externalSystem]}
                </Badge>
              )}

              {/* Dependencies */}
              {task.dependencies && task.dependencies.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  依赖 {task.dependencies.length} 项
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="pt-3 space-y-3">
            {/* Full Description */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-1">详细说明</h4>
              <p className="text-sm text-gray-700">{task.description}</p>
            </div>

            {/* Completion Info */}
            {task.completedAt && (
              <div className="bg-green-50 rounded-lg p-2">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    已于 {format(new Date(task.completedAt), 'MM月dd日 HH:mm')} 完成
                    {task.completedBy && ` · 执行人: ${task.completedBy}`}
                  </span>
                </div>
              </div>
            )}

            {/* Rejection Info */}
            {task.rejectionReason && (
              <div className="bg-red-50 rounded-lg p-2">
                <div className="flex items-center gap-2 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span>驳回原因: {task.rejectionReason}</span>
                </div>
              </div>
            )}

            {/* Reassign */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">重新分配</h4>
              <div className="flex flex-wrap gap-2">
                {mockUsersForAssignment
                  .filter(u => u.id !== task.assignee.id)
                  .map(user => (
                    <button
                      key={user.id}
                      onClick={() => onReassign?.(task.id, user.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-[10px]">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">{user.name}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Task Group Component
function TaskGroup({
  type,
  tasks,
  onStatusChange,
  onReassign,
}: {
  type: ExecutionTaskType
  tasks: ExecutionTask[]
  onStatusChange?: (taskId: string, status: ExecutionTaskStatus) => void
  onReassign?: (taskId: string, userId: string) => void
}) {
  const config = typeConfig[type]
  const completedCount = tasks.filter(t => t.status === 'completed').length
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn('p-1.5 rounded', config.bgColor)}>
            <config.icon className={cn('w-4 h-4', config.color)} />
          </div>
          <h3 className="font-semibold text-gray-900">{config.label}</h3>
          <Badge variant="secondary" className="text-xs">
            {completedCount}/{tasks.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          <Progress value={progress} className="w-20 h-2" />
        </div>
      </div>
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onReassign={onReassign}
          />
        ))}
      </div>
    </div>
  )
}

export function ExecutionChecklist({
  checklist = mockExecutionChecklists[0],
  onTaskUpdate,
  onInitiateApproval,
  onPushTasks,
  className,
}: ExecutionChecklistProps) {
  const [tasks, setTasks] = useState<ExecutionTask[]>(checklist.tasks)
  const [filterStatus, setFilterStatus] = useState<ExecutionTaskStatus | 'all'>('all')

  // Group tasks by type
  const groupedTasks = useMemo(() => {
    const groups: Record<ExecutionTaskType, ExecutionTask[]> = {
      action: [],
      approval: [],
      sync: [],
    }

    const filtered = filterStatus === 'all'
      ? tasks
      : tasks.filter(t => t.status === filterStatus)

    filtered.forEach(task => {
      groups[task.type].push(task)
    })

    return groups
  }, [tasks, filterStatus])

  // Calculate progress
  const progress = useMemo(() => {
    const completed = tasks.filter(t => t.status === 'completed').length
    const total = tasks.length
    return {
      completed,
      total,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    }
  }, [tasks])

  const handleStatusChange = (taskId: string, status: ExecutionTaskStatus) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status, completedAt: status === 'completed' ? new Date().toISOString() : t.completedAt }
          : t
      )
    )
    onTaskUpdate?.(taskId, status)
  }

  const handleReassign = (taskId: string, userId: string) => {
    const user = mockUsersForAssignment.find(u => u.id === userId)
    if (user) {
      setTasks(prev =>
        prev.map(t =>
          t.id === taskId
            ? { ...t, assignee: { id: user.id, name: user.name, avatar: user.avatar } }
            : t
        )
      )
    }
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={cn('space-y-6', className)}
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">执行清单</h2>
          <p className="text-sm text-gray-500 mt-1">
            方案：<span className="font-medium text-gray-700">{checklist.solutionName}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as ExecutionTaskStatus | 'all')}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="筛选..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部任务</SelectItem>
              <SelectItem value="pending">待处理</SelectItem>
              <SelectItem value="in_progress">进行中</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
              <SelectItem value="rejected">已驳回</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={onInitiateApproval}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            发起审批
          </Button>
          <Button onClick={onPushTasks}>
            <Send className="w-4 h-4 mr-2" />
            推送任务
          </Button>
        </div>
      </motion.div>

      {/* Progress Card */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{progress.completed}</div>
                  <div className="text-xs text-gray-500">已完成</div>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{progress.inProgress}</div>
                  <div className="text-xs text-gray-500">进行中</div>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{progress.pending}</div>
                  <div className="text-xs text-gray-500">待处理</div>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400">{progress.total}</div>
                  <div className="text-xs text-gray-500">总任务</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">总进度</div>
                  <div className="text-xs text-gray-500">预计完成: {format(new Date(checklist.estimatedCompletion), 'MM月dd日')}</div>
                </div>
                <div className="w-32">
                  <Progress value={progress.percentage} className="h-3" />
                  <div className="text-right text-sm text-gray-600 mt-1">
                    {Math.round(progress.percentage)}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Task Groups */}
      <motion.div variants={fadeInUp} className="space-y-6">
        {/* Actions */}
        {groupedTasks.action.length > 0 && (
          <TaskGroup
            type="action"
            tasks={groupedTasks.action}
            onStatusChange={handleStatusChange}
            onReassign={handleReassign}
          />
        )}

        {/* Approvals */}
        {groupedTasks.approval.length > 0 && (
          <TaskGroup
            type="approval"
            tasks={groupedTasks.approval}
            onStatusChange={handleStatusChange}
            onReassign={handleReassign}
          />
        )}

        {/* Sync */}
        {groupedTasks.sync.length > 0 && (
          <TaskGroup
            type="sync"
            tasks={groupedTasks.sync}
            onStatusChange={handleStatusChange}
            onReassign={handleReassign}
          />
        )}
      </motion.div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <motion.div variants={fadeInUp} className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">暂无任务</h3>
          <p className="text-sm text-gray-500 mt-1">该方案尚未拆解为执行清单</p>
        </motion.div>
      )}
    </motion.div>
  )
}
