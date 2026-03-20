/**
 * OptiMax AI Assistant - Quick Actions Component
 * FE-122: Quick Actions (Generate Report / Create Case / Create Task / Notify)
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Briefcase,
  CheckSquare,
  Bell,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { QUICK_ACTIONS } from '@/mocks/data/assistant'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface QuickActionsProps {
  className?: string
  contextData?: {
    eventId?: string
    supplierId?: string
    sessionTitle?: string
  }
}

type ActionState = 'idle' | 'loading' | 'success' | 'error'

interface ActionStatus {
  state: ActionState
  message?: string
}

// ---------------------------------------------------------------------------
// Icon Mapping
// ---------------------------------------------------------------------------

const iconMap = {
  FileText,
  Briefcase,
  CheckSquare,
  Bell,
}

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function QuickActions({ className, contextData }: QuickActionsProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [actionStatus, setActionStatus] = useState<Record<string, ActionStatus>>({})
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
  })

  const handleActionClick = (actionId: string) => {
    const action = QUICK_ACTIONS.find((a) => a.id === actionId)
    if (!action) return

    if (action.requires_confirmation) {
      setSelectedAction(actionId)
    } else {
      executeAction(actionId)
    }
  }

  const executeAction = async (actionId: string) => {
    setActionStatus((prev) => ({
      ...prev,
      [actionId]: { state: 'loading' },
    }))

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const action = QUICK_ACTIONS.find((a) => a.id === actionId)
    const actionLabel = action?.label || '操作'

    setActionStatus((prev) => ({
      ...prev,
      [actionId]: { state: 'success', message: `${actionLabel}成功` },
    }))

    toast.success(`${actionLabel}已完成`, {
      description: actionId === 'generate_report'
        ? '简报已生成，可前往报告中心查看'
        : actionId === 'create_case'
          ? 'Case 已创建并通知相关人员'
          : actionId === 'create_task'
            ? '任务已创建并分配'
            : '通知已发送',
    })

    // Reset status after 3 seconds
    setTimeout(() => {
      setActionStatus((prev) => ({
        ...prev,
        [actionId]: { state: 'idle' },
      }))
    }, 3000)

    setSelectedAction(null)
  }

  const handleConfirmAction = () => {
    if (selectedAction) {
      executeAction(selectedAction)
    }
  }

  const selectedActionData = QUICK_ACTIONS.find((a) => a.id === selectedAction)

  return (
    <div className={className}>
      <Card className="border-dashed border-2 border-border/50 bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <span>快捷操作</span>
            <Badge variant="secondary" className="text-[10px]">AI 辅助</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-2 gap-2"
          >
            {QUICK_ACTIONS.map((action) => {
              const Icon = iconMap[action.icon as keyof typeof iconMap]
              const status = actionStatus[action.id]

              return (
                <motion.div key={action.id} variants={itemVariants}>
                  <Button
                    variant="outline"
                    className="w-full h-auto py-3 px-3 justify-start gap-2 text-left hover:bg-background hover:border-[#2F6FED]/30 transition-all group"
                    onClick={() => handleActionClick(action.id)}
                    disabled={status?.state === 'loading'}
                  >
                    {status?.state === 'loading' ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : status?.state === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-[#2F6FED] transition-colors" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {action.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {status?.message || action.description}
                      </div>
                    </div>
                    {status?.state !== 'loading' && status?.state !== 'success' && (
                      <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </Button>
                </motion.div>
              )
            })}
          </motion.div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedAction} onOpenChange={() => setSelectedAction(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedActionData &&
                (() => {
                  const Icon = iconMap[selectedActionData.icon as keyof typeof iconMap]
                  return <Icon className="h-5 w-5 text-[#2F6FED]" />
                })()}
              确认{selectedActionData?.label}
            </DialogTitle>
            <DialogDescription>
              {selectedActionData?.description}
              {contextData?.sessionTitle && (
                <span className="block mt-1 text-xs">
                  基于会话："{contextData.sessionTitle}"
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedAction === 'generate_report' && (
              <div className="space-y-2">
                <Label htmlFor="report-title">简报标题</Label>
                <Input
                  id="report-title"
                  placeholder="输入简报标题"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            )}

            {selectedAction === 'create_case' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="case-title">Case 标题</Label>
                  <Input
                    id="case-title"
                    placeholder="输入 Case 标题"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="case-desc">描述</Label>
                  <Textarea
                    id="case-desc"
                    placeholder="输入 Case 描述"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </>
            )}

            {selectedAction === 'create_task' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="task-title">任务标题</Label>
                  <Input
                    id="task-title"
                    placeholder="输入任务标题"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-assignee">负责人</Label>
                  <Input
                    id="task-assignee"
                    placeholder="输入负责人姓名"
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  />
                </div>
              </>
            )}

            {selectedAction === 'notify_owner' && (
              <div className="space-y-2">
                <Label htmlFor="notify-message">通知内容</Label>
                <Textarea
                  id="notify-message"
                  placeholder="输入通知内容"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            )}

            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-800">
                此操作将发送通知给相关人员，请确认信息准确。
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAction(null)}>
              取消
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={actionStatus[selectedAction || '']?.state === 'loading'}
            >
              {actionStatus[selectedAction || '']?.state === 'loading' && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              确认执行
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default QuickActions
