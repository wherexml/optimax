import { useState, useCallback, useMemo } from 'react'
import type { RowSelectionState } from '@tanstack/react-table'
import { toast } from 'sonner'

import { DataTable } from '@/components/DataTable'
import { FilterBar, type FilterFieldConfig, type FilterValues } from '@/components/filter'
import { createEventColumns } from '@/components/risk/columns'
import { BatchActionBar } from '@/components/risk/BatchActionBar'
import { EventDrawer } from '@/components/risk/EventDrawer'
import { mockEventListItems } from '@/mocks/data/events'
import type { RiskEventListItem } from '@/types/event'

// ---------------------------------------------------------------------------
// Filter configuration
// ---------------------------------------------------------------------------

const filterFields: FilterFieldConfig[] = [
  {
    key: 'type',
    label: '风险类型',
    type: 'multi-select',
    options: [
      { label: '供应中断', value: 'supply_disruption' },
      { label: '质量问题', value: 'quality_issue' },
      { label: '合规违规', value: 'compliance_violation' },
      { label: '财务风险', value: 'financial_risk' },
      { label: '地缘政治', value: 'geopolitical' },
      { label: '自然灾害', value: 'natural_disaster' },
      { label: '网络安全', value: 'cyber_security' },
      { label: '法规变更', value: 'regulatory_change' },
    ],
  },
  {
    key: 'severity',
    label: '严重级别',
    type: 'multi-select',
    options: [
      { label: '严重', value: 'critical' },
      { label: '高危', value: 'high' },
      { label: '中危', value: 'medium' },
      { label: '低危', value: 'low' },
      { label: '信息', value: 'info' },
    ],
  },
  {
    key: 'status',
    label: '状态',
    type: 'multi-select',
    options: [
      { label: '新入库', value: 'new' },
      { label: '处理中', value: 'in_progress' },
      { label: '已解决', value: 'resolved' },
      { label: '已归档', value: 'archived' },
    ],
  },
  {
    key: 'owner',
    label: '责任人',
    type: 'select',
    placeholder: '选择责任人',
    options: [
      { label: '张三', value: '张三' },
      { label: '李四', value: '李四' },
      { label: '王五', value: '王五' },
      { label: '赵六', value: '赵六' },
    ],
  },
  {
    key: 'dateRange',
    label: '时间范围',
    type: 'date-range',
    placeholder: '选择时间范围',
  },
]

// ---------------------------------------------------------------------------
// Workbench Page
// ---------------------------------------------------------------------------

export default function Workbench() {
  // Filter state
  const [filters, setFilters] = useState<FilterValues>({})

  // Row selection state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // Drawer state
  const [drawerEvent, setDrawerEvent] = useState<RiskEventListItem | null>(null)

  // ---------------------------------------------------------------------------
  // Filtered data
  // ---------------------------------------------------------------------------

  const filteredData = useMemo(() => {
    let data = [...mockEventListItems]

    // Apply type filter
    const typeFilter = filters.type as string[] | undefined
    if (typeFilter && typeFilter.length > 0) {
      data = data.filter((e) => typeFilter.includes(e.type))
    }

    // Apply severity filter
    const sevFilter = filters.severity as string[] | undefined
    if (sevFilter && sevFilter.length > 0) {
      data = data.filter((e) => sevFilter.includes(e.severity))
    }

    // Apply status filter
    const statusFilter = filters.status as string[] | undefined
    if (statusFilter && statusFilter.length > 0) {
      data = data.filter((e) => statusFilter.includes(e.status))
    }

    // Apply owner filter
    const ownerFilter = filters.owner as string | undefined
    if (ownerFilter) {
      data = data.filter((e) => e.owner_name === ownerFilter)
    }

    // Apply date range filter
    const dateRange = filters.dateRange as { from?: Date; to?: Date } | undefined
    if (dateRange?.from) {
      const from = dateRange.from.getTime()
      data = data.filter((e) => new Date(e.occurred_at).getTime() >= from)
    }
    if (dateRange?.to) {
      const to = dateRange.to.getTime() + 86400000 // include end date
      data = data.filter((e) => new Date(e.occurred_at).getTime() <= to)
    }

    return data
  }, [filters])

  // ---------------------------------------------------------------------------
  // Column definitions (memoized, with drawer open callback)
  // ---------------------------------------------------------------------------

  const columns = useMemo(
    () => createEventColumns((event) => setDrawerEvent(event)),
    []
  )

  // ---------------------------------------------------------------------------
  // Selection helpers
  // ---------------------------------------------------------------------------

  const selectedCount = Object.keys(rowSelection).length

  const handleClearSelection = useCallback(() => {
    setRowSelection({})
  }, [])

  // ---------------------------------------------------------------------------
  // Batch action callbacks
  // ---------------------------------------------------------------------------

  const handleMerge = useCallback(
    (reason: string) => {
      toast.success(`已合并 ${selectedCount} 个事件`, {
        description: reason,
      })
      setRowSelection({})
    },
    [selectedCount]
  )

  const handleIgnore = useCallback(
    (reason: string) => {
      toast.success(`已忽略 ${selectedCount} 个事件`, {
        description: reason,
      })
      setRowSelection({})
    },
    [selectedCount]
  )

  const handleAssign = useCallback(
    (userId: string) => {
      toast.success(`已分派 ${selectedCount} 个事件给 ${userId}`)
      setRowSelection({})
    },
    [selectedCount]
  )

  const handleEscalate = useCallback(
    (reason: string) => {
      toast.success(`已升级 ${selectedCount} 个事件`, {
        description: reason,
      })
      setRowSelection({})
    },
    [selectedCount]
  )

  const handleTag = useCallback(() => {
    toast.info('标签功能开发中')
  }, [])

  const handleExport = useCallback(() => {
    toast.info('导出功能开发中')
  }, [])

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">风险工作台</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          统一管理和处理供应链风险事件，支持筛选、批量操作和快速研判
        </p>
      </div>

      {/* Filter bar */}
      <FilterBar
        fields={filterFields}
        values={filters}
        onChange={setFilters}
      />

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        共 <span className="font-medium text-foreground">{filteredData.length}</span> 条事件
      </div>

      {/* Data table */}
      <DataTable
        columns={columns}
        data={filteredData}
        enableRowSelection
        enableMultiRowSelection
        onRowSelectionChange={setRowSelection}
        onRowClick={(row) => setDrawerEvent(row)}
        pageSize={20}
        maxHeight="calc(100vh - 340px)"
        emptyMessage="没有匹配的风险事件"
      />

      {/* Batch action bar */}
      <BatchActionBar
        selectedCount={selectedCount}
        onClear={handleClearSelection}
        onMerge={handleMerge}
        onIgnore={handleIgnore}
        onAssign={handleAssign}
        onEscalate={handleEscalate}
        onTag={handleTag}
        onExport={handleExport}
      />

      {/* Event detail drawer */}
      <EventDrawer event={drawerEvent} onClose={() => setDrawerEvent(null)} />
    </div>
  )
}
