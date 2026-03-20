import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { ExternalLink, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/DataTable/DataTable'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { StatusBadge } from '@/components/common/StatusBadge'
import type { MockAlertEvent } from '@/mocks/data/suppliers'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AlertHistoryProps {
  events: MockAlertEvent[]
  stats: {
    close_rate: number
    avg_resolution_days: number
    open_count: number
  }
}

// ---------------------------------------------------------------------------
// Helper: format date
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AlertHistory({ events, stats }: AlertHistoryProps) {
  const navigate = useNavigate()

  const columns = useMemo<ColumnDef<MockAlertEvent, unknown>[]>(
    () => [
      {
        accessorKey: 'title',
        header: '事件标题',
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <span className="max-w-[260px] truncate font-medium">
              {row.original.title}
            </span>
            <ExternalLink className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
          </div>
        ),
      },
      {
        accessorKey: 'severity',
        header: '等级',
        cell: ({ row }) => <SeverityBadge severity={row.original.severity} size="sm" />,
      },
      {
        accessorKey: 'created_at',
        header: '时间',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.original.created_at)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: '状态',
        cell: ({ row }) => <StatusBadge status={row.original.status} size="sm" />,
      },
      {
        accessorKey: 'resolution_days',
        header: '处置时长',
        cell: ({ row }) => {
          const days = row.original.resolution_days
          if (days === null) {
            return (
              <span className="text-xs font-medium text-orange-600">进行中</span>
            )
          }
          return <span className="text-sm">{days} 天</span>
        },
      },
    ],
    [],
  )

  const handleRowClick = (row: MockAlertEvent) => {
    navigate({ to: '/risk/events/$eventId', params: { eventId: row.event_id } })
  }

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              关闭率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {Math.round(stats.close_rate * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4 text-blue-500" />
              平均处置时长
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {stats.avg_resolution_days} <span className="text-base font-normal text-muted-foreground">天</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <AlertCircle className="h-4 w-4 text-red-500" />
              当前未闭环
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${stats.open_count > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {stats.open_count} <span className="text-base font-normal text-muted-foreground">条</span>
            </p>
            {stats.open_count > 0 && (
              <p className="mt-1 text-xs text-red-500">需要优先关注</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* History table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">历史事件列表</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={events}
            onRowClick={handleRowClick}
            pageSize={10}
            showPagination={events.length > 10}
            emptyMessage="暂无历史事件"
          />
        </CardContent>
      </Card>
    </div>
  )
}
