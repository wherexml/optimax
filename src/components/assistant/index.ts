/**
 * OptiMax AI Assistant Components - Barrel Export
 * FE-120~123: Global Intelligent Assistant
 */

export { AIAssistant } from './AIAssistant'
export { SearchResultComponent } from './SearchResult'
export { default as ExplanationCard } from './ExplanationCard'
export { default as QuickActions } from './QuickActions'
export { default as ChatHistory } from './ChatHistory'

// Re-export types
export type {
  AssistantSession,
  AssistantMessage,
  SearchResult,
  ExplanationData,
  QuickAction,
  EventResult,
  SupplierResult,
  StatsData,
} from '@/mocks/data/assistant'
