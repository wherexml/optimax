/**
 * War Room - Comment Section Component
 *
 * FE-074: 评论系统
 * - 评论输入区（支持 @提及协同人）
 * - 评论列表（头像+名称+时间+内容）
 * - 回复功能
 */

import { useState, useRef } from 'react'
import {
  Send,
  Reply,
  AtSign,
  X,
  MessageSquare,
  MoreHorizontal,
  Edit3,
  Trash2,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import type { WarRoomComment } from '@/types/solution'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CommentSectionProps {
  comments: WarRoomComment[]
  caseId: string
  participants: { user_id: string; name: string; avatar?: string }[]
  onCommentCreate?: (content: string, parentId?: string, mentions?: string[]) => void
  onCommentUpdate?: (commentId: string, content: string) => void
  onCommentDelete?: (commentId: string) => void
  className?: string
}

// ---------------------------------------------------------------------------
// Mention Popup
// ---------------------------------------------------------------------------

function MentionPopup({
  query,
  participants,
  onSelect,
  position,
}: {
  query: string
  participants: { user_id: string; name: string; avatar?: string }[]
  onSelect: (user: { user_id: string; name: string }) => void
  position: { top: number; left: number }
}) {
  const filtered = participants.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  )

  if (filtered.length === 0) return null

  return (
    <div
      className="absolute z-50 bg-white border rounded-lg shadow-lg py-2 min-w-[200px] max-h-[200px] overflow-y-auto"
      style={{ top: position.top, left: position.left }}
    >
      <div className="px-3 py-1 text-xs text-muted-foreground">选择要提及的人</div>
      {filtered.map((user) => (
        <button
          key={user.user_id}
          onClick={() => onSelect(user)}
          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-left"
        >
          <Avatar className="h-6 w-6">
            {user.avatar && <AvatarImage src={user.avatar} />}
            <AvatarFallback className="text-[10px]">{user.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{user.name}</span>
        </button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Comment Input
// ---------------------------------------------------------------------------

function CommentInput({
  placeholder = '添加评论...',
  onSubmit,
  participants,
  onCancel,
  initialValue = '',
}: {
  placeholder?: string
  onSubmit: (content: string, mentions: string[]) => void
  participants: { user_id: string; name: string; avatar?: string }[]
  onCancel?: () => void
  initialValue?: string
}) {
  const [content, setContent] = useState(initialValue)
  const [showMentionPopup, setShowMentionPopup] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 })
  const [mentionedUsers, setMentionedUsers] = useState<{ user_id: string; name: string }[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setContent(value)

    // Check for @ mention
    const cursorPosition = e.target.selectionStart
    const textBeforeCursor = value.slice(0, cursorPosition)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    if (lastAtIndex !== -1 && lastAtIndex === textBeforeCursor.length - 1) {
      // User just typed @
      const rect = e.target.getBoundingClientRect()
      setMentionPosition({
        top: rect.height + 8,
        left: 0,
      })
      setMentionQuery('')
      setShowMentionPopup(true)
    } else if (lastAtIndex !== -1) {
      const query = textBeforeCursor.slice(lastAtIndex + 1)
      if (query.includes(' ')) {
        setShowMentionPopup(false)
      } else {
        setMentionQuery(query)
        setShowMentionPopup(true)
      }
    } else {
      setShowMentionPopup(false)
    }
  }

  const handleMentionSelect = (user: { user_id: string; name: string }) => {
    const cursorPosition = textareaRef.current?.selectionStart || 0
    const textBeforeCursor = content.slice(0, cursorPosition)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    if (lastAtIndex !== -1) {
      const newContent =
        content.slice(0, lastAtIndex) + `@${user.name} ` + content.slice(cursorPosition)
      setContent(newContent)
      setMentionedUsers([...mentionedUsers, user])
    }
    setShowMentionPopup(false)
    textareaRef.current?.focus()
  }

  const handleSubmit = () => {
    const trimmedContent = content.trim()
    if (!trimmedContent) return

    // Extract mentions from content
    const mentions = mentionedUsers
      .filter((user) => trimmedContent.includes(`@${user.name}`))
      .map((user) => user.user_id)

    onSubmit(trimmedContent, mentions)
    setContent('')
    setMentionedUsers([])
  }

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        placeholder={placeholder}
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="min-h-[100px] resize-none pr-12"
      />
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Ctrl+Enter 发送</span>
        {onCancel && (
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="sm"
          className="h-8 px-3"
          onClick={handleSubmit}
          disabled={!content.trim()}
        >
          <Send className="h-4 w-4 mr-1" />
          发送
        </Button>
      </div>
      {showMentionPopup && (
        <MentionPopup
          query={mentionQuery}
          participants={participants}
          onSelect={handleMentionSelect}
          position={mentionPosition}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Comment Item
// ---------------------------------------------------------------------------

function CommentItem({
  comment,
  replies,
  participants,
  onReply,
  onEdit,
  onDelete,
}: {
  comment: WarRoomComment
  replies: WarRoomComment[]
  participants: { user_id: string; name: string; avatar?: string }[]
  onReply: (content: string, mentions: string[]) => void
  onEdit: (commentId: string, content: string) => void
  onDelete: (commentId: string) => void
}) {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Parse mentions in content
  const renderContent = (content: string) => {
    const parts = content.split(/(@[^\s]+)/g)
    return parts.map((part, idx) => {
      if (part.startsWith('@')) {
        return (
          <span key={idx} className="text-blue-600 font-medium bg-blue-50 px-1 rounded">
            {part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          {comment.author.avatar && <AvatarImage src={comment.author.avatar} />}
          <AvatarFallback className="text-xs">{comment.author.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{comment.author.name}</span>
            {comment.author.role && (
              <Badge variant="secondary" className="text-[10px] h-5">
                {comment.author.role}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
                locale: zhCN,
              })}
            </span>
            {comment.updated_at !== comment.created_at && (
              <span className="text-xs text-muted-foreground">(已编辑)</span>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <Textarea
                defaultValue={comment.content}
                className="min-h-[80px] resize-none"
                onBlur={(e) => {
                  onEdit(comment.comment_id, e.target.value)
                  setIsEditing(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    onEdit(comment.comment_id, e.currentTarget.value)
                    setIsEditing(false)
                  }
                }}
                autoFocus
              />
            </div>
          ) : (
            <p className="text-sm text-foreground mt-1">{renderContent(comment.content)}</p>
          )}

          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Reply className="h-3 w-3" />
              回复
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <MoreHorizontal className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(comment.comment_id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-3">
              <CommentInput
                placeholder={`回复 ${comment.author.name}...`}
                onSubmit={(content, mentions) => {
                  onReply(content, mentions)
                  setShowReplyInput(false)
                }}
                participants={participants}
                onCancel={() => setShowReplyInput(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-11 pl-4 border-l-2 border-slate-100 space-y-4">
          {replies.map((reply) => (
            <div key={reply.comment_id} className="flex gap-3">
              <Avatar className="h-6 w-6 shrink-0">
                {reply.author.avatar && <AvatarImage src={reply.author.avatar} />}
                <AvatarFallback className="text-[10px]">
                  {reply.author.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{reply.author.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(reply.created_at), {
                      addSuffix: true,
                      locale: zhCN,
                    })}
                  </span>
                </div>
                <p className="text-sm text-foreground mt-0.5">{renderContent(reply.content)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function CommentSection({
  comments,
  caseId: _caseId,
  participants,
  onCommentCreate,
  onCommentUpdate,
  onCommentDelete,
  className,
}: CommentSectionProps) {
  const handleCreateComment = (content: string, mentions: string[], parentId?: string) => {
    onCommentCreate?.(content, parentId, mentions)
    toast.success('评论已发布')
  }

  const handleReply = (parentId: string, content: string, mentions: string[]) => {
    onCommentCreate?.(content, parentId, mentions)
    toast.success('回复已发布')
  }

  const handleEdit = (commentId: string, content: string) => {
    onCommentUpdate?.(commentId, content)
    toast.success('评论已更新')
  }

  const handleDelete = (commentId: string) => {
    onCommentDelete?.(commentId)
    toast.success('评论已删除')
  }

  return (
    <div className={cn('h-full flex flex-col', className)}>
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              团队评论
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              共 {comments.length} 条评论，使用 @ 提及协同人
            </p>
          </div>

          {/* Comment Input */}
          <CommentInput
            placeholder="添加评论... 使用 @ 提及协同人"
            onSubmit={(content, mentions) => handleCreateComment(content, mentions)}
            participants={participants}
          />

          {/* Participants hint */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AtSign className="h-3 w-3" />
            <span>可提及:</span>
            {participants.slice(0, 5).map((p) => (
              <span key={p.user_id} className="bg-slate-100 px-1.5 py-0.5 rounded">
                {p.name}
              </span>
            ))}
            {participants.length > 5 && (
              <span>+{participants.length - 5} 人</span>
            )}
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>暂无评论</p>
                <p className="text-sm">开始讨论，使用 @ 提及团队成员</p>
              </div>
            ) : (
              comments.map((comment) => {
                // Get replies for this comment (mock implementation)
                const replies: WarRoomComment[] = []
                return (
                  <CommentItem
                    key={comment.comment_id}
                    comment={comment}
                    replies={replies}
                    participants={participants}
                    onReply={(content, mentions) =>
                      handleReply(comment.comment_id, content, mentions)
                    }
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )
              })
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
