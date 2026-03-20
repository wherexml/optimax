import { useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Users } from 'lucide-react'
import { toast } from 'sonner'

import { DataTable } from '@/components/DataTable'
import { DataTableColumnHeader } from '@/components/DataTable/DataTableColumnHeader'
import { FilterBar, type FilterFieldConfig, type FilterValues } from '@/components/filter/FilterBar'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Severity, CaseStatus } from '@/types/enums'

// ---------------------------------------------------------------------------
// Mock Case data
// ---------------------------------------------------------------------------

interface WarRoomCase {
  case_id: string
  title: string
  level: Severity
  owner_name: string
  participant_count: number
  sla_status: 'normal' | 'warning' | 'overdue'
  decision_status: 'pending' | 'approved' | 'rejected' | 'none'
  status: CaseStatus
  created_at: string
}

const mockCases: WarRoomCase[] = [
  {
    case_id: 'CASE-001',
    title: '华芯半导体芯片交付严重延迟',
    level: 'critical',
    owner_name: '张明',
    participant_count: 8,
    sla_status: 'overdue',
    decision_status: 'pending',
    status: 'deciding',
    created_at: '2026-03-18T08:00:00Z',
  },
  {
    case_id: 'CASE-002',
    title: '中泰钢铁环保停产应急处置',
    level: 'critical',
    owner_name: '李芳',
    participant_count: 12,
    sla_status: 'warning',
    decision_status: 'approved',
    status: 'executing',
    created_at: '2026-03-15T10:00:00Z',
  },
  {
    case_id: 'CASE-003',
    title: '台北地震供应链影响评估',
    level: 'high',
    owner_name: '王建国',
    participant_count: 6,
    sla_status: 'normal',
    decision_status: 'none',
    status: 'analyzing',
    created_at: '2026-03-14T14:00:00Z',
  },
  {
    case_id: 'CASE-004',
    title: '洛杉矶港拥堵替代方案',
    level: 'high',
    owner_name: '陈晓红',
    participant_count: 5,
    sla_status: 'normal',
    decision_status: 'approved',
    status: 'executing',
    created_at: '2026-03-12T09:00:00Z',
  },
  {
    case_id: 'CASE-005',
    title: '班加罗尔数据泄露事件响应',
    level: 'high',
    owner_name: '赵伟',
    participant_count: 7,
    sla_status: 'warning',
    decision_status: 'pending',
    status: 'deciding',
    created_at: '2026-03-10T11:00:00Z',
  },
  {
    case_id: 'CASE-006',
    title: '约翰内斯堡矿区罢工应对',
    level: 'critical',
    owner_name: '张明',
    participant_count: 9,
    sla_status: 'overdue',
    decision_status: 'rejected',
    status: 'reviewing',
    created_at: '2026-03-08T16:00:00Z',
  },
  {
    case_id: 'CASE-007',
    title: '欧洲能源价格波动影响评估',
    level: 'medium',
    owner_name: '李芳',
    participant_count: 4,
    sla_status: 'normal',
    decision_status: 'approved',
    status: 'closed',
    created_at: '2026-03-05T08:00:00Z',
  },
  {
    case_id: 'CASE-008',
    title: '日元汇率大幅波动采购策略',
    level: 'medium',
    owner_name: '陈晓红',
    participant_count: 3,
    sla_status: 'normal',
    decision_status: 'none',
    status: 'draft',
    created_at: '2026-03-01T10:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// SLA / Decision Badge helpers
// ---------------------------------------------------------------------------

const slaConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  normal: { label: '正常', variant: 'secondary' },
  warning: { label: '即将超时', variant: 'outline' },
  overdue: { label: '已超时', variant: 'destructive' },
}

const decisionConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: '待决策', variant: 'outline' },
  approved: { label: '已批准', variant: 'default' },
  rejected: { label: '已驳回', variant: 'destructive' },
  none: { label: '-', variant: 'secondary' },
}

const caseStatusConfig: Record<CaseStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: '草稿', variant: 'secondary' },
  open: { label: '已开启', variant: 'outline' },
  analyzing: { label: '分析中', variant: 'outline' },
  deciding: { label: '决策中', variant: 'default' },
  executing: { label: '执行中', variant: 'default' },
  reviewing: { label: '复盘中', variant: 'outline' },
  closed: { label: '已关闭', variant: 'secondary' },
}

