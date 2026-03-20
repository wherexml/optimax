import { useState, useMemo, useCallback } from 'react'
import { Download, ChevronDown, ChevronRight } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { DataTable } from '@/components/DataTable'
import { FilterBar, type FilterFieldConfig, type FilterValues } from '@/components/filter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AuditActionType =
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'export'
  | 'approve'
  | 'reject'
  | 'assign'
  | 'escalate'

interface AuditEntry {
  id: string
  operator: string
  time: string
  actionType: AuditActionType
  targetObject: string
  prevValue: string
  newValue: string
  ip: string
}

// ---------------------------------------------------------------------------
// Mock data (30+ entries)
// ---------------------------------------------------------------------------

const mockAuditLogs: AuditEntry[] = [
  { id: 'a-001', operator: '张伟', time: '2026-03-20 14:32:15', actionType: 'update', targetObject: '规则:需求量异常波动预警', prevValue: '阈值: 25%', newValue: '阈值: 30%', ip: '10.0.1.101' },
  { id: 'a-002', operator: '李明', time: '2026-03-20 14:28:30', actionType: 'create', targetObject: '订阅:质量不合格率超5%', prevValue: '-', newValue: '接收人: 陈静, 渠道: 邮件', ip: '10.0.1.102' },
  { id: 'a-003', operator: '赵强', time: '2026-03-20 14:15:00', actionType: 'approve', targetObject: '审批:采购订单 PO-20260320-001', prevValue: '待审批', newValue: '已通过', ip: '10.0.1.103' },
  { id: 'a-004', operator: '王芳', time: '2026-03-20 13:50:22', actionType: 'assign', targetObject: '案件:CS-2026-0089', prevValue: '负责人: 未分配', newValue: '负责人: 刘洋', ip: '10.0.1.104' },
  { id: 'a-005', operator: '陈静', time: '2026-03-20 13:30:10', actionType: 'update', targetObject: '供应商:深圳精密电子', prevValue: '质量评分: 85', newValue: '质量评分: 78', ip: '10.0.1.105' },
  { id: 'a-006', operator: '刘洋', time: '2026-03-20 13:15:45', actionType: 'escalate', targetObject: '事件:EVT-2026-0456', prevValue: '级别: 高危', newValue: '级别: 严重', ip: '10.0.1.106' },
  { id: 'a-007', operator: '张伟', time: '2026-03-20 12:00:00', actionType: 'export', targetObject: '报告:月度风险综述', prevValue: '-', newValue: '格式: PDF', ip: '10.0.1.101' },
  { id: 'a-008', operator: '李明', time: '2026-03-20 11:45:30', actionType: 'login', targetObject: '用户:李明', prevValue: '-', newValue: '登录成功', ip: '10.0.1.102' },
  { id: 'a-009', operator: '周敏', time: '2026-03-20 11:30:00', actionType: 'create', targetObject: '规则:供应商质量评分下降', prevValue: '-', newValue: '类别: 质量风险, 状态: 草稿', ip: '10.0.1.107' },
  { id: 'a-010', operator: '赵强', time: '2026-03-20 11:00:15', actionType: 'reject', targetObject: '审批:紧急采购申请 ER-008', prevValue: '待审批', newValue: '已驳回 (理由: 超出预算)', ip: '10.0.1.103' },
  { id: 'a-011', operator: '张伟', time: '2026-03-20 10:45:00', actionType: 'update', targetObject: 'SLA:严重风险事件', prevValue: '超时: 6小时', newValue: '超时: 4小时', ip: '10.0.1.101' },
  { id: 'a-012', operator: '孙磊', time: '2026-03-20 10:30:22', actionType: 'update', targetObject: '数据源:海关进出口数据', prevValue: '状态: 断流', newValue: '状态: 正常', ip: '10.0.1.108' },
  { id: 'a-013', operator: '王芳', time: '2026-03-20 10:15:00', actionType: 'create', targetObject: '案件:CS-2026-0090', prevValue: '-', newValue: '类型: 供应中断, 严重级别: 高', ip: '10.0.1.104' },
  { id: 'a-014', operator: '陈静', time: '2026-03-20 09:50:30', actionType: 'approve', targetObject: '审批:新供应商准入 SUP-NEW-012', prevValue: '待审批', newValue: '已通过', ip: '10.0.1.105' },
  { id: 'a-015', operator: '刘洋', time: '2026-03-20 09:30:00', actionType: 'update', targetObject: '任务:TK-2026-0234', prevValue: '状态: 处理中', newValue: '状态: 已完成', ip: '10.0.1.106' },
  { id: 'a-016', operator: '张伟', time: '2026-03-19 17:30:00', actionType: 'delete', targetObject: '规则:紧急采购免审通道 (旧版)', prevValue: '状态: 停用', newValue: '-', ip: '10.0.1.101' },
  { id: 'a-017', operator: '李明', time: '2026-03-19 16:45:15', actionType: 'update', targetObject: '规则:采购价格异常波动', prevValue: '偏差阈值: 15%', newValue: '偏差阈值: 10%', ip: '10.0.1.102' },
  { id: 'a-018', operator: '赵强', time: '2026-03-19 16:00:00', actionType: 'assign', targetObject: '事件:EVT-2026-0450', prevValue: '负责人: 李明', newValue: '负责人: 赵强', ip: '10.0.1.103' },
  { id: 'a-019', operator: '王芳', time: '2026-03-19 15:30:30', actionType: 'export', targetObject: '报告:供应商质量月报', prevValue: '-', newValue: '格式: Excel', ip: '10.0.1.104' },
  { id: 'a-020', operator: '周敏', time: '2026-03-19 15:00:00', actionType: 'update', targetObject: '供应商:广州金属制品', prevValue: '等级: Tier 2', newValue: '等级: Tier 1', ip: '10.0.1.107' },
  { id: 'a-021', operator: '孙磊', time: '2026-03-19 14:30:00', actionType: 'create', targetObject: '数据源:气象灾害预警接口', prevValue: '-', newValue: '类型: 外部, 频率: 每3小时', ip: '10.0.1.108' },
  { id: 'a-022', operator: '张伟', time: '2026-03-19 14:00:15', actionType: 'logout', targetObject: '用户:张伟', prevValue: '-', newValue: '正常退出', ip: '10.0.1.101' },
  { id: 'a-023', operator: '李明', time: '2026-03-19 13:30:00', actionType: 'login', targetObject: '用户:李明', prevValue: '-', newValue: '登录成功', ip: '10.0.2.55' },
  { id: 'a-024', operator: '赵强', time: '2026-03-19 12:00:00', actionType: 'approve', targetObject: '审批:采购订单 PO-20260319-003', prevValue: '待审批', newValue: '已通过', ip: '10.0.1.103' },
  { id: 'a-025', operator: '王芳', time: '2026-03-19 11:30:45', actionType: 'escalate', targetObject: '案件:CS-2026-0087', prevValue: '处理人: 刘洋', newValue: '升级至: 赵强', ip: '10.0.1.104' },
  { id: 'a-026', operator: '陈静', time: '2026-03-19 11:00:00', actionType: 'reject', targetObject: '审批:新供应商准入 SUP-NEW-011', prevValue: '待审批', newValue: '已驳回 (理由: 资质不足)', ip: '10.0.1.105' },
  { id: 'a-027', operator: '刘洋', time: '2026-03-19 10:30:30', actionType: 'create', targetObject: '任务:TK-2026-0235', prevValue: '-', newValue: '类型: 调查, 分配给: 周敏', ip: '10.0.1.106' },
  { id: 'a-028', operator: '张伟', time: '2026-03-19 10:00:00', actionType: 'update', targetObject: '角色:风控分析师', prevValue: '权限: 查看+分析', newValue: '权限: 查看+分析+规则配置', ip: '10.0.1.101' },
  { id: 'a-029', operator: '李明', time: '2026-03-18 17:00:00', actionType: 'delete', targetObject: '订阅:过期的周报订阅', prevValue: '接收人: 旧员工', newValue: '-', ip: '10.0.1.102' },
  { id: 'a-030', operator: '赵强', time: '2026-03-18 16:30:00', actionType: 'update', targetObject: '供应商:上海芯片科技', prevValue: '状态: 活跃', newValue: '状态: 暂停', ip: '10.0.1.103' },
  { id: 'a-031', operator: '张伟', time: '2026-03-18 15:00:00', actionType: 'login', targetObject: '用户:张伟', prevValue: '-', newValue: '登录成功', ip: '10.0.3.12' },
  { id: 'a-032', operator: '王芳', time: '2026-03-18 14:00:00', actionType: 'export', targetObject: '报告:风险事件明细', prevValue: '-', newValue: '格式: PDF, 范围: 本月', ip: '10.0.1.104' },
]

