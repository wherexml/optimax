/**
 * War Room - Meeting Minutes Component
 *
 * FE-073: 会议纪要与附件上传
 * - 会议纪要列表（时间倒序）
 * - 新增纪要：富文本编辑器（简化版，markdown 支持）
 * - AI 初稿标识 + 人工修订版本对比
 * - 附件上传区域（拖拽上传 mock）
 * - 附件列表（文件名、大小、上传者、时间）
 */

import { useState, useCallback } from 'react'
import {
  FileText,
  Plus,
  Upload,
  Download,
  History,
  Sparkles,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  FileImage,
  File as FileDoc,
  MoreHorizontal,
  Edit3,
  Trash2,
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import type { MeetingMinute, Attachment } from '@/types/solution'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { formatFileSize, getFileIcon } from '@/mocks/data/minutes'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MeetingMinutesProps {
  minutes: MeetingMinute[]
  attachments: Attachment[]
  caseId: string
  onMinuteCreate?: (minute: { title: string; content: string }) => void
  onMinuteUpdate?: (minuteId: string, content: string) => void
  onAttachmentUpload?: (files: File[]) => void
  onAttachmentDelete?: (attachmentId: string) => void
  className?: string
}

// ---------------------------------------------------------------------------
// File Icon Component
// ---------------------------------------------------------------------------

function FileTypeIcon({ fileType, className }: { fileType: string; className?: string }) {
  const iconType = getFileIcon(fileType)

  switch (iconType) {
    case 'pdf':
      return <FileText className={cn('text-red-500', className)} />
    case 'word':
      return <FileDoc className={cn('text-blue-500', className)} />
    case 'excel':
      return <FileSpreadsheet className={cn('text-green-500', className)} />
    case 'ppt':
      return <FileText className={cn('text-orange-500', className)} />
    case 'image':
      return <FileImage className={cn('text-purple-500', className)} />
    default:
      return <FileDoc className={cn('text-gray-500', className)} />
  }
}

// ---------------------------------------------------------------------------
// Attachment Item
// ---------------------------------------------------------------------------

function AttachmentItem({
  attachment,
  onDelete,
}: {
  attachment: Attachment
  onDelete?: () => void
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-colors">
      <div className="flex items-center justify-center h-10 w-10 rounded bg-white shadow-sm">
        <FileTypeIcon fileType={attachment.file_type} className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{attachment.file_name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatFileSize(attachment.file_size)}</span>
          <span>·</span>
          <span>{attachment.uploaded_by.name}</span>
          <span>·</span>
          <span>
            {formatDistanceToNow(new Date(attachment.uploaded_at), {
              addSuffix: true,
              locale: zhCN,
            })}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Download className="h-4 w-4" />
        </Button>
        {onDelete && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Upload Area
// ---------------------------------------------------------------------------

function UploadArea({ onUpload }: { onUpload: (files: File[]) => void }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        onUpload(files)
      }
    },
    [onUpload]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : []
      if (files.length > 0) {
        onUpload(files)
      }
    },
    [onUpload]
  )

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      )}
    >
      <input
        type="file"
        multiple
        className="hidden"
        id="file-upload"
        onChange={handleFileInput}
      />
      <label htmlFor="file-upload" className="cursor-pointer block">
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">点击或拖拽文件到此处上传</p>
        <p className="text-xs text-muted-foreground">支持 PDF、Word、Excel、图片等格式</p>
      </label>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Revision History Dialog
// ---------------------------------------------------------------------------

