/**
 * OptiMax AI Assistant Store
 * FE-120~123: Global Intelligent Assistant State Management
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  AssistantSession,
  AssistantMessage,
  SearchResult,
} from '@/mocks/data/assistant'

// ---------------------------------------------------------------------------
// State Types
// ---------------------------------------------------------------------------

interface AssistantState {
  // UI State
  isOpen: boolean
  isMinimized: boolean
  activeTab: 'chat' | 'history'

  // Session State
  currentSession: AssistantSession | null
  sessions: AssistantSession[]

  // Input State
  inputValue: string
  isLoading: boolean

  // Actions
  open: () => void
  close: () => void
  toggle: () => void
  minimize: () => void
  restore: () => void
  setActiveTab: (tab: 'chat' | 'history') => void

  // Session Actions
  createSession: (title?: string) => void
  loadSession: (sessionId: string) => void
  deleteSession: (sessionId: string) => void
  clearAllSessions: () => void

  // Message Actions
  sendMessage: (content: string) => void
  setInputValue: (value: string) => void
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function createMockSearchResult(query: string): SearchResult {
  // Mock search result based on query
  const keywords: Record<string, SearchResult['type']> = {
    '事件': 'events',
    '供应商': 'suppliers',
    '风险': 'mixed',
    '趋势': 'stats',
    '分析': 'stats',
  }

  let type: SearchResult['type'] = 'mixed'
  for (const [key, val] of Object.entries(keywords)) {
    if (query.includes(key)) {
      type = val
      break
    }
  }

  return {
    type,
    summary: `已为您分析："${query}"\n\n根据当前数据，发现相关信息如下。此结果为模拟数据，实际场景将调用 AI 服务进行深度分析。`,
    confidence: 0.85,
    data_timestamp: new Date().toISOString(),
  }
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set, get) => ({
      // Initial State
      isOpen: false,
      isMinimized: false,
      activeTab: 'chat',
      currentSession: null,
      sessions: [],
      inputValue: '',
      isLoading: false,

      // UI Actions
      open: () => set({ isOpen: true, isMinimized: false }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen, isMinimized: false })),
      minimize: () => set({ isMinimized: true }),
      restore: () => set({ isMinimized: false }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Session Actions
      createSession: (title = '新会话') => {
        const newSession: AssistantSession = {
          id: generateSessionId(),
          title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          messages: [],
        }
        set({
          currentSession: newSession,
          sessions: [newSession, ...get().sessions],
        })
      },

      loadSession: (sessionId) => {
        const session = get().sessions.find((s) => s.id === sessionId)
        if (session) {
          set({ currentSession: session, activeTab: 'chat' })
        }
      },

      deleteSession: (sessionId) => {
        const sessions = get().sessions.filter((s) => s.id !== sessionId)
        set({ sessions })
        if (get().currentSession?.id === sessionId) {
          set({ currentSession: sessions[0] || null })
        }
      },

      clearAllSessions: () => {
        set({ sessions: [], currentSession: null })
      },

      // Input Actions
      setInputValue: (value) => set({ inputValue: value }),

      // Message Actions
      sendMessage: (content) => {
        const state = get()

        // Create session if none exists
        if (!state.currentSession) {
          get().createSession(content.slice(0, 20) + (content.length > 20 ? '...' : ''))
        }

        const session = get().currentSession!

        // Add user message
        const userMessage: AssistantMessage = {
          id: generateId(),
          role: 'user',
          content,
          timestamp: new Date().toISOString(),
        }

        const updatedMessages = [...session.messages, userMessage]
        const updatedSession = {
          ...session,
          messages: updatedMessages,
          updated_at: new Date().toISOString(),
        }

        // Update sessions list
        const updatedSessions = state.sessions.map((s) =>
          s.id === session.id ? updatedSession : s
        )

        set({
          currentSession: updatedSession,
          sessions: updatedSessions,
          isLoading: true,
          inputValue: '',
        })

        // Simulate AI response
        setTimeout(() => {
          const mockResult = createMockSearchResult(content)
          const assistantMessage: AssistantMessage = {
            id: generateId(),
            role: 'assistant',
            content: mockResult.summary,
            timestamp: new Date().toISOString(),
            tools_used: ['search', 'analyze'],
            result_data: mockResult,
          }

          const finalSession = {
            ...updatedSession,
            messages: [...updatedMessages, assistantMessage],
            updated_at: new Date().toISOString(),
          }

          set({
            currentSession: finalSession,
            sessions: updatedSessions.map((s) =>
              s.id === session.id ? finalSession : s
            ),
            isLoading: false,
          })
        }, 1500)
      },
    }),
    {
      name: 'optimax-assistant-storage',
      partialize: (state) => ({
        sessions: state.sessions,
      }),
    }
  )
)

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

export function selectIsOpen(state: AssistantState) {
  return state.isOpen
}

export function selectCurrentSession(state: AssistantState) {
  return state.currentSession
}

export function selectSessions(state: AssistantState) {
  return state.sessions
}

export function selectMessageCount(state: AssistantState) {
  return state.currentSession?.messages.length || 0
}