// ---------------------------------------------------------------------------
// Action badge
// ---------------------------------------------------------------------------

const actionBadge: Record<AuditActionType, { label: string; className: string }> = {
  create: { label: '创建', className: 'bg-green-50 text-green-700 border-green-200' },
  update: { label: '更新', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  delete: { label: '删除', className: 'bg-red-50 text-red-700 border-red-200' },
  login: { label: '登录', className: 'bg-gray-50 text-gray-600 border-gray-200' },
  logout: { label: '退出', className: 'bg-gray-50 text-gray-600 border-gray-200' },
  export: { label: '导出', className: 'bg-purple-50 text-purple-700 border-purple-200' },
  approve: { label: '审批通过', className: 'bg-green-50 text-green-700 border-green-200' },
  reject: { label: '审批驳回', className: 'bg-red-50 text-red-700 border-red-200' },
  assign: { label: '分配', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  escalate: { label: '升级', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
}

// ---------------------------------------------------------------------------
// Filter config
// ---------------------------------------------------------------------------

const filterFields: FilterFieldConfig[] = [
  {
    key: 'operator',
    label: '操作者',
    type: 'select',
    placeholder: '选择操作者',
    options: [
      ...new Set(mockAuditLogs.map((l) => l.operator)),
    ].map((o) => ({ label: o, value: o })),
  },
  {
    key: 'actionType',
    label: '动作类型',
    type: 'multi-select',
    options: Object.entries(actionBadge).map(([value, { label }]) => ({
      label,
      value,
    })),
  },
  {
    key: 'time',
    label: '时间范围',
    type: 'date-range',
    placeholder: '选择时间范围',
  },
]

// ---------------------------------------------------------------------------
// Expandable row for prev/new values
// ---------------------------------------------------------------------------

function ExpandableValues({
  prev,
  next,
}: {
  prev: string
  next: string
}) {
  const [expanded, setExpanded] = useState(false)

  if (prev === '-' && next === '-') {
    return <span className="text-gray-400">-</span>
  }

  return (
    <div>
      <button
        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        {expanded ? '收起' : '查看变更'}
      </button>
      {expanded && (
        <div className="mt-1 space-y-1 rounded bg-gray-50 p-2 text-xs">
          {prev !== '-' && (
            <div>
              <span className="text-gray-400">变更前: </span>
              <span className="text-red-600">{prev}</span>
            </div>
          )}
          {next !== '-' && (
            <div>
              <span className="text-gray-400">变更后: </span>
              <span className="text-green-600">{next}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AuditLog() {
  const [filters, setFilters] = useState<FilterValues>({})

  const filteredData = useMemo(() => {
    let result = mockAuditLogs

    if (filters.operator) {
      result = result.filter(
        (l) => l.operator === (filters.operator as string),
      )
    }
    if (filters.actionType && (filters.actionType as string[]).length > 0) {
      const types = filters.actionType as string[]
      result = result.filter((l) => types.includes(l.actionType))
    }

    return result
  }, [filters])

  const handleExport = useCallback(() => {
    toast.success('审计日志导出任务已创建，请稍后在下载中心查看')
  }, [])

  const columns: ColumnDef<AuditEntry, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'operator',
        header: '操作者',
        size: 90,
        cell: ({ row }) => (
          <span className="font-medium text-gray-900">
            {row.original.operator}
          </span>
        ),
      },
      {
        accessorKey: 'time',
        header: '时间',
        size: 160,
        cell: ({ row }) => (
          <span className="text-sm text-gray-500">
            {row.original.time}
          </span>
        ),
      },
      {
        accessorKey: 'actionType',
        header: '动作类型',
        size: 100,
        cell: ({ row }) => {
          const cfg = actionBadge[row.original.actionType]
          return (
            <Badge variant="outline" className={cfg.className}>
              {cfg.label}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'targetObject',
        header: '目标对象',
        size: 240,
        cell: ({ row }) => (
          <span className="text-sm text-gray-700">
            {row.original.targetObject}
          </span>
        ),
      },
      {
        id: 'changes',
        header: '前后值',
        size: 200,
        cell: ({ row }) => (
          <ExpandableValues
            prev={row.original.prevValue}
            next={row.original.newValue}
          />
        ),
      },
      {
        accessorKey: 'ip',
        header: 'IP',
        size: 120,
        cell: ({ row }) => (
          <code className="text-xs text-gray-500">
            {row.original.ip}
          </code>
        ),
      },
    ],
    [],
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            审计日志
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            查看系统操作审计轨迹
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          导出
        </Button>
      </div>

      {/* Filters */}
      <FilterBar
        fields={filterFields}
        values={filters}
        onChange={setFilters}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        pageSize={20}
        showPagination
        emptyMessage="暂无审计日志"
      />
    </div>
  )
}
