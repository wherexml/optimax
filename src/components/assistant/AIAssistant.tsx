/**
 * OptiMax AI Assistant - Main Drawer Component
 * FE-120: AI Assistant Side Drawer / Command Bar Entry
 */

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Send,
  X,
  MessageSquare,
  History,
  Loader2,
  Lightbulb,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useAssistantStore } from '@/stores/assistant'
import SearchResult from './SearchResult'
import ExplanationCard from './ExplanationCard'
import QuickActions from './QuickActions'
import ChatHistory from './ChatHistory'
import { PRESET_QUESTIONS } from '@/mocks/data/assistant'
import type { AssistantMessage } from '@/mocks/data/assistant'

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AIAssistantProps {
  trigger?: React.ReactNode
}

// ---------------------------------------------------------------------------
// Message Bubble Component
// ---------------------------------------------------------------------------

function MessageBubble({ message }: { message: AssistantMessage }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      variants={messageVariants}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? 'bg-[#173F5F] text-white'
            : 'bg-gradient-to-br from-[#2F6FED] to-[#173F5F] text-white'
        }`}
      >
        {isUser ? (
          <span className="text-xs font-medium">我</span>
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
      </div>
      <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block rounded-lg px-3 py-2 text-sm text-left ${
            isUser
              ? 'bg-[#173F5F] text-white'
              : 'bg-muted/80 text-foreground border border-border/50'
          }`}
        >
          {message.content}
        </div>
        {message.tools_used && !isUser && (
          <div className="mt-1 flex items-center gap-1">
            {message.tools_used.map((tool) => (
              <Badge key={tool} variant="secondary" className="text-[10px]">
                {tool === 'search' && '搜索'}
                {tool === 'analyze' && '分析'}
                {tool === 'search_events' && '事件搜索'}
                {tool === 'filter_by_severity' && '风险过滤'}
                {tool === 'query_supplier' && '供应商查询'}
                {tool === 'analyze_risk_factors' && '风险分析'}
                {tool === 'analyze_trends' && '趋势分析'}
                {tool === 'compare_periods' && '周期对比'}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Preset Questions Component
// ---------------------------------------------------------------------------

function PresetQuestions({ onSelect }: { onSelect: (question: string) => void }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-2"
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Lightbulb className="h-3.5 w-3.5" />
        <span>试试这样问</span>
      </div>
      {PRESET_QUESTIONS.map((q) => (
        <motion.div key={q.id} variants={messageVariants}>
          <Button
            variant="outline"
            className="w-full justify-between h-auto py-2.5 px-3 text-left text-sm font-normal hover:bg-[#2F6FED]/5 hover:border-[#2F6FED]/30 transition-all group"
            onClick={() => onSelect(q.query)}
          >
            <span className="truncate pr-2">{q.label}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-[#2F6FED] shrink-0" />
          </Button>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function AIAssistant({ trigger }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    currentSession,
    sessions,
    inputValue,
    isLoading,
    createSession,
    sendMessage,
    setInputValue,
  } = useAssistantStore()

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen && inputRef.current && activeTab === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, activeTab])

  // Keyboard shortcut: Cmd/Ctrl + Shift + A to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return

    // Create session if none exists
    if (!currentSession) {
      createSession(inputValue.slice(0, 20) + (inputValue.length > 20 ? '...' : ''))
    }

    sendMessage(inputValue)
  }

  const handlePresetClick = (query: string) => {
    setInputValue(query)
    if (!currentSession) {
      createSession(query.slice(0, 20) + (query.length > 20 ? '...' : ''))
    }
    // Auto send after a short delay
    setTimeout(() => {
      sendMessage(query)
    }, 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const hasMessages = currentSession && currentSession.messages.length > 0

  return (
    <>
      {/* Trigger Button */}
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-[#173F5F] text-white hover:bg-[#173F5F]/90"
              onClick={() => setIsOpen(true)}
            >
              <Sparkles className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>AI 智能助手 (Cmd+Shift+A)</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Drawer */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          className="w-[400px] p-0 sm:w-[400px] border-l border-border/50"
        >
          <div className="flex h-full flex-col">
            {/* Header */}
            <SheetHeader className="border-b px-4 py-3 space-y-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2F6FED] to-[#173F5F]">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <SheetTitle className="text-base font-semibold">AI 智能助手</SheetTitle>
                    <p className="text-xs text-muted-foreground">OptiMax 智能分析助手</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </SheetHeader>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <div className="border-b px-4">
                <TabsList className="h-10 w-full justify-start rounded-none bg-transparent p-0">
                  <TabsTrigger
                    value="chat"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#173F5F] data-[state=active]:bg-transparent px-4 py-2 text-sm"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    对话
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#173F5F] data-[state=active]:bg-transparent px-4 py-2 text-sm"
                  >
                    <History className="mr-2 h-4 w-4" />
                    历史
                    {sessions.length > 0 && (
                      <Badge variant="secondary" className="ml-2 text-[10px]">
                        {sessions.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Chat Tab */}
              <TabsContent value="chat" className="mt-0 flex-1 flex flex-col h-[calc(100vh-140px)]">
                {/* Messages Area */}
                <ScrollArea className="flex-1 px-4 py-4">
                  <div className="space-y-4">
                    {!hasMessages ? (
                      <PresetQuestions onSelect={handlePresetClick} />
                    ) : (
                      <>
                        {currentSession.messages.map((message) => (
                          <div key={message.id} className="space-y-3">
                            <MessageBubble message={message} />
                            {/* Render Search Result if available */}
                            {message.result_data && (
                              <SearchResult result={message.result_data} />
                            )}
                            {/* Render Explanation if available */}
                            {message.explanation && (
                              <ExplanationCard explanation={message.explanation} />
                            )}
                          </div>
                        ))}
                        {isLoading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <Loader2 className="h-4 w-4 animate-spin" />
                            AI 正在分析...
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t p-4 space-y-3">
                  {/* Quick Actions */}
                  {hasMessages && (
                    <QuickActions
                      contextData={{
                        sessionTitle: currentSession?.title,
                      }}
                    />
                  )}

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      placeholder="输入问题，例如：最近一周高风险事件"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="bg-[#173F5F] hover:bg-[#173F5F]/90"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <p className="text-[10px] text-center text-muted-foreground">
                    AI 助手基于当前系统数据进行分析，结果仅供参考
                  </p>
                </div>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="mt-0 h-[calc(100vh-140px)]">
                <ChatHistory />
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default AIAssistant
