import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  X,
  AlertCircle,
  Send,
  RotateCcw,
  Loader2,
  FileText,
  Clock,
  User,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApprovalAction {
  id: string
  label: string
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
  requireConfirmation?: boolean
  confirmationTitle?: string
  confirmationDescription?: string
  requireReason?: boolean
  icon?: React.ElementType
}

export interface ApprovalBarProps {
  /** Primary actions (displayed prominently) */
  primaryActions?: ApprovalAction[]
  /** Secondary actions (displayed in dropdown or less prominent) */
  secondaryActions?: ApprovalAction[]
  /** Whether to show at the bottom of the page (fixed) or inline */
  position?: 'bottom-fixed' | 'inline'
  /** Current approver info */
  approver?: {
    name: string
    avatar?: string
    role?: string
  }
  /** Approval status */
  status?: 'pending' | 'approved' | 'rejected' | 'in-review'
  /** Callback when action is triggered */
  onAction?: (actionId: string, data?: { reason?: string; comment?: string }) => void
  /** Custom content to display in the bar */
  children?: React.ReactNode
  /** Additional className */
  className?: string
}

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  action: ApprovalAction | null
  onConfirm: (data: { reason?: string; comment?: string }) => void
}

// ---------------------------------------------------------------------------
// Confirmation Dialog
// ---------------------------------------------------------------------------

