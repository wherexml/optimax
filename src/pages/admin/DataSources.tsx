import { useState, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { DataTable } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DSType = 'external' | 'internal'
type DSStatus = 'active' | 'error' | 'inactive'

interface DataSourceItem {
  id: string
  name: string
  type: DSType
  reliability: number
  frequency: string
  status: DSStatus
  lastSync: string
  enabled: boolean
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockDataSources: DataSourceItem[] = [
  {
    id: 'ds-001',
    name: 'SAP ERP 采购模块',
    type: 'internal',
    reliability: 98,
    frequency: '每5分钟',
    status: 'active',
    lastSync: '2026-03-20 14:32:00',
    enabled: true,
  },
  {
    id: 'ds-002',
    name: '邓白氏企业征信',
    type: 'external',
    reliability: 92,
    frequency: '每日',
    status: 'active',
    lastSync: '2026-03-20 06:00:00',
    enabled: true,
  },
  {
    id: 'ds-003',
    name: '天眼查企业风险',
    type: 'external',
    reliability: 88,
    frequency: '每6小时',
    status: 'active',
    lastSync: '2026-03-20 12:00:00',
    enabled: true,
  },
  {
    id: 'ds-004',
    name: '海关进出口数据',
    type: 'external',
    reliability: 85,
    frequency: '每日',
    status: 'error',
    lastSync: '2026-03-18 06:00:00',
    enabled: true,
  },
  {
    id: 'ds-005',
    name: 'WMS 仓储系统',
    type: 'internal',
    reliability: 96,
    frequency: '每10分钟',
    status: 'active',
    lastSync: '2026-03-20 14:30:00',
    enabled: true,
  },
  {
    id: 'ds-006',
    name: 'MES 生产执行系统',
    type: 'internal',
    reliability: 94,
    frequency: '每15分钟',
    status: 'active',
    lastSync: '2026-03-20 14:15:00',
    enabled: true,
  },
  {
    id: 'ds-007',
    name: '国际航运追踪 API',
    type: 'external',
    reliability: 78,
    frequency: '每小时',
    status: 'error',
    lastSync: '2026-03-19 22:00:00',
    enabled: true,
  },
  {
    id: 'ds-008',
    name: '气象灾害预警接口',
    type: 'external',
    reliability: 82,
    frequency: '每3小时',
    status: 'inactive',
    lastSync: '2026-03-15 09:00:00',
    enabled: false,
  },
]

// ---------------------------------------------------------------------------
// Badge configs
// ---------------------------------------------------------------------------

const typeBadge: Record<DSType, { label: string; className: string }> = {
  external: {
    label: '外部',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  internal: {
    label: '内部',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
}

const statusBadge: Record<DSStatus, { label: string; className: string }> = {
  active: {
    label: '正常',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  error: {
    label: '断流',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  inactive: {
    label: '停用',
    className: 'bg-gray-50 text-gray-500 border-gray-200',
  },
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DataSources() {
  const [data, setData] = useState(mockDataSources)

  function handleToggle(id: string, checked: boolean) {
    setData((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              enabled: checked,
              status: checked ? ('active' as const) : ('inactive' as const),
            }
          : d,
      ),
    )
    toast.success(checked ? '数据源已启用' : '数据源已停用')
  }

  const columns: ColumnDef<DataSourceItem, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: '来源名称',
        size: 200,
        cell: ({ row }) => (
          <span className="font-medium text-gray-900">
            {row.original.name}
          </span>
        ),
      },
      {
        accessorKey: 'type',
        header: '类型',
        size: 80,
        cell: ({ row }) => {
          const cfg = typeBadge[row.original.type]
          return (
            <Badge variant="outline" className={cfg.className}>
              {cfg.label}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'reliability',
        header: '可信度',
        size: 140,
        cell: ({ row }) => {
          const val = row.original.reliability
          return (
            <div className="flex items-center gap-2">
              <Progress value={val} className="h-2 w-20" />
              <span className="text-xs text-gray-500">{val}%</span>
            </div>
          )
        },
      },
      {
        accessorKey: 'frequency',
        header: '抓取频率',
        size: 100,
      },
      {
        accessorKey: 'status',
        header: '状态',
        size: 80,
        cell: ({ row }) => {
          const cfg = statusBadge[row.original.status]
          return (
            <Badge variant="outline" className={cfg.className}>
              {cfg.label}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'lastSync',
        header: '最近同步',
        size: 160,
        cell: ({ row }) => (
          <span className="text-sm text-gray-500">
            {row.original.lastSync}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '操作',
        size: 80,
        cell: ({ row }) => (
          <Switch
            checked={row.original.enabled}
            onCheckedChange={(checked) =>
              handleToggle(row.original.id, checked)
            }
            aria-label={`${row.original.enabled ? '停用' : '启用'} ${row.original.name}`}
          />
        ),
      },
    ],
    [],
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">数据源</h2>
        <p className="mt-1 text-sm text-gray-500">
          配置和管理数据源连接
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        showPagination={false}
        emptyMessage="暂无数据源"
        className={cn('[&_tr]:transition-colors', '[&_tr:has([data-error="true"])]:bg-red-50/50')}
      />

      {/* Note: row highlighting for error status is applied via custom rendering */}
    </div>
  )
}
