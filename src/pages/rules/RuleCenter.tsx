import { useState, useMemo } from 'react'
import { Copy } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { DataTable } from '@/components/DataTable'
import { SeverityBadge } from '@/components/common'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  rules as mockRules,
  ruleCategoryLabels,
  type Rule,
  type RuleCategory,
} from '@/mocks/data/rules'

// ---------------------------------------------------------------------------
// Status Badge
// ---------------------------------------------------------------------------

const ruleStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  enabled: {
    label: '启用',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  disabled: {
    label: '停用',
    className: 'bg-gray-50 text-gray-500 border-gray-200',
  },
  draft: {
    label: '草稿',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
}

function RuleStatusBadge({ status }: { status: string }) {
  const config = ruleStatusConfig[status] ?? ruleStatusConfig.disabled
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}

// ---------------------------------------------------------------------------
// Category tabs
// ---------------------------------------------------------------------------

const categories: { value: RuleCategory | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  ...Object.entries(ruleCategoryLabels).map(([value, label]) => ({
    value: value as RuleCategory,
    label,
  })),
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RuleCenter() {
  const [activeCategory, setActiveCategory] = useState<
    RuleCategory | 'all'
  >('all')
  const [ruleData, setRuleData] = useState<Rule[]>(mockRules)

  // Filter by active tab
  const filteredRules = useMemo(() => {
    if (activeCategory === 'all') return ruleData
    return ruleData.filter((r) => r.category === activeCategory)
  }, [activeCategory, ruleData])

  // Toggle rule enable/disable
  function handleToggle(ruleId: string, checked: boolean) {
    setRuleData((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              enabled: checked,
              status: checked ? ('enabled' as const) : ('disabled' as const),
            }
          : r,
      ),
    )
    toast.success(checked ? '规则已启用' : '规则已停用')
  }

  // Copy rule
  function handleCopy(rule: Rule) {
    const newRule: Rule = {
      ...rule,
      id: `rule-copy-${Date.now()}`,
      name: `${rule.name} (副本)`,
      status: 'draft',
      enabled: false,
      version: 'v0.1',
    }
    setRuleData((prev) => [...prev, newRule])
    toast.success('规则已复制')
  }

  // Columns
  const columns: ColumnDef<Rule, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: '规则名称',
        size: 200,
        cell: ({ row }) => (
          <span className="font-medium text-gray-900">
            {row.original.name}
          </span>
        ),
      },
      {
        accessorKey: 'triggerCondition',
        header: '触发条件摘要',
        size: 260,
        cell: ({ row }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="block max-w-[240px] truncate text-gray-600">
                  {row.original.triggerCondition}
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-sm">
                <p className="text-sm">{row.original.triggerCondition}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      },
      {
        accessorKey: 'severity',
        header: '级别',
        size: 80,
        cell: ({ row }) => (
          <SeverityBadge severity={row.original.severity} />
        ),
      },
      {
        accessorKey: 'status',
        header: '状态',
        size: 80,
        cell: ({ row }) => (
          <RuleStatusBadge status={row.original.status} />
        ),
      },
      {
        accessorKey: 'owner',
        header: '负责人',
        size: 90,
      },
      {
        accessorKey: 'version',
        header: '版本号',
        size: 80,
      },
      {
        accessorKey: 'scope',
        header: '生效范围',
        size: 120,
      },
      {
        id: 'actions',
        header: '操作',
        size: 120,
        cell: ({ row }) => {
          const rule = row.original
          return (
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleCopy(rule)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>复制规则</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Switch
                checked={rule.enabled}
                onCheckedChange={(checked) =>
                  handleToggle(rule.id, checked)
                }
                aria-label={`${rule.enabled ? '停用' : '启用'}规则 ${rule.name}`}
              />
            </div>
          )
        },
      },
    ],
    [],
  )

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">规则中心</h1>
        <p className="mt-1 text-sm text-gray-500">
          配置和管理各类风险规则与审批策略
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs
        value={activeCategory}
        onValueChange={(v) =>
          setActiveCategory(v as RuleCategory | 'all')
        }
      >
        <TabsList>
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredRules}
        pageSize={20}
        showPagination
        emptyMessage="暂无规则数据"
      />
    </div>
  )
}
