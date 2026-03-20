import { Plus, Trash2, FolderPlus } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LogicOperator = 'AND' | 'OR'

export type ComparisonOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'contains'
  | 'not_contains'
  | 'in'
  | 'not_in'

export interface ConditionItem {
  id: string
  field: string
  operator: ComparisonOperator
  value: string
}

export interface ConditionGroup {
  id: string
  logic: LogicOperator
  conditions: ConditionItem[]
  children: ConditionGroup[]
}

export interface ThresholdConfig {
  /** Minimum number of times the condition must be met */
  minOccurrences: number
  /** Time window in hours */
  timeWindowHours: number
  /** Cooldown period in minutes before re-triggering */
  cooldownMinutes: number
}

export interface ConditionEditorProps {
  /** Root condition group */
  value: ConditionGroup
  /** Change callback */
  onChange: (group: ConditionGroup) => void
  /** Threshold configuration */
  threshold?: ThresholdConfig
  /** Threshold change callback */
  onThresholdChange?: (threshold: ThresholdConfig) => void
  /** Max nesting depth (default 2) */
  maxDepth?: number
  /** Available field options */
  fieldOptions?: { label: string; value: string }[]
  /** Read-only mode */
  readOnly?: boolean
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const operatorLabels: Record<ComparisonOperator, string> = {
  eq: '等于',
  neq: '不等于',
  gt: '大于',
  gte: '大于等于',
  lt: '小于',
  lte: '小于等于',
  contains: '包含',
  not_contains: '不包含',
  in: '属于',
  not_in: '不属于',
}

const defaultFieldOptions = [
  { label: '采购金额', value: 'purchase_amount' },
  { label: '供应商评分', value: 'supplier_score' },
  { label: '交期偏差(天)', value: 'delivery_deviation' },
  { label: '不合格率(%)', value: 'defect_rate' },
  { label: '库存水位', value: 'inventory_level' },
  { label: '合同到期天数', value: 'contract_expiry_days' },
  { label: '需求偏差(%)', value: 'demand_deviation' },
  { label: '物料类别', value: 'material_category' },
  { label: '供应商等级', value: 'supplier_tier' },
  { label: '风险类型', value: 'risk_type' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let _idCounter = 0
function nextId(prefix: string) {
  return `${prefix}-${Date.now()}-${++_idCounter}`
}

function createConditionItem(): ConditionItem {
  return {
    id: nextId('cond'),
    field: '',
    operator: 'eq',
    value: '',
  }
}

function createConditionGroup(): ConditionGroup {
  return {
    id: nextId('group'),
    logic: 'AND',
    conditions: [createConditionItem()],
    children: [],
  }
}

// ---------------------------------------------------------------------------
// ConditionRow
// ---------------------------------------------------------------------------

function ConditionRow({
  condition,
  fieldOptions,
  readOnly,
  onChange,
  onRemove,
}: {
  condition: ConditionItem
  fieldOptions: { label: string; value: string }[]
  readOnly?: boolean
  onChange: (item: ConditionItem) => void
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={condition.field || undefined}
        onValueChange={(v) => onChange({ ...condition, field: v })}
        disabled={readOnly}
      >
        <SelectTrigger className="h-8 w-[150px]">
          <SelectValue placeholder="选择字段" />
        </SelectTrigger>
        <SelectContent>
          {fieldOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={condition.operator}
        onValueChange={(v) =>
          onChange({ ...condition, operator: v as ComparisonOperator })
        }
        disabled={readOnly}
      >
        <SelectTrigger className="h-8 w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(operatorLabels).map(([val, label]) => (
            <SelectItem key={val} value={val}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="输入值"
        value={condition.value}
        onChange={(e) => onChange({ ...condition, value: e.target.value })}
        className="h-8 w-[160px]"
        disabled={readOnly}
      />

      {!readOnly && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 hover:text-red-500"
          onClick={onRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// GroupBlock
// ---------------------------------------------------------------------------

function GroupBlock({
  group,
  depth,
  maxDepth,
  fieldOptions,
  readOnly,
  onChange,
  onRemove,
}: {
  group: ConditionGroup
  depth: number
  maxDepth: number
  fieldOptions: { label: string; value: string }[]
  readOnly?: boolean
  onChange: (group: ConditionGroup) => void
  onRemove?: () => void
}) {
  const canNest = depth < maxDepth

  const toggleLogic = () => {
    onChange({ ...group, logic: group.logic === 'AND' ? 'OR' : 'AND' })
  }

  const updateCondition = (idx: number, item: ConditionItem) => {
    const next = [...group.conditions]
    next[idx] = item
    onChange({ ...group, conditions: next })
  }

  const removeCondition = (idx: number) => {
    const next = group.conditions.filter((_, i) => i !== idx)
    onChange({ ...group, conditions: next })
  }

  const addCondition = () => {
    onChange({
      ...group,
      conditions: [...group.conditions, createConditionItem()],
    })
  }

  const addChildGroup = () => {
    onChange({
      ...group,
      children: [...group.children, createConditionGroup()],
    })
  }

  const updateChild = (idx: number, child: ConditionGroup) => {
    const next = [...group.children]
    next[idx] = child
    onChange({ ...group, children: next })
  }

  const removeChild = (idx: number) => {
    const next = group.children.filter((_, i) => i !== idx)
    onChange({ ...group, children: next })
  }

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        depth === 0
          ? 'border-gray-200 bg-gray-50/50'
          : 'border-dashed border-blue-200 bg-blue-50/30',
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        {/* Logic toggle */}
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-7 px-3 text-xs font-semibold',
            group.logic === 'AND'
              ? 'border-blue-300 bg-blue-50 text-blue-700'
              : 'border-orange-300 bg-orange-50 text-orange-700',
          )}
          onClick={toggleLogic}
          disabled={readOnly}
        >
          {group.logic === 'AND' ? '且 (AND)' : '或 (OR)'}
        </Button>

        <span className="text-xs text-gray-400">
          满足以下
          {group.logic === 'AND' ? '所有' : '任一'}
          条件
        </span>

        {/* Remove group button */}
        {onRemove && !readOnly && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-7 w-7 text-gray-400 hover:text-red-500"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Condition rows */}
      <div className="space-y-2">
        {group.conditions.map((cond, idx) => (
          <ConditionRow
            key={cond.id}
            condition={cond}
            fieldOptions={fieldOptions}
            readOnly={readOnly}
            onChange={(item) => updateCondition(idx, item)}
            onRemove={() => removeCondition(idx)}
          />
        ))}
      </div>

      {/* Nested groups */}
      {group.children.length > 0 && (
        <div className="mt-3 space-y-3 pl-4">
          {group.children.map((child, idx) => (
            <GroupBlock
              key={child.id}
              group={child}
              depth={depth + 1}
              maxDepth={maxDepth}
              fieldOptions={fieldOptions}
              readOnly={readOnly}
              onChange={(g) => updateChild(idx, g)}
              onRemove={() => removeChild(idx)}
            />
          ))}
        </div>
      )}

      {/* Action buttons */}
      {!readOnly && (
        <div className="mt-3 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={addCondition}
          >
            <Plus className="h-3 w-3" />
            添加条件
          </Button>
          {canNest && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={addChildGroup}
            >
              <FolderPlus className="h-3 w-3" />
              添加条件组
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ThresholdSection
// ---------------------------------------------------------------------------

function ThresholdSection({
  threshold,
  onChange,
  readOnly,
}: {
  threshold: ThresholdConfig
  onChange: (t: ThresholdConfig) => void
  readOnly?: boolean
}) {
  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
      <h4 className="mb-3 text-sm font-semibold text-gray-900">
        阈值配置
      </h4>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-500">
            最少触发次数
          </Label>
          <Input
            type="number"
            min={1}
            value={threshold.minOccurrences}
            onChange={(e) =>
              onChange({
                ...threshold,
                minOccurrences: Number(e.target.value) || 1,
              })
            }
            className="h-8"
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-500">
            时间窗口（小时）
          </Label>
          <Input
            type="number"
            min={1}
            value={threshold.timeWindowHours}
            onChange={(e) =>
              onChange({
                ...threshold,
                timeWindowHours: Number(e.target.value) || 1,
              })
            }
            className="h-8"
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-500">
            冷却时间（分钟）
          </Label>
          <Input
            type="number"
            min={0}
            value={threshold.cooldownMinutes}
            onChange={(e) =>
              onChange({
                ...threshold,
                cooldownMinutes: Number(e.target.value) || 0,
              })
            }
            className="h-8"
            disabled={readOnly}
          />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ConditionEditor (main export)
// ---------------------------------------------------------------------------

export function ConditionEditor({
  value,
  onChange,
  threshold,
  onThresholdChange,
  maxDepth = 2,
  fieldOptions = defaultFieldOptions,
  readOnly = false,
}: ConditionEditorProps) {
  return (
    <div className="space-y-4">
      <GroupBlock
        group={value}
        depth={0}
        maxDepth={maxDepth}
        fieldOptions={fieldOptions}
        readOnly={readOnly}
        onChange={onChange}
      />

      {threshold && onThresholdChange && (
        <ThresholdSection
          threshold={threshold}
          onChange={onThresholdChange}
          readOnly={readOnly}
        />
      )}
    </div>
  )
}

/** Convenience: create a default root group */
ConditionEditor.createDefaultGroup = createConditionGroup

/** Convenience: default threshold */
ConditionEditor.defaultThreshold = {
  minOccurrences: 1,
  timeWindowHours: 24,
  cooldownMinutes: 60,
} as ThresholdConfig
