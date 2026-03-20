import { useState, useMemo } from 'react'
import { Pencil, Save, X, Play, Plus, Trash2, ChevronRight } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { DataTable } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
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

interface SLAPolicy {
  id: string
  objectType: string
  objectTypeLabel: string
  timeoutHours: number
  escalationPath: EscalationStep[]
}

interface EscalationStep {
  level: number
  role: string
  notifyChannels: ('email' | 'sms' | 'app')[]
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockSLAPolicies: SLAPolicy[] = [
  {
    id: 'sla-001',
    objectType: 'critical_event',
    objectTypeLabel: '严重风险事件',
    timeoutHours: 4,
    escalationPath: [
      { level: 1, role: '风控分析师', notifyChannels: ['email', 'app'] },
      { level: 2, role: '风控经理', notifyChannels: ['email', 'sms'] },
      { level: 3, role: '采购总监', notifyChannels: ['email', 'sms'] },
      { level: 4, role: 'VP', notifyChannels: ['sms'] },
    ],
  },
  {
    id: 'sla-002',
    objectType: 'high_event',
    objectTypeLabel: '高危风险事件',
    timeoutHours: 24,
    escalationPath: [
      { level: 1, role: '风控分析师', notifyChannels: ['email'] },
      { level: 2, role: '风控经理', notifyChannels: ['email', 'sms'] },
      { level: 3, role: '采购总监', notifyChannels: ['email'] },
    ],
  },
  {
    id: 'sla-003',
    objectType: 'approval_task',
    objectTypeLabel: '审批任务',
    timeoutHours: 48,
    escalationPath: [
      { level: 1, role: '当前审批人', notifyChannels: ['email', 'app'] },
      { level: 2, role: '上级审批人', notifyChannels: ['email'] },
      { level: 3, role: '部门负责人', notifyChannels: ['email', 'sms'] },
    ],
  },
  {
    id: 'sla-004',
    objectType: 'case_resolution',
    objectTypeLabel: '案件处理',
    timeoutHours: 72,
    escalationPath: [
      { level: 1, role: '案件负责人', notifyChannels: ['email', 'app'] },
      { level: 2, role: '业务经理', notifyChannels: ['email'] },
      { level: 3, role: '风控经理', notifyChannels: ['email', 'sms'] },
    ],
  },
]

// ---------------------------------------------------------------------------
// Escalation path renderer
// ---------------------------------------------------------------------------

function EscalationPathView({
  steps,
  onEdit,
}: {
  steps: EscalationStep[]
  onEdit?: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {steps.map((step, idx) => (
        <span key={step.level} className="flex items-center gap-1">
          <Badge
            variant="secondary"
            className="text-xs font-normal cursor-pointer hover:bg-gray-200"
            onClick={onEdit}
          >
            L{step.level}: {step.role}
          </Badge>
          {idx < steps.length - 1 && (
            <span className="text-gray-300">
              <ChevronRight className="h-3 w-3" />
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SLAConfig() {
  const [data, setData] = useState(mockSLAPolicies)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number>(0)
  const [escalationDialogOpen, setEscalationDialogOpen] = useState(false)
  const [simulatingPolicy, setSimulatingPolicy] = useState<SLAPolicy | null>(null)
  const [selectedPolicy, setSelectedPolicy] = useState<SLAPolicy | null>(null)
  const [editingSteps, setEditingSteps] = useState<EscalationStep[]>([])

  function startEdit(policy: SLAPolicy) {
    setEditingId(policy.id)
    setEditValue(policy.timeoutHours)
  }

  function saveEdit() {
    if (editingId) {
      setData((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, timeoutHours: editValue }
            : p,
        ),
      )
      setEditingId(null)
      toast.success('SLA 阈值已更新')
    }
  }

  function cancelEdit() {
    setEditingId(null)
  }

  function openEscalationEdit(policy: SLAPolicy) {
    setSelectedPolicy(policy)
    setEditingSteps([...policy.escalationPath])
    setEscalationDialogOpen(true)
  }

  function saveEscalationPath() {
    if (!selectedPolicy) return
    setData((prev) =>
      prev.map((p) =>
        p.id === selectedPolicy.id
          ? { ...p, escalationPath: editingSteps }
          : p,
      ),
    )
    setEscalationDialogOpen(false)
    toast.success(`"${selectedPolicy.objectTypeLabel}" 升级路径已更新`)
  }

  function addEscalationStep() {
    const newLevel = editingSteps.length + 1
    setEditingSteps([...editingSteps, { level: newLevel, role: '', notifyChannels: ['email'] }])
  }

  function removeEscalationStep(index: number) {
    setEditingSteps(editingSteps.filter((_, i) => i !== index).map((step, i) => ({ ...step, level: i + 1 })))
  }

  function updateEscalationStep(index: number, updates: Partial<EscalationStep>) {
    setEditingSteps(editingSteps.map((step, i) => (i === index ? { ...step, ...updates } : step)))
  }

  async function simulateEscalation(policy: SLAPolicy) {
    setSimulatingPolicy(policy)
    toast.info(`正在模拟 "${policy.objectTypeLabel}" 升级流程...`)

    // Simulate each step
    for (const step of policy.escalationPath) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success(`L${step.level} 升级: 已通知 ${step.role}`, {
        description: `渠道: ${step.notifyChannels.join(', ')}`,
      })
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
    toast.success('模拟升级完成', {
      description: `总升级时间: ${policy.timeoutHours}小时`,
    })
    setSimulatingPolicy(null)
  }

  const columns: ColumnDef<SLAPolicy, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'objectTypeLabel',
        header: '对象类型',
        size: 160,
        cell: ({ row }) => (
          <span className="font-medium text-gray-900">
            {row.original.objectTypeLabel}
          </span>
        ),
      },
      {
        accessorKey: 'timeoutHours',
        header: '超时阈值',
        size: 160,
        cell: ({ row }) => {
          const policy = row.original
          if (editingId === policy.id) {
            return (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  value={editValue}
                  onChange={(e) =>
                    setEditValue(Number(e.target.value) || 1)
                  }
                  className="h-7 w-20"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit()
                    if (e.key === 'Escape') cancelEdit()
                  }}
                />
                <span className="text-xs text-gray-500">小时</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-green-600"
                  onClick={saveEdit}
                >
                  <Save className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400"
                  onClick={cancelEdit}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )
          }
          return (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {policy.timeoutHours} 小时
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-blue-600"
                onClick={() => startEdit(policy)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
          )
        },
      },
      {
        accessorKey: 'escalationPath',
        header: '升级路径',
        size: 380,
        cell: ({ row }) => {
          const policy = row.original
          return (
            <EscalationPathView
              steps={policy.escalationPath}
              onEdit={() => openEscalationEdit(policy)}
            />
          )
        },
      },
      {
        id: 'actions',
        header: '操作',
        size: 120,
        cell: ({ row }) => {
          const policy = row.original
          const isSimulating = simulatingPolicy?.id === policy.id
          return (
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              disabled={isSimulating}
              onClick={() => simulateEscalation(policy)}
            >
              <Play className="h-3 w-3" />
              {isSimulating ? '模拟中' : '模拟升级'}
            </Button>
          )
        },
      },
    ],
    [editingId, editValue, simulatingPolicy],
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          SLA 配置
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          配置服务等级协议的超时阈值和升级路径
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        showPagination={false}
        emptyMessage="暂无 SLA 策略"
      />

      {/* Escalation Path Edit Dialog */}
      <Dialog open={escalationDialogOpen} onOpenChange={setEscalationDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>配置升级路径</DialogTitle>
            <DialogDescription>
              {selectedPolicy && `编辑 "${selectedPolicy.objectTypeLabel}" 的升级路径`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editingSteps.map((step, index) => (
              <div key={step.level} className="flex items-start gap-3 rounded-lg border p-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                  {step.level}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="space-y-1">
                    <Label className="text-xs">角色</Label>
                    <Input
                      value={step.role}
                      onChange={(e) => updateEscalationStep(index, { role: e.target.value })}
                      placeholder="输入角色名称"
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">通知渠道</Label>
                    <Select
                      value={step.notifyChannels.join(',')}
                      onValueChange={(v) => updateEscalationStep(index, { notifyChannels: v.split(',') as ('email' | 'sms' | 'app')[] })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">邮件</SelectItem>
                        <SelectItem value="email,sms">邮件+短信</SelectItem>
                        <SelectItem value="email,sms,app">全部渠道</SelectItem>
                        <SelectItem value="sms">仅短信</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-400 hover:text-red-600"
                  onClick={() => removeEscalationStep(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1"
              onClick={addEscalationStep}
            >
              <Plus className="h-4 w-4" />
              添加升级层级
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEscalationDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={saveEscalationPath}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
