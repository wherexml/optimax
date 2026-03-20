/**
 * OptiMax Type Definitions - Report
 */

import type { ReportType, ReportFormat, Severity } from './enums'

// ---------------------------------------------------------------------------
// Report Section
// ---------------------------------------------------------------------------

export interface ReportSection {
  section_id: string
  title: string
  order: number
  content_type: 'text' | 'chart' | 'table' | 'metric'
  content: string // markdown or JSON payload
}

// ---------------------------------------------------------------------------
// Core Report
// ---------------------------------------------------------------------------

export interface Report {
  report_id: string
  title: string
  type: ReportType
  format: ReportFormat
  period_start: string // ISO 8601
  period_end: string // ISO 8601
  generated_at: string // ISO 8601
  generated_by: string
  status: 'draft' | 'generating' | 'ready' | 'failed' | 'archived'
  sections: ReportSection[]
  summary?: string
  file_url?: string
  file_size?: number // bytes
  organization_id: string
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}

// ---------------------------------------------------------------------------
// Report Schedule
// ---------------------------------------------------------------------------

export interface ReportSchedule {
  schedule_id: string
  report_type: ReportType
  format: ReportFormat
  cron_expression: string
  recipients: string[] // user IDs
  enabled: boolean
  last_run_at?: string // ISO 8601
  next_run_at?: string // ISO 8601
  created_at: string // ISO 8601
}

// ---------------------------------------------------------------------------
// List helpers
// ---------------------------------------------------------------------------

export interface ReportListItem
  extends Pick<
    Report,
    | 'report_id'
    | 'title'
    | 'type'
    | 'format'
    | 'status'
    | 'period_start'
    | 'period_end'
    | 'generated_at'
    | 'generated_by'
  > {
  section_count: number
}

export interface ReportCreatePayload {
  title: string
  type: ReportType
  format: ReportFormat
  period_start: string
  period_end: string
  sections?: Omit<ReportSection, 'section_id'>[]
  summary?: string
}

// ---------------------------------------------------------------------------
// Report KPI (for dashboard widgets)
// ---------------------------------------------------------------------------

export interface ReportKpi {
  label: string
  value: number
  unit?: string
  change?: number // percentage change from previous period
  severity?: Severity
}
