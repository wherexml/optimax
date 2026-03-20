/**
 * Report Editor Component
 * FE-081: Draft editor with data blocks, text editing, map snapshot insertion, AI draft
 */

import { useState, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Sparkles,
  Save,
  FileDown,
  Type,
  BarChart3,
  Table as TableIcon,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ChevronLeft,
  Clock,
  Eye,
  FileText,
  Send,
  Loader2,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'

import { DataBlock } from './DataBlock'
import { PublishPanel } from './PublishPanel'
import type {
  ReportTemplate,
  ReportDraft,
  ReportContentBlock,
} from '@/mocks/data/reports'
import { reportRecipients } from '@/mocks/data/reports'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ReportEditorProps {
  template?: ReportTemplate
  draft?: ReportDraft
  onSave?: (draft: ReportDraft) => void
  onPublish?: (draft: ReportDraft, config: PublishConfig) => void
  className?: string
}

export interface PublishConfig {
  recipients: string[]
  channels: ('email' | 'in_app' | 'wechat' | 'dingtalk')[]
  schedule: 'immediate' | 'later'
  scheduledAt?: string
  frequency?: 'once' | 'daily' | 'weekly' | 'monthly'
}

interface BlockTypeOption {
  type: ReportContentBlock['type']
  label: string
  icon: React.ReactNode
  description: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const blockTypeOptions: BlockTypeOption[] = [
  {
    type: 'text',
    label: '文本',
    icon: <Type className="h-4 w-4" />,
    description: '富文本内容',
  },
  {
    type: 'metric',
    label: '指标卡',
    icon: <Activity className="h-4 w-4" />,
    description: '关键指标展示',
  },
  {
    type: 'chart',
    label: '图表',
    icon: <BarChart3 className="h-4 w-4" />,
    description: '趋势或分布图',
  },
  {
    type: 'table',
    label: '表格',
    icon: <TableIcon className="h-4 w-4" />,
    description: '数据表格',
  },
  {
    type: 'event_summary',
    label: '事件摘要',
    icon: <AlertTriangle className="h-4 w-4" />,
    description: '风险事件汇总',
  },
  {
    type: 'map_snapshot',
    label: '地图快照',
    icon: <MapPin className="h-4 w-4" />,
    description: '风险地图截图',
  },
  {
    type: 'case_conclusion',
    label: 'Case结论',
    icon: <CheckCircle2 className="h-4 w-4" />,
    description: '处置结论',
  },
]

// ---------------------------------------------------------------------------
// AI Draft Generator
// ---------------------------------------------------------------------------

function generateAIDraft(_type: string): ReportContentBlock[] {
  const now = new Date().toLocaleDateString('zh-CN')

  const blocks: ReportContentBlock[] = [
    {
      id: `block-${Date.now()}-1`,
      type: 'text',
      content: `# 风险运营日报\n\n报告日期：${now}\n\n## 总体概况\n\n本日系统共监测到风险事件12起，其中高危事件3起，中危事件5起，低危事件4起。已处置完成8起，剩余4起正在跟进中。整体风险态势平稳，无重大突发风险事件。`,
      order: 1,
    },
    {
      id: `block-${Date.now()}-2`,
      type: 'metric',
      content: JSON.stringify({
        newEvents: 12,
        highRisk: 3,
        resolved: 8,
        pending: 4,
      }),
      order: 2,
    },
    {
      id: `block-${Date.now()}-3`,
      type: 'text',
      content: `## 重点事件\n\n1. **泰国洪灾后续影响**：受影响供应商逐步恢复产能，预计下周完全恢复。\n2. **原材料价格波动**：铜价上涨5%，已触发预警阈值，建议关注。\n3. **新供应商准入审核**：3家新供应商完成风险评估，已纳入白名单。`,
      order: 3,
    },
    {
      id: `block-${Date.now()}-4`,
      type: 'event_summary',
      content: '[]',
      order: 4,
    },
    {
      id: `block-${Date.now()}-5`,
      type: 'text',
      content: `## 明日关注\n\n- 继续跟踪泰国洪灾恢复进度\n- 关注原材料价格走势\n- 完成季度风险评估报告准备`,
      order: 5,
    },
  ]

  return blocks
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function ReportEditor({
  template,
  draft,
  onSave,
  onPublish,
  className,
}: ReportEditorProps) {
  const navigate = useNavigate()
  const [title, setTitle] = useState(draft?.title || template?.name || '新建报告')
  const [blocks, setBlocks] = useState<ReportContentBlock[]>(
    draft?.content || []
  )
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPublishPanel, setShowPublishPanel] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId)

  // Add new block
  const handleAddBlock = useCallback((type: ReportContentBlock['type']) => {
    const newBlock: ReportContentBlock = {
      id: `block-${Date.now()}`,
      type,
      content: type === 'text' ? '' : '{}',
      order: blocks.length + 1,
    }
    setBlocks((prev) => [...prev, newBlock])
    setSelectedBlockId(newBlock.id)
    toast.success(`已添加${blockTypeOptions.find((o) => o.type === type)?.label}`)
  }, [blocks.length])

  // Remove block
  const handleRemoveBlock = useCallback((blockId: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId))
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null)
    }
    toast.success('已删除数据块')
  }, [selectedBlockId])

  // Update block content
  const handleUpdateBlock = useCallback((blockId: string, content: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, content } : b))
    )
  }, [])

  // Toggle block visibility
  const handleToggleVisibility = useCallback((blockId: string, visible: boolean) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId ? { ...b, config: { ...b.config, visible } } : b
      )
    )
  }, [])

  // Move block up/down
  const handleMoveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex((b) => b.id === blockId)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === blocks.length - 1) return

    const newBlocks = [...blocks]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]]
    setBlocks(newBlocks.map((b, i) => ({ ...b, order: i + 1 })))
  }, [blocks])

  // Generate AI draft
  const handleGenerateAI = useCallback(async () => {
    setIsGeneratingAI(true)
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const aiBlocks = generateAIDraft(template?.type || 'daily')
    setBlocks(aiBlocks)
    setIsGeneratingAI(false)
    toast.success('AI 初稿生成完成')
  }, [template?.type])

  // Save draft
  const handleSave = useCallback(async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 800))
    const updatedDraft: ReportDraft = {
      id: draft?.id || `draft-${Date.now()}`,
      title,
      templateId: template?.id,
      type: (template?.type as ReportDraft['type']) || 'daily',
      status: 'draft',
      content: blocks,
      createdAt: draft?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: draft?.createdBy || '当前用户',
    }
    onSave?.(updatedDraft)
    setLastSavedAt(new Date())
    setIsSaving(false)
    toast.success('报告已保存')
  }, [blocks, draft, onSave, template, title])

  // Export draft
  const handleExport = useCallback(() => {
    toast.success('报告导出成功', { description: '文件已保存到下载目录' })
  }, [])

  // Publish
  const handlePublish = useCallback(
    (config: PublishConfig) => {
      const updatedDraft: ReportDraft = {
        id: draft?.id || `draft-${Date.now()}`,
        title,
        templateId: template?.id,
        type: (template?.type as ReportDraft['type']) || 'daily',
        status: 'ready',
        content: blocks,
        createdAt: draft?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: draft?.createdBy || '当前用户',
      }
      onPublish?.(updatedDraft, config)
      setShowPublishPanel(false)
      toast.success('报告发布成功')
    },
    [blocks, draft, onPublish, template, title]
  )

  return (
    <div className={cn('flex h-full gap-4', className)}>
      {/* Left Sidebar - Tools */}
      <div className="w-16 flex-shrink-0">
        <div className="rounded-lg border bg-card p-2 space-y-2">
          <div className="text-xs font-medium text-center text-muted-foreground pb-1">
            插入
          </div>
          {blockTypeOptions.map((option) => (
            <Button
              key={option.type}
              variant="ghost"
              size="icon"
              className="w-full h-10"
              title={option.label}
              onClick={() => handleAddBlock(option.type)}
            >
              {option.icon}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/reports' })}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-80 text-lg font-semibold border-0 bg-transparent focus-visible:ring-0 focus-visible:bg-muted px-0"
              placeholder="报告标题"
            />
            {template && (
              <Badge variant="secondary">
                基于：{template.name}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {lastSavedAt && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                已保存 {lastSavedAt.toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateAI}
              disabled={isGeneratingAI}
            >
              {isGeneratingAI ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-1.5 h-4 w-4" />
              )}
              AI 初稿
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <FileDown className="mr-1.5 h-4 w-4" />
              导出
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-1.5 h-4 w-4" />
              )}
              保存
            </Button>
            <Button
              size="sm"
              onClick={() => setShowPublishPanel(true)}
            >
              <Send className="mr-1.5 h-4 w-4" />
              发布
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="space-y-4 pr-4">
            {blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">开始编写报告</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  点击左侧工具栏添加内容，或使用 AI 生成初稿
                </p>
                <Button onClick={handleGenerateAI} disabled={isGeneratingAI}>
                  <Sparkles className="mr-1.5 h-4 w-4" />
                  生成 AI 初稿
                </Button>
              </div>
            ) : (
              blocks
                .sort((a, b) => a.order - b.order)
                .map((block, index) => (
                  <div key={block.id} className="relative group">
                    <DataBlock
                      block={block}
                      isVisible={block.config?.visible !== false}
                      isDraggable={true}
                      isSelected={block.id === selectedBlockId}
                      onSelect={() => setSelectedBlockId(block.id)}
                      onRemove={() => handleRemoveBlock(block.id)}
                      onConfigure={() => setSelectedBlockId(block.id)}
                      onToggleVisibility={(v) => handleToggleVisibility(block.id, v)}
                      className={cn(
                        'transition-all',
                        block.id === selectedBlockId && 'ring-2 ring-primary ring-offset-2'
                      )}
                    />
                    {/* Block Actions */}
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 bg-background"
                          onClick={() => handleMoveBlock(block.id, 'up')}
                          disabled={index === 0}
                        >
                          <ChevronLeft className="h-3 w-3 -rotate-90" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 bg-background"
                          onClick={() => handleMoveBlock(block.id, 'down')}
                          disabled={index === blocks.length - 1}
                        >
                          <ChevronLeft className="h-3 w-3 rotate-90" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Sidebar - Properties Panel */}
      <div className="w-72 flex-shrink-0">
        {selectedBlock ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">数据块配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  内容编辑
                </label>
                <Textarea
                  value={selectedBlock.content}
                  onChange={(e) => handleUpdateBlock(selectedBlock.id, e.target.value)}
                  rows={10}
                  className="font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  类型
                </label>
                <Badge variant="outline">
                  {blockTypeOptions.find((o) => o.type === selectedBlock.type)?.label || selectedBlock.type}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="py-8 text-center">
              <Eye className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                选中一个数据块以编辑配置
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Publish Panel Dialog */}
      {showPublishPanel && (
        <PublishPanel
          isOpen={showPublishPanel}
          onClose={() => setShowPublishPanel(false)}
          onPublish={handlePublish}
          recipients={reportRecipients}
          reportTitle={title}
        />
      )}
    </div>
  )
}

export default ReportEditor
