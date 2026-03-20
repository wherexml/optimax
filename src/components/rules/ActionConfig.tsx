import { useState } from 'react'
import {
  MessageSquare,
  ClipboardList,
  GitPullRequest,
  FileWarning,
  ShieldBan,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

export type ActionType =
  | 'send_message'
  | 'create_todo'
  | 'start_approval'
  | 'auto_case'
  | 'block_flow'

export interface ActionItem {
  id: string
  type: ActionType
  enabled: boolean
  config: ActionItemConfig
}

export interface ActionItemConfig {
  /** Recipient list */
  recipients?: string[]
  /** Message template content */
  messageTemplate?: string
  /** Priority */
  priority?: 'high' | 'normal' | 'low'
  /** Additional note */
  note?: string
}

export interface ActionConfigProps {
  /** Current action list */
  value: ActionItem[]
  /** Change callback */
  onChange: (items: ActionItem[]) => void
  /** Read-only mode */
  readOnly?: boolean
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const actionTypeConfig: Record<
  ActionType,
  { label: string; icon: React.ElementType; description: string }
> = {
  send_message: {
    label: '发送消息',
    icon: MessageSquare,
    description: '向指定人员发送通知消息',
  },
  create_todo: {
    label: '创建待办',
    icon: ClipboardList,
    description: '自动创建待处理任务',
  },
  start_approval: {
    label: '发起审批',
    icon: GitPullRequest,
    description: '发起审批流程，等待审批结果',
  },
  auto_case: {
    label: '自动建案',
    icon: FileWarning,
    description: '自动创建风险案件并分配负责人',
  },
  block_flow: {
    label: '阻断流程',
    icon: ShieldBan,
    description: '阻断当前业务流程直至风险解除',
  },
}

const recipientOptions = [
  { label: '张伟 (采购总监)', value: 'user-zhangwei' },
  { label: '李明 (风控经理)', value: 'user-liming' },
  { label: '王芳 (供应链主管)', value: 'user-wangfang' },
  { label: '赵强 (采购经理)', value: 'user-zhaoqiang' },
  { label: '陈静 (质量主管)', value: 'user-chenjing' },
  { label: '刘洋 (生产经理)', value: 'user-liuyang' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let _counter = 0
function nextId() {
  return `action-${Date.now()}-${++_counter}`
}

function createAction(type: ActionType): ActionItem {
  return {
    id: nextId(),
    type,
    enabled: true,
    config: {
      recipients: [],
      messageTemplate: '',
      priority: 'normal',
      note: '',
    },
  }
}

// ---------------------------------------------------------------------------
// ActionDetailForm
// ---------------------------------------------------------------------------

function ActionDetailForm({
  item,
  readOnly,
  onChange,
}: {
  item: ActionItem
  readOnly?: boolean
  onChange: (item: ActionItem) => void
}) {
  const updateConfig = (patch: Partial<ActionItemConfig>) => {
    onChange({ ...item, config: { ...item.config, ...patch } })
  }

  return (
    <div className="space-y-3 pt-2">
      {/* Recipients */}
      <div className="space-y-1.5">
        <Label className="text-xs text-gray-500">接收人</Label>
        <Select
          value={item.config.recipients?.[0] ?? ''}
          onValueChange={(v) => {
            const current = item.config.recipients ?? []
            if (!current.includes(v)) {
              updateConfig({ recipients: [...current, v] })
            }
          }}
          disabled={readOnly}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="选择接收人" />
          </SelectTrigger>
          <SelectContent>
            {recipientOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(item.config.recipients ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.config.recipients!.map((rid) => {
              const opt = recipientOptions.find((o) => o.value === rid)
              return (
                <span
                  key={rid}
                  className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                >
                  {opt?.label ?? rid}
                  {!readOnly && (
                    <button
                      type="button"
                      className="hover:text-red-500"
                      onClick={() =>
                        updateConfig({
                          recipients: item.config.recipients!.filter(
                            (r) => r !== rid,
                          ),
                        })
                      }
                    >
                      &times;
                    </button>
                  )}
                </span>
              )
            })}
          </div>
        )}
      </div>

      {/* Message template */}
      <div className="space-y-1.5">
        <Label className="text-xs text-gray-500">消息模板</Label>
        <Textarea
          placeholder="输入消息模板内容，支持 {{变量}} 占位符..."
          value={item.config.messageTemplate ?? ''}
          onChange={(e) =>
            updateConfig({ messageTemplate: e.target.value })
          }
          className="min-h-[60px] text-sm"
          disabled={readOnly}
        />
      </div>

      {/* Priority */}
      <div className="space-y-1.5">
        <Label className="text-xs text-gray-500">优先级</Label>
        <Select
          value={item.config.priority ?? 'normal'}
          onValueChange={(v) =>
            updateConfig({
              priority: v as 'high' | 'normal' | 'low',
            })
          }
          disabled={readOnly}
        >
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">高</SelectItem>
            <SelectItem value="normal">中</SelectItem>
            <SelectItem value="low">低</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ActionRow
// ---------------------------------------------------------------------------

function ActionRow({
  item,
  index,
  total,
  readOnly,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  item: ActionItem
  index: number
  total: number
  readOnly?: boolean
  onChange: (item: ActionItem) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const cfg = actionTypeConfig[item.type]
  const Icon = cfg.icon

  return (
    <div
      className={cn(
        'rounded-lg border',
        item.enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60',
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Checkbox
          checked={item.enabled}
          onCheckedChange={(checked) =>
            onChange({ ...item, enabled: !!checked })
          }
          disabled={readOnly}
        />
        <Icon className="h-4 w-4 text-gray-500" />
        <div className="flex-1">
          <span className="text-sm font-medium text-gray-900">
            {cfg.label}
          </span>
          <span className="ml-2 text-xs text-gray-400">
            {cfg.description}
          </span>
        </div>

        {/* Sort buttons */}
        {!readOnly && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              disabled={index === 0}
              onClick={onMoveUp}
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              disabled={index === total - 1}
              onClick={onMoveDown}
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-red-500"
              onClick={onRemove}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Expand/collapse */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      {/* Detail form */}
      {expanded && (
        <div className="border-t px-4 pb-4 pt-2">
          <ActionDetailForm
            item={item}
            readOnly={readOnly}
            onChange={onChange}
          />
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ActionConfig (main export)
// ---------------------------------------------------------------------------

export function ActionConfig({
  value,
  onChange,
  readOnly = false,
}: ActionConfigProps) {
  const existingTypes = new Set(value.map((a) => a.type))

  const availableTypes = (
    Object.keys(actionTypeConfig) as ActionType[]
  ).filter((t) => !existingTypes.has(t))

  const moveUp = (idx: number) => {
    if (idx === 0) return
    const next = [...value]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    onChange(next)
  }

  const moveDown = (idx: number) => {
    if (idx === value.length - 1) return
    const next = [...value]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    onChange(next)
  }

  const updateItem = (idx: number, item: ActionItem) => {
    const next = [...value]
    next[idx] = item
    onChange(next)
  }

  const removeItem = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx))
  }

  const addAction = (type: ActionType) => {
    onChange([...value, createAction(type)])
  }

  return (
    <div className="space-y-3">
      {/* Action list */}
      {value.map((item, idx) => (
        <ActionRow
          key={item.id}
          item={item}
          index={idx}
          total={value.length}
          readOnly={readOnly}
          onChange={(a) => updateItem(idx, a)}
          onRemove={() => removeItem(idx)}
          onMoveUp={() => moveUp(idx)}
          onMoveDown={() => moveDown(idx)}
        />
      ))}

      {/* Add action dropdown */}
      {!readOnly && availableTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {availableTypes.map((type) => {
            const cfg = actionTypeConfig[type]
            const Icon = cfg.icon
            return (
              <Button
                key={type}
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => addAction(type)}
              >
                <Plus className="h-3 w-3" />
                <Icon className="h-3.5 w-3.5" />
                {cfg.label}
              </Button>
            )
          })}
        </div>
      )}

      {value.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center text-sm text-gray-400">
          暂未配置触发动作，请点击上方按钮添加
        </div>
      )}
    </div>
  )
}

/** Convenience: create a default action item */
ActionConfig.createAction = createAction
