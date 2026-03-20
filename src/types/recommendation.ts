/**
 * OptiMax Type Definitions - AI Recommendation
 */

import type { Severity } from './enums'

// ---------------------------------------------------------------------------
// Recommendation
// ---------------------------------------------------------------------------

export interface Recommendation {
  recommendation_id: string
  event_id: string
  case_id?: string
  title: string
  description: string
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  category: 'immediate' | 'short_term' | 'long_term' | 'monitoring'
  estimated_effort: 'low' | 'medium' | 'high'
  estimated_impact: 'low' | 'medium' | 'high'
  status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed'
  assigned_to?: string
  assigned_to_name?: string
  ai_confidence: number // 0-100
  reasoning?: string
  steps: RecommendationStep[]
  related_supplier_ids: string[]
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}

// ---------------------------------------------------------------------------
// Recommendation Step
// ---------------------------------------------------------------------------

export interface RecommendationStep {
  step_number: number
  instruction: string
  completed: boolean
  completed_at?: string // ISO 8601
  completed_by?: string
}

// ---------------------------------------------------------------------------
// AI Analysis Result
// ---------------------------------------------------------------------------

export interface AIAnalysisResult {
  analysis_id: string
  event_id: string
  model_version: string
  summary: string
  key_findings: string[]
  risk_assessment: {
    likelihood: number // 0-100
    impact: number // 0-100
    overall_severity: Severity
  }
  recommendations: Recommendation[]
  confidence: number // 0-100
  processing_time_ms: number
  analyzed_at: string // ISO 8601
}