function RevisionHistoryDialog({
  minute,
  open,
  onOpenChange,
}: {
  minute: MeetingMinute | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!minute || !minute.revision_history) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>修订历史</DialogTitle>
          <DialogDescription>{minute.title}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[500px]">
          <div className="space-y-4">
            {minute.revision_history.map((revision, idx) => (
              <div key={revision.revision_id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">版本 {revision.version}</Badge>
                    <span className="text-sm font-medium">{revision.revised_by.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(revision.revised_at), 'yyyy-MM-dd HH:mm', {
                      locale: zhCN,
                    })}
                  </span>
                </div>
                {revision.comment && (
                  <p className="text-sm text-muted-foreground mb-2">{revision.comment}</p>
                )}
                {idx < minute.revision_history!.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Minute Editor Dialog
// ---------------------------------------------------------------------------

function MinuteEditorDialog({
  open,
  onOpenChange,
  onSave,
  initialData,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: { title: string; content: string }) => void
  initialData?: { title: string; content: string }
}) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const isEditing = !!initialData

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('请填写标题和内容')
      return
    }
    onSave({ title, content })
    onOpenChange(false)
    if (!isEditing) {
      setTitle('')
      setContent('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditing ? '编辑会议纪要' : '新建会议纪要'}</DialogTitle>
          <DialogDescription>
            支持 Markdown 格式，使用 # 表示标题，- 表示列表
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>标题</Label>
            <Input
              placeholder="输入会议纪要标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>内容</Label>
            <Textarea
              placeholder={`## 会议主题

**会议时间**:
**参会人员**:

### 讨论内容
1.
2.

### 决议事项
-

### 下一步行动
- `}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>
            <FileText className="h-4 w-4 mr-1" />
            {isEditing ? '保存修改' : '创建纪要'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Minute Card
// ---------------------------------------------------------------------------

function MinuteCard({
  minute,
  attachments,
  onEdit,
  onViewHistory,
}: {
  minute: MeetingMinute
  attachments: Attachment[]
  onEdit: () => void
  onViewHistory: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  // Simple markdown renderer
  const renderContent = (content: string) => {
    const lines = content.split('\n')
    return lines.map((line, idx) => {
      // Heading
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-lg font-semibold mt-4 mb-2">
            {line.replace('## ', '')}
          </h3>
        )
      }
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-base font-medium mt-3 mb-1">
            {line.replace('### ', '')}
          </h4>
        )
      }
      // List item
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 text-sm text-foreground">
            {line.substring(2)}
          </li>
        )
      }
      if (line.startsWith('1. ') || line.startsWith('2. ')) {
        return (
          <li key={idx} className="ml-4 text-sm text-foreground">
            {line.substring(3)}
          </li>
        )
      }
      // Bold
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <p key={idx} className="text-sm my-1">
            {parts.map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="font-medium">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        )
      }
      // Empty line
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />
      }
      // Table
      if (line.startsWith('|')) {
        return (
          <div key={idx} className="text-sm font-mono bg-slate-50 p-1 my-1 overflow-x-auto">
            {line}
          </div>
        )
      }
      // Regular paragraph
      return (
        <p key={idx} className="text-sm text-foreground my-1">
          {line}
        </p>
      )
    })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-base">{minute.title}</CardTitle>
              {minute.is_ai_draft && (
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI 初稿
                </Badge>
              )}
              {minute.version > 1 && (
                <Badge variant="outline" className="text-xs">
                  版本 {minute.version}
                </Badge>
              )}
            </div>
            <CardDescription className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {minute.author.name}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(minute.created_at), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </span>
              {minute.updated_at !== minute.created_at && (
                <span className="text-xs text-muted-foreground">
                  (已编辑)
                </span>
              )}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit3 className="h-4 w-4 mr-2" />
                编辑
              </DropdownMenuItem>
              {minute.revision_history && minute.revision_history.length > 0 && (
                <DropdownMenuItem onClick={onViewHistory}>
                  <History className="h-4 w-4 mr-2" />
                  修订历史
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn('prose prose-sm max-w-none', !expanded && 'max-h-40 overflow-hidden')}
          style={{ position: 'relative' }}>
          {renderContent(minute.content)}
          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>
        {minute.content.split('\n').length > 10 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                收起
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                展开全部
              </>
            )}
          </button>
        )}

        {/* Attachments for this minute */}
        {attachments.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">附件 ({attachments.length})</h4>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <AttachmentItem
                  key={attachment.attachment_id}
                  attachment={attachment}
                  onDelete={() => {}}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function MeetingMinutes({
  minutes,
  attachments,
  caseId: _caseId,
  onMinuteCreate,
  onMinuteUpdate,
  onAttachmentUpload,
  onAttachmentDelete,
  className,
}: MeetingMinutesProps) {
  const [editorOpen, setEditorOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [selectedMinute, setSelectedMinute] = useState<MeetingMinute | null>(null)
  const [editData, setEditData] = useState<{ title: string; content: string } | undefined>(
    undefined
  )

  const caseAttachments = attachments.filter((a) => !a.minute_id)

  const handleCreate = (data: { title: string; content: string }) => {
    onMinuteCreate?.(data)
    toast.success('会议纪要已创建')
  }

  const handleEdit = (minute: MeetingMinute) => {
    setEditData({ title: minute.title, content: minute.content })
    setSelectedMinute(minute)
    setEditorOpen(true)
  }

  const handleUpdate = (data: { title: string; content: string }) => {
    if (selectedMinute) {
      onMinuteUpdate?.(selectedMinute.minute_id, data.content)
      toast.success('会议纪要已更新')
      setEditData(undefined)
      setSelectedMinute(null)
    }
  }

  const handleUpload = (files: File[]) => {
    onAttachmentUpload?.(files)
    toast.success(`已上传 ${files.length} 个文件`)
  }

  const handleViewHistory = (minute: MeetingMinute) => {
    setSelectedMinute(minute)
    setHistoryOpen(true)
  }

  return (
    <div className={cn('h-full flex flex-col', className)}>
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                会议纪要
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                共 {minutes.length} 条纪要，{attachments.length} 个附件
              </p>
            </div>
            <Button onClick={() => {
              setEditData(undefined)
              setSelectedMinute(null)
              setEditorOpen(true)
            }}>
              <Plus className="h-4 w-4 mr-1" />
              新建纪要
            </Button>
          </div>

          {/* Upload Area */}
          <UploadArea onUpload={handleUpload} />

          {/* Case-level Attachments */}
          {caseAttachments.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Case 附件 ({caseAttachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {caseAttachments.map((attachment) => (
                    <AttachmentItem
                      key={attachment.attachment_id}
                      attachment={attachment}
                      onDelete={() => onAttachmentDelete?.(attachment.attachment_id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Minutes List */}
          <div className="space-y-4">
            {minutes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>暂无会议纪要</p>
                <p className="text-sm">点击上方按钮创建新纪要</p>
              </div>
            ) : (
              minutes.map((minute) => (
                <MinuteCard
                  key={minute.minute_id}
                  minute={minute}
                  attachments={attachments.filter((a) => a.minute_id === minute.minute_id)}
                  onEdit={() => handleEdit(minute)}
                  onViewHistory={() => handleViewHistory(minute)}
                />
              ))
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Editor Dialog */}
      <MinuteEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSave={editData ? handleUpdate : handleCreate}
        initialData={editData}
      />

      {/* History Dialog */}
      <RevisionHistoryDialog
        minute={selectedMinute}
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />
    </div>
  )
}
