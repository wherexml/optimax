import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Merge,
  EyeOff,
  UserPlus,
  ArrowUpCircle,
  Tag,
  Download,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BatchActionBarProps {
  /** Number of selected rows */
  selectedCount: number
  /** Callback to clear selection */
  onClear: () => void
  /** Action callbacks */
  onMerge?: (reason: string) => void
  onIgnore?: (reason: string) => void
  onAssign?: (userId: string) => void
  onEscalate?: (reason: string) => void
  onTag?: () => void
  onExport?: () => void
}

type ConfirmAction = 'merge' | 'ignore' | 'escalate' | null

const owners = [
  { id: 'u-001', name: '张三' },
  { id: 'u-002', name: '李四' },
  { id: 'u-003', name: '王五' },
  { id: 'u-004', name: '赵六' },
]

const actionLabels: Record<string, string> = {
  merge: '合并',
  ignore: '忽略',
  escalate: '升级',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BatchActionBar({
  selectedCount,
  onClear,
  onMerge,
  onIgnore,
  onAssign,
  onEscalate,
  onTag,
  onExport,
}: BatchActionBarProps) {
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [reason, setReason] = useState('')
  const [assignOpen, setAssignOpen] = useState(false)
  const [assignee, setAssignee] = useState('')

  const handleConfirm = () => {
    if (!confirmAction) return
    const text = reason.trim()
    switch (confirmAction) {
      case 'merge':
        onMerge?.(text)
        break
      case 'ignore':
        onIgnore?.(text)
        break
      case 'escalate':
        onEscalate?.(text)
        break
    }
    setConfirmAction(null)
    setReason('')
  }

  const handleAssign = () => {
    if (assignee) {
      onAssign?.(assignee)
    }
    setAssignOpen(false)
    setAssignee('')
  }

  return (
    <>
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
          >
            <div className="flex items-center gap-3 rounded-xl border bg-background/95 px-5 py-3 shadow-lg backdrop-blur-sm">
              <span className="text-sm font-medium text-muted-foreground">
                已选择{' '}
                <span className="font-semibold text-foreground">
                  {selectedCount}
                </span>{' '}
                项
              </span>

              <div className="mx-1 h-5 w-px bg-border" />

              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmAction('merge')}
              >
                <Merge className="mr-1 h-4 w-4" />
                合并
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmAction('ignore')}
              >
                <EyeOff className="mr-1 h-4 w-4" />
                忽略
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAssignOpen(true)}
              >
                <UserPlus className="mr-1 h-4 w-4" />
                分派
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmAction('escalate')}
              >
                <ArrowUpCircle className="mr-1 h-4 w-4" />
                升级
              </Button>
              <Button variant="outline" size="sm" onClick={onTag}>
                <Tag className="mr-1 h-4 w-4" />
                标签
              </Button>
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="mr-1 h-4 w-4" />
                导出
              </Button>

              <div className="mx-1 h-5 w-px bg-border" />

              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-muted-foreground"
              >
                <X className="mr-1 h-4 w-4" />
                取消
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Dialog (merge / ignore / escalate) */}
      <Dialog
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmAction(null)
            setReason('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              确认{confirmAction ? actionLabels[confirmAction] : ''}
            </DialogTitle>
            <DialogDescription>
              即将对已选的 {selectedCount} 个事件执行
              {confirmAction ? actionLabels[confirmAction] : ''}操作，请填写原因。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="reason">原因说明</Label>
            <Textarea
              id="reason"
              placeholder="请输入操作原因..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmAction(null)
                setReason('')
              }}
            >
              取消
            </Button>
            <Button onClick={handleConfirm} disabled={!reason.trim()}>
              确认{confirmAction ? actionLabels[confirmAction] : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog
        open={assignOpen}
        onOpenChange={(open) => {
          if (!open) {
            setAssignOpen(false)
            setAssignee('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>分派责任人</DialogTitle>
            <DialogDescription>
              为已选的 {selectedCount} 个事件分派新的责任人。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>选择责任人</Label>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger>
                <SelectValue placeholder="请选择责任人" />
              </SelectTrigger>
              <SelectContent>
                {owners.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAssignOpen(false)
                setAssignee('')
              }}
            >
              取消
            </Button>
            <Button onClick={handleAssign} disabled={!assignee}>
              确认分派
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