// ---------------------------------------------------------------------------
// Columns
// ---------------------------------------------------------------------------

const columns: ColumnDef<WarRoomCase, unknown>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Case 标题" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: 'level',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="事件级别" />
    ),
    cell: ({ row }) => (
      <SeverityBadge severity={row.original.level} />
    ),
  },
  {
    accessorKey: 'owner_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="负责人" />
    ),
  },
  {
    accessorKey: 'participant_count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="参会人数" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Users className="h-3.5 w-3.5 text-muted-foreground" />
        <span>{row.original.participant_count}</span>
      </div>
    ),
  },
  {
    accessorKey: 'sla_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SLA 状态" />
    ),
    cell: ({ row }) => {
      const cfg = slaConfig[row.original.sla_status]
      return <Badge variant={cfg.variant}>{cfg.label}</Badge>
    },
  },
  {
    accessorKey: 'decision_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="决策状态" />
    ),
    cell: ({ row }) => {
      const cfg = decisionConfig[row.original.decision_status]
      return <Badge variant={cfg.variant}>{cfg.label}</Badge>
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Case 状态" />
    ),
    cell: ({ row }) => {
      const cfg = caseStatusConfig[row.original.status]
      return <Badge variant={cfg.variant}>{cfg.label}</Badge>
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="创建时间" />
    ),
    cell: ({ row }) =>
      new Date(row.original.created_at).toLocaleDateString('zh-CN'),
  },
]

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

const filterFields: FilterFieldConfig[] = [
  {
    key: 'status',
    label: '状态',
    type: 'select',
    placeholder: '全部状态',
    options: [
      { label: '草稿', value: 'draft' },
      { label: '分析中', value: 'analyzing' },
      { label: '决策中', value: 'deciding' },
      { label: '执行中', value: 'executing' },
      { label: '复盘中', value: 'reviewing' },
      { label: '已关闭', value: 'closed' },
    ],
  },
  {
    key: 'level',
    label: '级别',
    type: 'select',
    placeholder: '全部级别',
    options: [
      { label: '严重', value: 'critical' },
      { label: '高危', value: 'high' },
      { label: '中危', value: 'medium' },
      { label: '低危', value: 'low' },
    ],
  },
  {
    key: 'owner',
    label: '负责人',
    type: 'text',
    placeholder: '搜索负责人',
  },
]

// ---------------------------------------------------------------------------
// WarRoomList Page
// ---------------------------------------------------------------------------

export default function WarRoomList() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<FilterValues>({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newLevel, setNewLevel] = useState<string>('')

  // Filtered data
  const filteredData = useMemo(() => {
    return mockCases.filter((c) => {
      if (filters.status && c.status !== (filters.status as string)) return false
      if (filters.level && c.level !== (filters.level as string)) return false
      if (filters.owner) {
        const kw = (filters.owner as string).toLowerCase()
        if (!c.owner_name.toLowerCase().includes(kw)) return false
      }
      return true
    })
  }, [filters])

  const handleCreate = () => {
    if (!newTitle.trim()) {
      toast.error('请输入 Case 标题')
      return
    }
    toast.success('Case 创建成功', {
      description: `${newTitle} - ${newLevel || '未设置级别'}`,
    })
    setDialogOpen(false)
    setNewTitle('')
    setNewLevel('')
  }

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">协同处置中心</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            管理和追踪所有风险处置 Case
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-1.5 h-4 w-4" />
              新建 Case
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新建 Case</DialogTitle>
              <DialogDescription>
                创建新的协同处置 Case，关联风险事件进行集中处置。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="case-title">Case 标题</Label>
                <Input
                  id="case-title"
                  placeholder="请输入 Case 标题"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="case-level">事件级别</Label>
                <Select value={newLevel} onValueChange={setNewLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择级别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">严重</SelectItem>
                    <SelectItem value="high">高危</SelectItem>
                    <SelectItem value="medium">中危</SelectItem>
                    <SelectItem value="low">低危</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleCreate}>创建</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <FilterBar fields={filterFields} values={filters} onChange={setFilters} />

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        onRowClick={(row) => navigate({ to: '/warroom/$caseId', params: { caseId: row.case_id } })}
        pageSize={10}
      />
    </div>
  )
}
