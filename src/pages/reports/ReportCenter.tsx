/**
 * Report Center Page
 * FE-080~082: Template Library, Report Editor, Publish & Archive
 */

import { useState, useCallback } from 'react'
import {
  FileText,
  Plus,
  Clock,
  ChevronRight,
  FolderOpen,
  Edit3,
  MoreHorizontal,
  Trash2,
  Copy,
  Eye,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

import { TemplateLibrary } from '@/components/reports/TemplateLibrary'
import { ReportEditor } from '@/components/reports/ReportEditor'
import type {
  ReportTemplate,
  ReportDraft,
} from '@/mocks/data/reports'
import {
  reportTemplates,
  reportDrafts,
  publishedReports,
} from '@/mocks/data/reports'
import type { PublishConfig } from '@/components/reports/ReportEditor'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ViewMode = 'templates' | 'editor' | 'drafts'

// ---------------------------------------------------------------------------
// Helper Components
// ---------------------------------------------------------------------------

function DraftCard({
  draft,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  draft: ReportDraft
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  const typeLabels: Record<string, string> = {
    daily: '日报',
    weekly: '周报',
    monthly: '月报',
    special: '专题',
    retrospective: '复盘',
  }

  const typeColors: Record<string, string> = {
    daily: 'bg-blue-100 text-blue-800',
    weekly: 'bg-emerald-100 text-emerald-800',
    monthly: 'bg-violet-100 text-violet-800',
    special: 'bg-amber-100 text-amber-800',
    retrospective: 'bg-rose-100 text-rose-800',
  }

  return (
    <Card className="group cursor-pointer hover:shadow-md transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant="secondary"
                className={typeColors[draft.type] || 'bg-gray-100 text-gray-800'}
              >
                {typeLabels[draft.type] || draft.type}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {draft.status === 'editing' ? '编辑中' : '草稿'}
              </Badge>
            </div>
            <h4 className="font-medium text-sm line-clamp-1">{draft.title}</h4>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit3 className="mr-2 h-4 w-4" />
                继续编辑
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                复制
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{draft.content.length} 个数据块</span>
          <span>更新于 {new Date(draft.updatedAt).toLocaleDateString('zh-CN')}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="secondary" className="flex-1" onClick={onEdit}>
            <Edit3 className="mr-1.5 h-3.5 w-3.5" />
            编辑
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentReportCard({
  report,
  onView,
}: {
  report: (typeof publishedReports)[0]
  onView: () => void
}) {
  const typeLabels: Record<string, string> = {
    daily: '日报',
    weekly: '周报',
    monthly: '月报',
    special: '专题',
    retrospective: '复盘',
  }

  return (
    <div
      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted cursor-pointer transition-colors"
      onClick={onView}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{report.title}</p>
          <p className="text-xs text-muted-foreground">
            {typeLabels[report.type]} · {new Date(report.publishedAt).toLocaleDateString('zh-CN')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Eye className="h-3 w-3" />
        {report.readCount}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function ReportCenter() {
  const [viewMode, setViewMode] = useState<ViewMode>('templates')
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | undefined>()
  const [editingDraft, setEditingDraft] = useState<ReportDraft | undefined>()
  const [drafts, setDrafts] = useState<ReportDraft[]>(reportDrafts)

  // Handle template selection
  const handleSelectTemplate = useCallback((template: ReportTemplate) => {
    setSelectedTemplate(template)
    // Create a new draft from template
    const newDraft: ReportDraft = {
      id: `draft-${Date.now()}`,
      title: `${template.name}（草稿）`,
      templateId: template.id,
      type: template.type as ReportDraft['type'],
      status: 'draft',
      content: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '当前用户',
    }
    setEditingDraft(newDraft)
    setViewMode('editor')
    toast.success(`已基于「${template.name}」创建草稿`)
  }, [])

  // Handle draft edit
  const handleEditDraft = useCallback((draft: ReportDraft) => {
    const template = reportTemplates.find((t) => t.id === draft.templateId)
    setSelectedTemplate(template)
    setEditingDraft(draft)
    setViewMode('editor')
  }, [])

  // Handle draft save
  const handleSaveDraft = useCallback((draft: ReportDraft) => {
    setDrafts((prev) => {
      const existing = prev.find((d) => d.id === draft.id)
      if (existing) {
        return prev.map((d) => (d.id === draft.id ? draft : d))
      }
      return [...prev, draft]
    })
  }, [])

  // Handle draft publish
  const handlePublishDraft = useCallback(
    (draft: ReportDraft, config: PublishConfig) => {
      handleSaveDraft(draft)
      // In real app, this would publish the report
      console.log('Publishing with config:', config)
      setViewMode('templates')
    },
    [handleSaveDraft]
  )

  // Handle draft delete
  const handleDeleteDraft = useCallback((draftId: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== draftId))
    toast.success('草稿已删除')
  }, [])

  // Handle duplicate draft
  const handleDuplicateDraft = useCallback((draft: ReportDraft) => {
    const newDraft: ReportDraft = {
      ...draft,
      id: `draft-${Date.now()}`,
      title: `${draft.title}（副本）`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setDrafts((prev) => [...prev, newDraft])
    toast.success('草稿已复制')
  }, [])

  // Handle new blank report
  const handleNewReport = useCallback(() => {
    const newDraft: ReportDraft = {
      id: `draft-${Date.now()}`,
      title: '新建报告',
      type: 'special',
      status: 'draft',
      content: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '当前用户',
    }
    setSelectedTemplate(undefined)
    setEditingDraft(newDraft)
    setViewMode('editor')
  }, [])

  return (
    <div className="h-full p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">报告中心</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              创建、管理和发布风险运营报告
            </p>
          </div>
          <div className="flex items-center gap-2">
            {viewMode === 'editor' && (
              <Button variant="outline" onClick={() => setViewMode('templates')}>
                返回模板库
              </Button>
            )}
            <Button onClick={handleNewReport}>
              <Plus className="mr-1.5 h-4 w-4" />
              新建报告
            </Button>
          </div>
        </div>

        {/* View Tabs */}
        {viewMode !== 'editor' && (
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
            className="mt-4"
          >
            <TabsList>
              <TabsTrigger value="templates">
                <FolderOpen className="mr-1.5 h-4 w-4" />
                模板库
              </TabsTrigger>
              <TabsTrigger value="drafts">
                <Edit3 className="mr-1.5 h-4 w-4" />
                我的草稿
                {drafts.length > 0 && (
                  <Badge variant="secondary" className="ml-1.5">
                    {drafts.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      {/* Main Content */}
      {viewMode === 'templates' && (
        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Template Library */}
          <div className="flex-1">
            <TemplateLibrary
              onSelectTemplate={handleSelectTemplate}
              selectedTemplateId={selectedTemplate?.id}
            />
          </div>

          {/* Right Sidebar - Recent Reports */}
          <div className="w-80 flex-shrink-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  最近发布
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  {publishedReports.slice(0, 5).map((report) => (
                    <RecentReportCard
                      key={report.id}
                      report={report}
                      onView={() => toast.success('查看报告', { description: report.title })}
                    />
                  ))}
                </div>
                <Separator className="my-3" />
                <Button variant="ghost" size="sm" className="w-full">
                  查看全部
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">报告统计</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{publishedReports.length}</div>
                    <div className="text-xs text-muted-foreground">已发布</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{drafts.length}</div>
                    <div className="text-xs text-muted-foreground">草稿</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {publishedReports.reduce((sum, r) => sum + r.readCount, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">总阅读</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{reportTemplates.length}</div>
                    <div className="text-xs text-muted-foreground">模板</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {viewMode === 'drafts' && (
        <div className="h-[calc(100vh-200px)]">
          {drafts.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {drafts.map((draft) => (
                <DraftCard
                  key={draft.id}
                  draft={draft}
                  onEdit={() => handleEditDraft(draft)}
                  onDelete={() => handleDeleteDraft(draft.id)}
                  onDuplicate={() => handleDuplicateDraft(draft)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Edit3 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">暂无草稿</h3>
              <p className="text-sm text-muted-foreground mb-4">
                从模板库选择模板开始创建报告
              </p>
              <Button onClick={() => setViewMode('templates')}>
                <FolderOpen className="mr-1.5 h-4 w-4" />
                浏览模板
              </Button>
            </div>
          )}
        </div>
      )}

      {viewMode === 'editor' && editingDraft && (
        <div className="h-[calc(100vh-180px)]">
          <ReportEditor
            template={selectedTemplate}
            draft={editingDraft}
            onSave={handleSaveDraft}
            onPublish={handlePublishDraft}
          />
        </div>
      )}
    </div>
  )
}
