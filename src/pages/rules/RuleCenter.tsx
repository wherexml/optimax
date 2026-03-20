import { useState, useMemo } from 'react'
import { Copy, Plus, Pencil, Trash2, GitBranch } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { DataTable } from '@/components/DataTable'
import { SeverityBadge } from '@/components/common'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from '@/components/ui/textarea'
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
import { ConditionEditor } from '@/components/rules/ConditionEditor'
import { ActionConfig } from '@/components/rules/ActionConfig'
import { VersionControl } from '@/components/rules/VersionControl'
import type {
  ConditionGroup,
  ActionItem,
  ThresholdConfig,
} from '@/components/rules'

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
// Rule Form Types
// ---------------------------------------------------------------------------

interface RuleFormData {
  id?: string
  name: string
  category: RuleCategory
  triggerCondition: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  status: 'enabled' | 'disabled' | 'draft'
  owner: string
  version: string
  scope: string
  enabled: boolean
  conditionGroup: ConditionGroup
  actions: ActionItem[]
  threshold: ThresholdConfig
}

const defaultFormData: RuleFormData = {
  name: '',
  category: 'demand_risk',
  triggerCondition: '',
  severity: 'medium',
  status: 'draft',
  owner: '',
  version: 'v1.0',
  scope: '全集团',
  enabled: false,
  conditionGroup: ConditionEditor.createDefaultGroup(),
  actions: [],
  threshold: ConditionEditor.defaultThreshold,
}

// ---------------------------------------------------------------------------
// Rule Edit Dialog
// ---------------------------------------------------------------------------

interface RuleEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: RuleFormData
  onSave: (data: RuleFormData) => void
  mode: 'create' | 'edit'
}

function RuleEditDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
  mode,
}: RuleEditDialogProps) {
  const [formData, setFormData] = useState<RuleFormData>(
    initialData ?? defaultFormData,
  )
  const [activeTab, setActiveTab] = useState<'basic' | 'condition' | 'action'>('basic')

  // Reset form when dialog opens/closes
  useState(() => {
    if (open) {
      setFormData(initialData ?? defaultFormData)
      setActiveTab('basic')
    }
  })

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('请输入规则名称')
      return
    }
    if (!formData.owner.trim()) {
      toast.error('请输入负责人')
      return
    }
    onSave(formData)
    onOpenChange(false)
  }

  const title = mode === 'create' ? '新建规则' : '编辑规则'
  const description =
    mode === 'create'
      ? '创建新的风险规则，配置触发条件和执行动作'
      : '修改规则配置，变更将在保存后生效'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b pb-2">
          <Button
            variant={activeTab === 'basic' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('basic')}
          >
            基础信息
          </Button>
          <Button
            variant={activeTab === 'condition' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('condition')}
          >
            触发条件
          </Button>
          <Button
            variant={activeTab === 'action' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('action')}
          >
            执行动作
          </Button>
        </div>

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  规则名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="输入规则名称"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">规则分类</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: v as RuleCategory,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ruleCategoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="triggerCondition">触发条件摘要</Label>
              <Textarea
                id="triggerCondition"
                placeholder="简要描述规则触发条件"
                value={formData.triggerCondition}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    triggerCondition: e.target.value,
                  }))
                }
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="severity">严重级别</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(v) =>
                    setFormData((prev) => ({
                      ...prev,
                      severity: v as RuleFormData['severity'],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">严重</SelectItem>
                    <SelectItem value="high">高危</SelectItem>
                    <SelectItem value="medium">中危</SelectItem>
                    <SelectItem value="low">低危</SelectItem>
                    <SelectItem value="info">信息</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">
                  负责人 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="owner"
                  placeholder="输入负责人姓名"
                  value={formData.owner}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, owner: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">版本号</Label>
                <Input
                  id="version"
                  placeholder="v1.0"
                  value={formData.version}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, version: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scope">生效范围</Label>
              <Input
                id="scope"
                placeholder="例如：全集团、华东事业部"
                value={formData.scope}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, scope: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">规则状态</Label>
              <Select
                value={formData.status}
                onValueChange={(v) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: v as RuleFormData['status'],
                    enabled: v === 'enabled',
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="enabled">启用</SelectItem>
                  <SelectItem value="disabled">停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Condition Tab */}
        {activeTab === 'condition' && (
          <div className="space-y-4 py-4">
            <ConditionEditor
              value={formData.conditionGroup}
              onChange={(group) =>
                setFormData((prev) => ({ ...prev, conditionGroup: group }))
              }
              threshold={formData.threshold}
              onThresholdChange={(threshold) =>
                setFormData((prev) => ({ ...prev, threshold }))
              }
            />
          </div>
        )}

        {/* Action Tab */}
        {activeTab === 'action' && (
          <div className="space-y-4 py-4">
            <ActionConfig
              value={formData.actions}
              onChange={(actions) =>
                setFormData((prev) => ({ ...prev, actions }))
              }
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RuleCenter() {
  const [activeCategory, setActiveCategory] = useState<
    RuleCategory | 'all'
  >('all')
  const [ruleData, setRuleData] = useState<Rule[]>(mockRules)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [editingRule, setEditingRule] = useState<RuleFormData | undefined>()
  const [versionDialogOpen, setVersionDialogOpen] = useState(false)
  const [selectedRuleForVersion, setSelectedRuleForVersion] = useState<Rule | null>(null)

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

  // Delete rule
  function handleDelete(rule: Rule) {
    if (confirm(`确定要删除规则「${rule.name}」吗？`)) {
      setRuleData((prev) => prev.filter((r) => r.id !== rule.id))
      toast.success('规则已删除')
    }
  }

  // Open create dialog
  function handleCreate() {
    setDialogMode('create')
    setEditingRule(undefined)
    setDialogOpen(true)
  }

  // Open edit dialog
  function handleEdit(rule: Rule) {
    setDialogMode('edit')
    setEditingRule({
      id: rule.id,
      name: rule.name,
      category: rule.category,
      triggerCondition: rule.triggerCondition,
      severity: rule.severity,
      status: rule.status,
      owner: rule.owner,
      version: rule.version,
      scope: rule.scope,
      enabled: rule.enabled,
      conditionGroup: ConditionEditor.createDefaultGroup(),
      actions: [],
      threshold: ConditionEditor.defaultThreshold,
    })
    setDialogOpen(true)
  }

  // Open version control dialog
  function handleViewVersions(rule: Rule) {
    setSelectedRuleForVersion(rule)
    setVersionDialogOpen(true)
  }

  // Save rule
  function handleSave(formData: RuleFormData) {
    if (dialogMode === 'create') {
      const newRule: Rule = {
        id: `rule-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        triggerCondition: formData.triggerCondition,
        severity: formData.severity,
        status: formData.status,
        owner: formData.owner,
        version: formData.version,
        scope: formData.scope,
        enabled: formData.enabled,
      }
      setRuleData((prev) => [...prev, newRule])
      toast.success('规则创建成功')
    } else {
      setRuleData((prev) =>
        prev.map((r) =>
          r.id === formData.id
            ? {
                ...r,
                name: formData.name,
                category: formData.category,
                triggerCondition: formData.triggerCondition,
                severity: formData.severity,
                status: formData.status,
                owner: formData.owner,
                version: formData.version,
                scope: formData.scope,
                enabled: formData.enabled,
              }
            : r,
        ),
      )
      toast.success('规则更新成功')
    }
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
        size: 160,
        cell: ({ row }) => {
          const rule = row.original
          return (
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleViewVersions(rule)}
                    >
                      <GitBranch className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>版本管理</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEdit(rule)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>编辑规则</TooltipContent>
                </Tooltip>
              </TooltipProvider>

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

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-red-500"
                      onClick={() => handleDelete(rule)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>删除规则</TooltipContent>
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">规则中心</h1>
          <p className="mt-1 text-sm text-gray-500">
            配置和管理各类风险规则与审批策略
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          新建规则
        </Button>
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

      {/* Edit Dialog */}
      <RuleEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingRule}
        onSave={handleSave}
        mode={dialogMode}
      />
      {/* Version Control Dialog */}
      <Dialog open={versionDialogOpen} onOpenChange={setVersionDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>版本管理</DialogTitle>
            <DialogDescription>
              {selectedRuleForVersion?.name} ({selectedRuleForVersion?.id})
            </DialogDescription>
          </DialogHeader>
          {selectedRuleForVersion && (
            <VersionControl
              ruleId={selectedRuleForVersion.id}
              ruleName={selectedRuleForVersion.name}
              onPublish={(_versionId, config) => {
                toast.success('版本发布成功', {
                  description: config?.enabled
                    ? `灰度发布至 ${config.scope.length} 个组织`
                    : '全量发布',
                })
              }}
              onRollback={(_versionId) => {
                toast.success('版本回滚成功')
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