function ConfirmationDialog({
  open,
  onOpenChange,
  action,
  onConfirm,
}: ConfirmationDialogProps) {
  const [reason, setReason] = useState('')
  const [comment, setComment] = useState('')

  const handleConfirm = () => {
    onConfirm({ reason, comment })
    setReason('')
    setComment('')
    onOpenChange(false)
  }

  if (!action) return null

  const Icon = action.icon ?? AlertCircle

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-amber-500" />
            {action.confirmationTitle ?? `确认${action.label}`}
          </DialogTitle>
          <DialogDescription>
            {action.confirmationDescription ??
              `确定要执行「${action.label}」操作吗？`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Reason input (if required) */}
          {action.requireReason && (
            <div className="space-y-2">
              <Label htmlFor="reason">
                操作原因 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="请输入操作原因..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          )}

          {/* Comment input */}
          <div className="space-y-2">
            <Label htmlFor="comment">备注说明（可选）</Label>
            <Textarea
              id="comment"
              placeholder="添加备注信息..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[60px]"
            />
          </div>

          {/* Warning message */}
          {(action.variant === 'destructive' ||
            action.id.includes('reject') ||
            action.id.includes('rollback')) && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                此操作不可撤销，请谨慎操作。相关方将收到通知。
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            variant={action.variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={action.requireReason && !reason.trim()}
          >
            确认{action.label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Status Badge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: ApprovalBarProps['status'] }) {
  if (!status) return null

  const configs = {
    pending: {
      label: '待审批',
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      icon: Clock,
    },
    'in-review': {
      label: '审批中',
      className: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Loader2,
    },
    approved: {
      label: '已通过',
      className: 'bg-green-50 text-green-700 border-green-200',
      icon: Check,
    },
    rejected: {
      label: '已驳回',
      className: 'bg-red-50 text-red-700 border-red-200',
      icon: X,
    },
  }

  const config = configs[status]
  const Icon = config.icon

  return (
    <Badge variant="outline" className={`gap-1 ${config.className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function ApprovalBar({
  primaryActions = [],
  secondaryActions = [],
  position = 'bottom-fixed',
  approver,
  status,
  onAction,
  children,
  className = '',
}: ApprovalBarProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<ApprovalAction | null>(null)

  const handleAction = useCallback(
    (action: ApprovalAction) => {
      if (action.requireConfirmation) {
        setSelectedAction(action)
        setConfirmDialogOpen(true)
      } else {
        onAction?.(action.id)
        toast.success(`已执行: ${action.label}`)
      }
    },
    [onAction]
  )

  const handleConfirm = useCallback(
    (data: { reason?: string; comment?: string }) => {
      if (selectedAction) {
        onAction?.(selectedAction.id, data)
        toast.success(`已执行: ${selectedAction.label}`)
      }
    },
    [selectedAction, onAction]
  )

  const allActions = [...primaryActions, ...secondaryActions]

  if (allActions.length === 0 && !children) {
    return null
  }

  const barContent = (
    <div className="flex items-center gap-4">
      {/* Left: Status and Approver info */}
      <div className="flex items-center gap-3">
        {status && <StatusBadge status={status} />}
        {approver && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="hidden sm:block">
              <div className="font-medium">{approver.name}</div>
              {approver.role && (
                <div className="text-xs text-muted-foreground">{approver.role}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Separator */}
      <Separator orientation="vertical" className="h-8" />

      {/* Middle: Custom content */}
      {children && <div className="flex-1">{children}</div>}

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Secondary actions */}
        {secondaryActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant === 'default' ? 'outline' : action.variant}
            size="sm"
            onClick={() => handleAction(action)}
            className="gap-1"
          >
            {action.icon && <action.icon className="h-4 w-4" />}
            <span className="hidden sm:inline">{action.label}</span>
          </Button>
        ))}

        {/* Primary actions */}
        {primaryActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            size="sm"
            onClick={() => handleAction(action)}
            className="gap-1"
          >
            {action.icon && <action.icon className="h-4 w-4" />}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )

  if (position === 'bottom-fixed') {
    return (
      <>
        <AnimatePresence>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-4 shadow-lg backdrop-blur-sm ${className}`}
            style={{ paddingLeft: '280px' }} // Account for sidebar width
          >
            <div className="mx-auto max-w-7xl">{barContent}</div>
          </motion.div>
        </AnimatePresence>

        {/* Spacer for fixed bar */}
        <div className="h-20" />

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          action={selectedAction}
          onConfirm={handleConfirm}
        />
      </>
    )
  }

  // Inline position
  return (
    <>
      <Card className={`${className}`}>
        <CardContent className="p-4">{barContent}</CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        action={selectedAction}
        onConfirm={handleConfirm}
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// Preset Actions
// ---------------------------------------------------------------------------

export const presetActions = {
  /** Approve action */
  approve: (label = '通过'): ApprovalAction => ({
    id: 'approve',
    label,
    variant: 'default',
    requireConfirmation: true,
    confirmationTitle: '确认审批通过',
    confirmationDescription: '确定要审批通过此申请吗？',
    requireReason: false,
    icon: Check,
  }),

  /** Reject action */
  reject: (label = '驳回'): ApprovalAction => ({
    id: 'reject',
    label,
    variant: 'destructive',
    requireConfirmation: true,
    confirmationTitle: '确认驳回',
    confirmationDescription: '确定要驳回此申请吗？驳回后申请人将收到通知。',
    requireReason: true,
    icon: X,
  }),

  /** Request more info action */
  requestInfo: (label = '要求补充'): ApprovalAction => ({
    id: 'request-info',
    label,
    variant: 'outline',
    requireConfirmation: true,
    confirmationTitle: '要求补充材料',
    confirmationDescription: '将向申请人发送补充材料通知。',
    requireReason: true,
    icon: FileText,
  }),

  /** Forward action */
  forward: (label = '转交'): ApprovalAction => ({
    id: 'forward',
    label,
    variant: 'outline',
    requireConfirmation: true,
    confirmationTitle: '转交审批',
    confirmationDescription: '请选择转交的目标审批人。',
    requireReason: false,
    icon: Send,
  }),

  /** Rollback action */
  rollback: (label = '撤销'): ApprovalAction => ({
    id: 'rollback',
    label,
    variant: 'destructive',
    requireConfirmation: true,
    confirmationTitle: '确认撤销',
    confirmationDescription: '撤销操作不可恢复，相关方将收到通知。',
    requireReason: true,
    icon: RotateCcw,
  }),

  /** Save draft action */
  saveDraft: (label = '保存草稿'): ApprovalAction => ({
    id: 'save-draft',
    label,
    variant: 'outline',
    requireConfirmation: false,
    icon: Check,
  }),

  /** Submit action */
  submit: (label = '提交'): ApprovalAction => ({
    id: 'submit',
    label,
    variant: 'default',
    requireConfirmation: true,
    confirmationTitle: '确认提交',
    confirmationDescription: '提交后将进入审批流程，不可修改。',
    requireReason: false,
    icon: Send,
  }),
}

export default ApprovalBar
