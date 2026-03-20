import { useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'

import { DataTable } from '@/components/DataTable'
import { DataTableColumnHeader } from '@/components/DataTable/DataTableColumnHeader'
import { FilterBar, type FilterFieldConfig, type FilterValues } from '@/components/filter/FilterBar'
import { Badge } from '@/components/ui/badge'
import type { SupplierStatus } from '@/types/enums'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SupplierRow {
  supplier_id: string
  name: string
  region: string
  risk_score: number
  status: SupplierStatus
  active_event_count: number
  key_material_count: number
}

// ---------------------------------------------------------------------------
// Mock 15 suppliers
// ---------------------------------------------------------------------------

const mockSupplierRows: SupplierRow[] = [
  { supplier_id: 'SUP-001', name: '深圳华芯微电子有限公司', region: '华南', risk_score: 65, status: 'active', active_event_count: 3, key_material_count: 5 },
  { supplier_id: 'SUP-002', name: '上海博锐精密机械股份有限公司', region: '华东', risk_score: 42, status: 'active', active_event_count: 0, key_material_count: 5 },
  { supplier_id: 'SUP-003', name: 'TechVision Materials GmbH', region: '欧洲', risk_score: 28, status: 'active', active_event_count: 0, key_material_count: 5 },
  { supplier_id: 'SUP-004', name: '河北中泰钢铁集团有限公司', region: '华北', risk_score: 82, status: 'suspended', active_event_count: 3, key_material_count: 5 },
  { supplier_id: 'SUP-005', name: 'Sakura Electronics Co., Ltd.', region: '亚太', risk_score: 35, status: 'inactive', active_event_count: 0, key_material_count: 5 },
  { supplier_id: 'SUP-006', name: '广州恒力化工有限公司', region: '华南', risk_score: 55, status: 'active', active_event_count: 2, key_material_count: 3 },
  { supplier_id: 'SUP-007', name: 'American Steel Dynamics Inc.', region: '北美', risk_score: 48, status: 'active', active_event_count: 1, key_material_count: 4 },
  { supplier_id: 'SUP-008', name: '成都锐芯科技有限公司', region: '西南', risk_score: 38, status: 'active', active_event_count: 0, key_material_count: 3 },
  { supplier_id: 'SUP-009', name: 'Samsung SDI Battery Division', region: '亚太', risk_score: 30, status: 'active', active_event_count: 1, key_material_count: 2 },
  { supplier_id: 'SUP-010', name: '天津海光精密仪器有限公司', region: '华北', risk_score: 72, status: 'active', active_event_count: 4, key_material_count: 6 },
  { supplier_id: 'SUP-011', name: 'Rio Tinto Mining Australia', region: '大洋洲', risk_score: 45, status: 'active', active_event_count: 1, key_material_count: 3 },
  { supplier_id: 'SUP-012', name: '浙江万向集团', region: '华东', risk_score: 33, status: 'active', active_event_count: 0, key_material_count: 4 },
  { supplier_id: 'SUP-013', name: 'Bosch Automotive Parts GmbH', region: '欧洲', risk_score: 22, status: 'active', active_event_count: 0, key_material_count: 7 },
  { supplier_id: 'SUP-014', name: '武汉长飞光纤光缆', region: '华中', risk_score: 58, status: 'pending', active_event_count: 2, key_material_count: 2 },
  { supplier_id: 'SUP-015', name: 'Tata Chemicals Ltd.', region: '南亚', risk_score: 61, status: 'active', active_event_count: 3, key_material_count: 4 },
]

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const supplierStatusConfig: Record<SupplierStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: '合作中', variant: 'default' },
  inactive: { label: '已停用', variant: 'secondary' },
  suspended: { label: '已暂停', variant: 'destructive' },
  pending: { label: '待审批', variant: 'outline' },
}

// ---------------------------------------------------------------------------
// Risk score color bar
// ---------------------------------------------------------------------------

function RiskScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? '#D64545' : score >= 50 ? '#EA580C' : score >= 30 ? '#D98A00' : '#2E8B57'
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-medium" style={{ color }}>
        {score}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Columns
// ---------------------------------------------------------------------------

const columns: ColumnDef<SupplierRow, unknown>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="供应商名称" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: 'region',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="区域" />
    ),
  },
  {
    accessorKey: 'risk_score',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="风险评分" />
    ),
    cell: ({ row }) => <RiskScoreBar score={row.original.risk_score} />,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="合作状态" />
    ),
    cell: ({ row }) => {
      const cfg = supplierStatusConfig[row.original.status]
      return <Badge variant={cfg.variant}>{cfg.label}</Badge>
    },
  },
  {
    accessorKey: 'active_event_count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="当前事件数" />
    ),
    cell: ({ row }) => {
      const count = row.original.active_event_count
      return (
        <span className={count > 0 ? 'font-semibold text-red-600' : 'text-muted-foreground'}>
          {count}
        </span>
      )
    },
  },
  {
    accessorKey: 'key_material_count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="关键物料数" />
    ),
  },
]

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

const filterFields: FilterFieldConfig[] = [
  {
    key: 'region',
    label: '区域',
    type: 'select',
    placeholder: '全部区域',
    options: [
      { label: '华南', value: '华南' },
      { label: '华东', value: '华东' },
      { label: '华北', value: '华北' },
      { label: '华中', value: '华中' },
      { label: '西南', value: '西南' },
      { label: '亚太', value: '亚太' },
      { label: '欧洲', value: '欧洲' },
      { label: '北美', value: '北美' },
      { label: '南亚', value: '南亚' },
      { label: '大洋洲', value: '大洋洲' },
    ],
  },
  {
    key: 'riskLevel',
    label: '风险等级',
    type: 'select',
    placeholder: '全部等级',
    options: [
      { label: '高风险 (>=70)', value: 'high' },
      { label: '中风险 (50-69)', value: 'medium' },
      { label: '低风险 (<50)', value: 'low' },
    ],
  },
  {
    key: 'status',
    label: '合作状态',
    type: 'select',
    placeholder: '全部状态',
    options: [
      { label: '合作中', value: 'active' },
      { label: '已停用', value: 'inactive' },
      { label: '已暂停', value: 'suspended' },
      { label: '待审批', value: 'pending' },
    ],
  },
]

// ---------------------------------------------------------------------------
// SupplierList Page
// ---------------------------------------------------------------------------

export default function SupplierList() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<FilterValues>({})

  const filteredData = useMemo(() => {
    return mockSupplierRows.filter((s) => {
      if (filters.region && s.region !== (filters.region as string)) return false
      if (filters.status && s.status !== (filters.status as string)) return false
      if (filters.riskLevel) {
        const level = filters.riskLevel as string
        if (level === 'high' && s.risk_score < 70) return false
        if (level === 'medium' && (s.risk_score < 50 || s.risk_score >= 70)) return false
        if (level === 'low' && s.risk_score >= 50) return false
      }
      return true
    })
  }, [filters])

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">供应商管理</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          供应商风险评估与管理 ({filteredData.length} 家)
        </p>
      </div>

      {/* Filters */}
      <FilterBar fields={filterFields} values={filters} onChange={setFilters} />

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        onRowClick={(row) =>
          navigate({ to: '/suppliers/$supplierId', params: { supplierId: row.supplier_id } })
        }
        pageSize={20}
      />
    </div>
  )
}
