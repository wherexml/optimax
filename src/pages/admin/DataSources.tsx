import { useState, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Settings, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

import { cn } from '@/lib/utils'
import { DataTable } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
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
import { Label } from '@/components/ui/label'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DSType = 'external' | 'internal'
type DSStatus = 'active' | 'error' | 'inactive'
type DSFrequency = 'realtime' | '5min' | '10min' | '15min' | '30min' | 'hourly' | '3hours' | '6hours' | 'daily'

interface DataSourceItem {
  id: string
  name: string
  type: DSType
  reliability: number
  frequency: DSFrequency
  frequencyLabel: string
  status: DSStatus
  lastSync: string
  enabled: boolean
  connectionUrl?: string
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
    frequency: '5min',
    frequencyLabel: '每5分钟',
    status: 'active',
    lastSync: '2026-03-20 14:32:00',
    enabled: true,
    connectionUrl: 'sap://internal-erp:3300/procurement',
  },
  {
    id: 'ds-002',
    name: '邓白氏企业征信',
    type: 'external',
    reliability: 92,
    frequency: 'daily',
    frequencyLabel: '每日',
    status: 'active',
    lastSync: '2026-03-20 06:00:00',
    enabled: true,
    connectionUrl: 'https://api.dnb.com/v1/credit',
  },
  {
    id: 'ds-003',
    name: '天眼查企业风险',
    type: 'external',
    reliability: 88,
    frequency: '6hours',
    frequencyLabel: '每6小时',
    status: 'active',
    lastSync: '2026-03-20 12:00:00',
    enabled: true,
    connectionUrl: 'https://api.tianyancha.com/risk',
  },
  {
    id: 'ds-004',
    name: '海关进出口数据',
    type: 'external',
    reliability: 85,
    frequency: 'daily',
    frequencyLabel: '每日',
    status: 'error',
    lastSync: '2026-03-18 06:00:00',
    enabled: true,
    connectionUrl: 'https://customs-api.gov.cn/import-export',
  },
  {
    id: 'ds-005',
    name: 'WMS 仓储系统',
    type: 'internal',
    reliability: 96,
    frequency: '10min',
    frequencyLabel: '每10分钟',
    status: 'active',
    lastSync: '2026-03-20 14:30:00',
    enabled: true,
    connectionUrl: 'wms://internal-wms:8080/api',
  },
  {
    id: 'ds-006',
    name: 'MES 生产执行系统',
    type: 'internal',
    reliability: 94,
    frequency: '15min',
    frequencyLabel: '每15分钟',
    status: 'active',
    lastSync: '2026-03-20 14:15:00',
    enabled: true,
    connectionUrl: 'mes://internal-mes:9090/api',
  },
  {
    id: 'ds-007',
    name: '国际航运追踪 API',
    type: 'external',
    reliability: 78,
    frequency: 'hourly',
    frequencyLabel: '每小时',
    status: 'error',
    lastSync: '2026-03-19 22:00:00',
    enabled: true,
    connectionUrl: 'https://api.shipping.com/v2/tracking',
  },
  {
    id: 'ds-008',
    name: '气象灾害预警接口',
    type: 'external',
    reliability: 82,
    frequency: '3hours',
    frequencyLabel: '每3小时',
    status: 'inactive',
    lastSync: '2026-03-15 09:00:00',
    enabled: false,
    connectionUrl: 'https://weather-alert.gov.cn/api',
  },
]

const frequencyOptions: { value: DSFrequency; label: string }[] = [
  { value: 'realtime', label: '实时' },
  { value: '5min', label: '每5分钟' },
  { value: '10min', label: '每10分钟' },
  { value: '15min', label: '每15分钟' },
  { value: '30min', label: '每30分钟' },
  { value: 'hourly', label: '每小时' },
  { value: '3hours', label: '每3小时' },
  { value: '6hours', label: '每6小时' },
  { value: 'daily', label: '每日' },
]

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
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [selectedDs, setSelectedDs] = useState<DataSourceItem | null>(null)
  const [tempFrequency, setTempFrequency] = useState<DSFrequency>('daily')
  const [testingConnection, setTestingConnection] = useState<string | null>(null)

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

  function openConfig(ds: DataSourceItem) {
    setSelectedDs(ds)
    setTempFrequency(ds.frequency)
    setConfigDialogOpen(true)
  }

  function saveConfig() {
    if (!selectedDs) return
    setData((prev) =>
      prev.map((d) =>
        d.id === selectedDs.id
          ? {
              ...d,
              frequency: tempFrequency,
              frequencyLabel: frequencyOptions.find((f) => f.value === tempFrequency)?.label || d.frequencyLabel,
            }
          : d,
      ),
    )
    setConfigDialogOpen(false)
    toast.success(`"${selectedDs.name}" 同步频率已更新`)
  }

  async function testConnection(ds: DataSourceItem) {
    setTestingConnection(ds.id)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setTestingConnection(null)

    // Random success/failure for demo
    const success = Math.random() > 0.3
    if (success) {
      toast.success(`"${ds.name}" 连接测试成功`, {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      })
      setData((prev) =>
        prev.map((d) =>
          d.id === ds.id ? { ...d, status: 'active' as const, lastSync: new Date().toLocaleString('zh-CN') } : d
        )
      )
    } else {
      toast.error(`"${ds.name}" 连接测试失败，请检查配置`, {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      })
    }
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
        accessorKey: 'frequencyLabel',
        header: '抓取频率',
        size: 100,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <span className="text-gray-700">{row.original.frequencyLabel}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-blue-600"
              onClick={() => openConfig(row.original)}
            >
              <Settings className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: '状态',
        size: 100,
        cell: ({ row }) => {
          const cfg = statusBadge[row.original.status]
          const isError = row.original.status === 'error'
          return (
            <Badge
              variant="outline"
              className={cn(
                cfg.className,
                isError && 'animate-pulse'
              )}
            >
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
        size: 140,
        cell: ({ row }) => {
          const ds = row.original
          const isTesting = testingConnection === ds.id
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-xs"
                disabled={isTesting}
                onClick={() => testConnection(ds)}
              >
                {isTesting ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <CheckCircle className="h-3 w-3" />
                )}
                {isTesting ? '测试中' : '校验'}
              </Button>
              <Switch
                checked={row.original.enabled}
                onCheckedChange={(checked) =>
                  handleToggle(row.original.id, checked)
                }
                aria-label={`${row.original.enabled ? '停用' : '启用'} ${row.original.name}`}
              />
            </div>
          )
        },
      },
    ],
    [testingConnection],
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

      {/* Config Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>数据源配置</DialogTitle>
            <DialogDescription>
              {selectedDs && `配置 "${selectedDs.name}" 的同步参数`}
            </DialogDescription>
          </DialogHeader>
          {selectedDs && (
            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label>数据源名称</Label>
                <div className="text-sm text-gray-600">{selectedDs.name}</div>
              </div>
              <div className="space-y-1.5">
                <Label>连接地址</Label>
                <div className="rounded bg-gray-50 px-3 py-2 font-mono text-xs text-gray-600">
                  {selectedDs.connectionUrl || '未配置'}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>同步频率</Label>
                <Select
                  value={tempFrequency}
                  onValueChange={(v) => setTempFrequency(v as DSFrequency)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={saveConfig}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
