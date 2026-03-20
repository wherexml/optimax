/**
 * War Room - Task Board Component
 *
 * Kanban-style task board with 5 columns:
 * Pending, In Progress, Pending Approval, Completed, Overdue
 */

import { useMemo, useState } from 'react'
import {
  Plus,
  Filter,
  Search,
  LayoutGrid,
  List,
  Clock,
  CheckCircle2,
  Circle,
  Hourglass,
  AlertTriangle,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import type { CaseTask } from '@/types/case'
import type { TaskStatus } from '@/types/enums'
import { TaskCard } from './TaskCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TaskBoardProps {
  tasks: CaseTask[]
  caseId: string
  onTaskUpdate?: (task: CaseTask) => void
  onTaskCreate?: () => void
  className?: string
}

interface ColumnConfig {
  id: TaskStatus
  title: string
  icon: React.ElementType
  color: string
  bgColor: string
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const columns: ColumnConfig[] = [
  {
    id: 'pending',
    title: '待领取',
    icon: Circle,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
  },
  {
    id: 'in_progress',
    title: '进行中',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'pending_approval',
    title: '待审批',
    icon: Hourglass,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'completed',
    title: '已完成',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'overdue',
    title: '已超时',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
]

// ---------------------------------------------------------------------------
// Column Header
// ---------------------------------------------------------------------------

function ColumnHeader({
  config,
  count,
  onAddTask,
}: {
  config: ColumnConfig
  count: number
  onAddTask?: () => void
}) {
  const Icon = config.icon

  return (
    <div className="flex items-center justify-between p-3 border-b bg-white">
      <div className="flex items-center gap-2">
        <div className={cn('flex items-center justify-center h-6 w-6 rounded', config.bgColor)}>
          <Icon className={cn('h-3.5 w-3.5', config.color)} />
        </div>
        <span className="font-medium text-sm">{config.title}</span>
        <Badge variant="secondary" className="text-xs h-5 px-1.5">
          {count}
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onAddTask}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Task Column
// ---------------------------------------------------------------------------

function TaskColumn({
  config,
  tasks,
  onTaskClick,
  onStatusChange,
  onAssign,
}: {
  config: ColumnConfig
  tasks: CaseTask[]
  onTaskClick: (task: CaseTask) => void
  onStatusChange: (taskId: string, newStatus: string) => void
  onAssign: (taskId: string) => void
}) {
  return (
    <div className="flex flex-col h-full min-w-[280px] w-[280px] bg-gray-50/50 rounded-lg border group">
      <ColumnHeader config={config} count={tasks.length} />
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2 min-h-[100px]">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <div className={cn('h-10 w-10 rounded-full flex items-center justify-center mb-2', config.bgColor)}>
                <config.icon className={cn('h-5 w-5', config.color)} />
              </div>
              <span className="text-xs">暂无任务</span>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.task_id}
                task={task}
                onClick={onTaskClick}
                onStatusChange={onStatusChange}
                onAssign={onAssign}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Task Detail Dialog
// ---------------------------------------------------------------------------

function TaskDetailDialog({
  task,
  open,
  onOpenChange,
  onStatusChange,
}: {
  task: CaseTask | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (taskId: string, newStatus: string) => void
}) {
  if (!task) return null

  const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'pending', label: '待领取' },
    { value: 'in_progress', label: '进行中' },
    { value: 'pending_approval', label: '待审批' },
    { value: 'completed', label: '已完成' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-lg">{task.title}</DialogTitle>
          <DialogDescription>
            任务 ID: {task.task_id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Status and Priority */}
          <div className="flex items-center gap-3">
            <Badge variant={task.status === 'completed' ? 'default' : 'outline'}>
              {task.status === 'pending' && '待领取'}
              {task.status === 'in_progress' && '进行中'}
              {task.status === 'pending_approval' && '待审批'}
              {task.status === 'completed' && '已完成'}
              {task.status === 'overdue' && '已超时'}
            </Badge>
            <Badge variant="secondary">
              优先级: {task.priority === 'critical' ? 'P0' : task.priority === 'high' ? 'P1' : task.priority === 'medium' ? 'P2' : 'P3'}
            </Badge>
            {task.approval_required && (
              <Badge variant="outline" className="border-amber-300 text-amber-700">
                需审批
              </Badge>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <h4 className="text-sm font-medium mb-1">任务描述</h4>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">负责人:</span>
              <span className="ml-2 font-medium">{task.owner_name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">任务类型:</span>
              <span className="ml-2 font-medium">
                {task.type === 'investigation' && '调查'}
                {task.type === 'mitigation' && '缓解'}
                {task.type === 'notification' && '通知'}
                {task.type === 'approval' && '审批'}
                {task.type === 'execution' && '执行'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">截止时间:</span>
              <span className="ml-2 font-medium">{new Date(task.due_at).toLocaleString('zh-CN')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">创建时间:</span>
              <span className="ml-2 font-medium">{new Date(task.created_at).toLocaleString('zh-CN')}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {task.status !== 'completed' && (
            <>
              {statusOptions
                .filter((opt) => opt.value !== task.status)
                .map((opt) => (
                  <Button
                    key={opt.value}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onStatusChange(task.task_id, opt.value)
                      onOpenChange(false)
                    }}
                  >
                    标记为{opt.label}
                  </Button>
                ))}
              <Button
                size="sm"
                onClick={() => {
                  onStatusChange(task.task_id, 'completed')
                  onOpenChange(false)
                }}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                完成任务
              </Button>
            </>
          )}
          {task.status === 'completed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onStatusChange(task.task_id, 'pending')
                onOpenChange(false)
              }}
            >
              重新打开
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function TaskBoard({
  tasks,
  caseId: _caseId,
  onTaskUpdate,
  onTaskCreate,
  className,
}: TaskBoardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTask, setSelectedTask] = useState<CaseTask | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')

  // Filter and group tasks
  const groupedTasks = useMemo(() => {
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.owner_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return {
      pending: filtered.filter((t) => t.status === 'pending'),
      in_progress: filtered.filter((t) => t.status === 'in_progress'),
      pending_approval: filtered.filter((t) => t.status === 'pending_approval'),
      completed: filtered.filter((t) => t.status === 'completed'),
      overdue: filtered.filter((t) => t.status === 'overdue'),
    }
  }, [tasks, searchQuery])

  // Calculate stats
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === 'completed').length
    const overdue = tasks.filter((t) => t.status === 'overdue').length
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, completed, overdue, inProgress, completionRate }
  }, [tasks])

  // Handle task actions
  const handleTaskClick = (task: CaseTask) => {
    setSelectedTask(task)
    setDetailOpen(true)
  }

  const handleStatusChange = (taskId: string, newStatus: string) => {
    const task = tasks.find((t) => t.task_id === taskId)
    if (task) {
      const updatedTask = { ...task, status: newStatus as TaskStatus }
      onTaskUpdate?.(updatedTask)
      toast.success(`任务状态已更新为: ${newStatus === 'pending' ? '待领取' : newStatus === 'in_progress' ? '进行中' : newStatus === 'pending_approval' ? '待审批' : '已完成'}`)
    }
  }

  const handleAssign = (_taskId: string) => {
    toast.info('转派功能开发中...')
  }

  return (
    <div className={cn('flex flex-col h-full bg-white rounded-lg border', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">任务看板</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>总任务: {stats.total}</span>
            <span className="text-slate-300">|</span>
            <span className="text-green-600">已完成: {stats.completed}</span>
            <span className="text-slate-300">|</span>
            <span className="text-blue-600">进行中: {stats.inProgress}</span>
            {stats.overdue > 0 && (
              <>
                <span className="text-slate-300">|</span>
                <span className="text-red-600">超时: {stats.overdue}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索任务..."
              className="w-48 pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter */}
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-1.5" />
            筛选
          </Button>

          {/* View Toggle */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'board' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-9 rounded-none rounded-l-md"
              onClick={() => setViewMode('board')}
            >
              <LayoutGrid className="h-4 w-4 mr-1.5" />
              看板
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-9 rounded-none rounded-r-md"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-1.5" />
              列表
            </Button>
          </div>

          {/* Add Task */}
          <Button size="sm" className="h-9" onClick={onTaskCreate}>
            <Plus className="h-4 w-4 mr-1.5" />
            新建任务
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-3 border-b bg-gray-50/50">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">整体进度</span>
          <span className="font-medium">{stats.completionRate}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex gap-4 p-4 min-w-max">
            {columns.map((column) => (
              <TaskColumn
                key={column.id}
                config={column}
                tasks={groupedTasks[column.id]}
                onTaskClick={handleTaskClick}
                onStatusChange={handleStatusChange}
                onAssign={handleAssign}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        task={selectedTask}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
