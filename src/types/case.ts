/**
 * OptiMax Type Definitions - Case & Task
 */

import type {
  Severity,
  CaseStatus,
  TaskStatus,
  TaskType,
} from './enums'

// ---------------------------------------------------------------------------
// Participant
// ---------------------------------------------------------------------------

export interface Participant {
  user_id: string
  name: string
  role: string
  avatar?: string
}

// ---------------------------------------------------------------------------
// Core Case
// ---------------------------------------------------------------------------

export interface Case {
  case_id: string
  title: string
  level: Severity
  owner_id: string
  owner_name: string
  participants: Participant[]
  sla_due_at: string // ISO 8601
  status: CaseStatus
  related_event_id: string
  related_event_title: string
  next_action?: string
  decision_status?: string
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}

// ---------------------------------------------------------------------------
// Case Task
// ---------------------------------------------------------------------------

export interface CaseTask {
  task_id: string
  title: string
  type: TaskType
  owner_id: string
  owner_name: string
  due_at: string // ISO 8601
  status: TaskStatus
  priority: Severity
  approval_required: boolean
  source_case_id: string
  description?: string
  created_at: string // ISO 8601
}

// ---------------------------------------------------------------------------
// List helpers
// ---------------------------------------------------------------------------

export interface CaseListItem
  extends Pick<
    Case,
    | 'case_id'
    | 'title'
    | 'level'
    | 'status'
    | 'owner_name'
    | 'sla_due_at'
    | 'related_event_title'
    | 'updated_at'
  > {
  participant_count: number
  task_count: number
  completed_task_count: number
}

export interface CaseCreatePayload {
  title: string
  level: Severity
  related_event_id: string
  sla_due_at: string
  participant_ids?: string[]
}

export interface CaseUpdatePayload extends Partial<CaseCreatePayload> {
  status?: CaseStatus
  owner_id?: string
  next_action?: string
  decision_status?: string
}

export interface CaseTaskCreatePayload {
  title: string
  type: TaskType
  owner_id: string
  due_at: string
  priority: Severity
  approval_required?: boolean
  description?: string
}

export interface CaseTaskUpdatePayload extends Partial<CaseTaskCreatePayload> {
  status?: TaskStatus
}
