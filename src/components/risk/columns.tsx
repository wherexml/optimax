import type { ColumnDef } from '@tanstack/react-table'
import { format, differenceInDays, differenceInHours } from 'date-fns'
import { zhCN } from 'date-fns/locale'

import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/DataTable'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { StatusBadge } from '@/components/common/StatusBadge'
import type { RiskEventListItem } from '@/types/event'
import type { Severity } from '@/types/enums'

// ---------------------------------------------------------------------------
// Severity sort order (for default desc sort)
// ---------------------------------------------------------------------------

const severityOrder: Record<Severity, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  info: 1,
}

// ---------------------------------------------------------------------------
// Risk type labels
// ---------------------------------------------------------------------------

const riskTypeLabels: Record<string, string> = {
  supply_disruption: '供应中断',
  quality_issue: '质量问题',
  compliance_violation: '合规违规',
  financial_risk: '财务风险',
  geopolitical: '地缘政治',
  natural_disaster: '自然灾害',
  cyber_security: '网络安全',
  regulatory_change: '法规变更',
}

// ---------------------------------------------------------------------------
// SLA helper
// ---------------------------------------------------------------------------

function formatSlaRemaining(slaDueAt: string | undefined): {
  text: string
  isOverdue: boolean
} {
  if (!slaDueAt) return { text: '-', isOverdue: false }
  const now = new Date()
  const due = new Date(slaDueAt)
  const diffDays = differenceInDays(due, now)
  const diffHours = differenceInHours(due, now)

  if (diffDays < 0) {
    return { text: `超期 ${Math.abs(diffDays)} 天`, isOverdue: true }
  }
  if (diffDays === 0) {
    if (diffHours <= 0) {
      return { text: '已到期', isOverdue: true }
    }
    return { text: `${diffHours} 小时`, isOverdue: false }
  }
  return { text: `${diffDays} 天`, isOverdue: false }
}

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------

export function createEventColumns(
  onTitleClick: (event: RiskEventListItem) => void
): ColumnDef<RiskEventListItem, unknown>[] {
  return [
    // Checkbox column
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="全选"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          onClick={(e) => e.stopPropagation()}
          aria-label="选择行"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },

    // Severity
    {
      accessorKey: 'severity',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="严重级别" />
      ),
      cell: ({ row }) => (
        <SeverityBadge severity={row.getValue('severity')} size="sm" />
      ),
      sortingFn: (rowA, rowB) => {
        const a = severityOrder[rowA.getValue<Severity>('severity')]
        const b = severityOrder[rowB.getValue<Severity>('severity')]
        return a - b
      },
      size: 100,
    },

    // Title
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="事件标题" />
      ),
      cell: ({ row }) => (
        <button
          type="button"
          className="max-w-[320px] truncate text-left text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
          onClick={(e) => {
            e.stopPropagation()
            onTitleClick(row.original)
          }}
        >
          {row.getValue('title')}
        </button>
      ),
      size: 320,
    },

    // Risk type
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="风险类型" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {riskTypeLabels[row.getValue('type') as string] ?? row.getValue('type')}
        </span>
      ),
      size: 100,
    },

    // Occurred at
    {
      accessorKey: 'occurred_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="来源时间" />
      ),
      cell: ({ row }) => {
        const dateStr = row.getValue('occurred_at') as string
        return (
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {format(new Date(dateStr), 'MM-dd HH:mm', { locale: zhCN })}
          </span>
        )
      },
      size: 110,
    },

    // Impact count
    {
      accessorKey: 'impact_count',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="影响对象" />
      ),
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">
          {row.getValue('impact_count')}
        </span>
      ),
      size: 80,
    },

    // Confidence
    {
      accessorKey: 'confidence',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="置信度" />
      ),
      cell: ({ row }) => {
        const val = row.getValue('confidence') as number
        const isLow = val < 60
        return (
          <span
            className={`text-sm tabular-nums font-medium ${
              isLow ? 'text-orange-600' : 'text-foreground'
            }`}
          >
            {val}%
          </span>
        )
      },
      size: 80,
    },

    // Status
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="状态" />
      ),
      cell: ({ row }) => (
        <StatusBadge status={row.getValue('status')} size="sm" />
      ),
      size: 100,
    },

    // Owner
    {
      accessorKey: 'owner_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="责任人" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue('owner_name')}</span>
      ),
      size: 80,
    },

    // SLA remaining
    {
      accessorKey: 'sla_due_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="SLA 剩余" />
      ),
      cell: ({ row }) => {
        const { text, isOverdue } = formatSlaRemaining(
          row.getValue('sla_due_at') as string | undefined
        )
        return (
          <span
            className={`text-sm font-medium whitespace-nowrap ${
              isOverdue ? 'text-red-600' : 'text-muted-foreground'
            }`}
          >
            {text}
          </span>
        )
      },
      size: 100,
    },
  ]
}
