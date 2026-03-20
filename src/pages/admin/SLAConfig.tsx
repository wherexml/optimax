import { useState, useMemo } from 'react'
import { Pencil, Save, X } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { DataTable } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SLAPolicy {
  id: string
  objectType: string
  objectTypeLabel: string
  timeoutHours: number
  escalationPath: string
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
    escalationPath: '风控分析师 -> 风控经理 -> 采购总监 -> VP',
  },
  {
    id: 'sla-002',
    objectType: 'high_event',
    objectTypeLabel: '高危风险事件',
    timeoutHours: 24,
    escalationPath: '风控分析师 -> 风控经理 -> 采购总监',
  },
  {
    id: 'sla-003',
    objectType: 'approval_task',
    objectTypeLabel: '审批任务',
    timeoutHours: 48,
    escalationPath: '当前审批人 -> 上级审批人 -> 部门负责人',
  },
  {
    id: 'sla-004',
    objectType: 'case_resolution',
    objectTypeLabel: '案件处理',
    timeoutHours: 72,
    escalationPath: '案件负责人 -> 业务经理 -> 风控经理',
  },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SLAConfig() {
  const [data, setData] = useState(mockSLAPolicies)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number>(0)

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
          const steps = row.original.escalationPath.split(' -> ')
          return (
            <div className="flex flex-wrap items-center gap-1">
              {steps.map((step, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  <Badge
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {step}
                  </Badge>
                  {idx < steps.length - 1 && (
                    <span className="text-gray-300">&rarr;</span>
                  )}
                </span>
              ))}
            </div>
          )
        },
      },
    ],
    [editingId, editValue],
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
    </div>
  )
}
