/**
 * OptiMax AI Assistant - Chat History Component
 * FE-123: Historical Session Records and Audit
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  History,
  Search,
  Trash2,
  ChevronRight,
  MessageSquare,
  Copy,
  CheckCircle,
  Clock,
  MoreVertical,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAssistantStore } from '@/stores/assistant'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { MOCK_CHAT_HISTORY } from '@/mocks/data/assistant'
import type { AssistantSession, AssistantMessage } from '@/mocks/data/assistant'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatHistoryProps {
  className?: string
}

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25 },
  },
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

function formatSessionTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes === 0 ? '刚刚' : `${minutes}分钟前`
    }
    return `${hours}小时前`
  }
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

function getMessageCountText(count: number): string {
  if (count === 0) return '无消息'
  if (count <= 2) return `${count} 条消息`
  return `${Math.floor(count / 2)} 轮对话`
}

// ---------------------------------------------------------------------------
// Session Card Component
// ---------------------------------------------------------------------------

interface SessionCardProps {
  session: AssistantSession
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onCopy: (content: string) => void
}

function SessionCard({
  session,
  isSelected,
  onSelect,
  onDelete,
  onCopy,
}: SessionCardProps) {
  const [isCopied, setIsCopied] = useState(false)
  const lastMessage = session.messages[session.messages.length - 1]

  const handleCopyConclusion = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lastMessage?.content) {
      onCopy(lastMessage.content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <motion.div
      variants={itemVariants}
      className={`group relative rounded-lg border p-3 cursor-pointer transition-all ${
        isSelected
          ? 'border-[#2F6FED] bg-[#2F6FED]/5'
          : 'border-border hover:border-[#2F6FED]/30 hover:bg-muted/50'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-medium text-foreground truncate">
              {session.title}
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopyConclusion}>
                  {isCopied ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      已复制结论
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      复制结论
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除会话
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {lastMessage && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {lastMessage.content.slice(0, 80)}
              {lastMessage.content.length > 80 ? '...' : ''}
            </p>
          )}

          <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
            <Badge variant="secondary" className="text-[10px]">
              {getMessageCountText(session.messages.length)}
            </Badge>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatSessionTime(session.updated_at)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Session Detail Component
// ---------------------------------------------------------------------------

interface SessionDetailProps {
  session: AssistantSession
  onClose: () => void
  onCopy: (content: string) => void
}

function SessionDetail({ session, onClose, onCopy }: SessionDetailProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  const handleCopyMessage = (message: AssistantMessage) => {
    onCopy(message.content)
    setCopiedMessageId(message.id)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-background z-10"
    >
      <Card className="h-full border-0 shadow-none">
        <CardHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                <ChevronRight className="h-4 w-4 rotate-180" />
              </Button>
              <div>
                <CardTitle className="text-sm font-semibold">会话详情</CardTitle>
                <p className="text-xs text-muted-foreground">{session.title}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => onCopy(session.messages.map((m) => m.content).join('\n\n'))}
            >
              <Copy className="mr-2 h-4 w-4" />
              复制全部
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="p-4 space-y-4">
              {session.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      message.role === 'user'
                        ? 'bg-[#2F6FED] text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {message.role === 'user' ? '我' : 'AI'}
                  </div>
                  <div
                    className={`flex-1 max-w-[80%] ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}
                  >
                    <div
                      className={`inline-block rounded-lg px-3 py-2 text-sm ${
                        message.role === 'user'
                          ? 'bg-[#2F6FED] text-white'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{formatSessionTime(message.timestamp)}</span>
                      {message.tools_used && (
                        <Badge variant="secondary" className="text-[10px]">
                          使用了 {message.tools_used.length} 个工具
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => handleCopyMessage(message)}
                      >
                        {copiedMessageId === message.id ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function ChatHistory({ className }: ChatHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSession, setSelectedSession] = useState<AssistantSession | null>(null)
  const [sessionToDelete, setSessionToDelete] = useState<AssistantSession | null>(null)
  const { copyToClipboard } = useCopyToClipboard()

  // Use store sessions if available, otherwise use mock data
  const storeSessions = useAssistantStore((state) => state.sessions)
  const deleteSession = useAssistantStore((state) => state.deleteSession)

  const sessions = storeSessions.length > 0 ? storeSessions : MOCK_CHAT_HISTORY

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.messages.some((m: AssistantMessage) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  const handleDeleteSession = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete.id)
      setSessionToDelete(null)
    }
  }

  const handleCopy = (content: string) => {
    copyToClipboard(content)
  }

  return (
    <div className={`relative ${className}`}>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <History className="h-4 w-4 text-[#2F6FED]" />
              历史会话
              <Badge variant="secondary" className="text-xs">
                {filteredSessions.length}
              </Badge>
            </CardTitle>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索会话..."
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-380px)]">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="p-4 space-y-2"
            >
              {filteredSessions.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-8 w-8 mx-auto text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">暂无历史会话</p>
                </div>
              ) : (
                filteredSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    isSelected={selectedSession?.id === session.id}
                    onSelect={() => setSelectedSession(session)}
                    onDelete={() => setSessionToDelete(session)}
                    onCopy={handleCopy}
                  />
                ))
              )}
            </motion.div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Session Detail View */}
      {selectedSession && (
        <SessionDetail
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onCopy={handleCopy}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除会话？</DialogTitle>
            <DialogDescription>
              会话 "{sessionToDelete?.title}" 将被永久删除，此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSessionToDelete(null)}>
              取消
            </Button>
            <Button
              onClick={handleDeleteSession}
              className="bg-red-600 hover:bg-red-700"
            >
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ChatHistory
