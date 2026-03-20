/**
 * OptiMax Type Definitions - Risk Event
 */

import type {
  Severity,
  RiskType,
  EventStatus,
  ImpactObjectType,
  ActivityType,
} from './enums'

// ---------------------------------------------------------------------------
// Impact Object
// ---------------------------------------------------------------------------

export interface ImpactObject {
  type: ImpactObjectType
  id: string
  name: string
  confidence: number // 0-100
}

// ---------------------------------------------------------------------------
// Event Source
// ---------------------------------------------------------------------------

export interface EventSource {
  source_id: string
  name: string
  credibility: number // 0-100
  published_at: string // ISO 8601
  language: string
  url?: string
  excerpt?: string
}

// ---------------------------------------------------------------------------
// Event Activity (timeline)
// ---------------------------------------------------------------------------

export interface EventActivity {
  id: string
  actor_id: string
  actor_name: string
  actor_avatar?: string
  action: string
  description: string
  timestamp: string // ISO 8601
  before_value?: string
  after_value?: string
  type: ActivityType
}

// ---------------------------------------------------------------------------
// Core Risk Event
// ---------------------------------------------------------------------------

export interface RiskEvent {
  event_id: string
  title: string
  type: RiskType
  severity: Severity
  source_count: number
  confidence: number // 0-100
  occurred_at: string // ISO 8601
  discovered_at: string // ISO 8601
  status: EventStatus
  owner_id: string
  owner_name: string
  impact_objects: ImpactObject[]
  tags: string[]
  ai_summary?: string
  sla_due_at?: string // ISO 8601
  organization_id: string
  region: string
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}

// ---------------------------------------------------------------------------
// List / Table helpers
// ---------------------------------------------------------------------------

/** Lightweight event row for list views */
export interface RiskEventListItem
  extends Pick<
    RiskEvent,
    | 'event_id'
    | 'title'
    | 'type'
    | 'severity'
    | 'status'
    | 'owner_name'
    | 'source_count'
    | 'confidence'
    | 'occurred_at'
    | 'sla_due_at'
    | 'region'
    | 'updated_at'
  > {
  impact_count: number
  tag_count: number
}

/** Create / update payload (no server-generated fields) */
export interface RiskEventCreatePayload {
  title: string
  type: RiskType
  severity: Severity
  occurred_at: string
  region: string
  tags?: string[]
  ai_summary?: string
}

export interface RiskEventUpdatePayload extends Partial<RiskEventCreatePayload> {
  status?: EventStatus
  owner_id?: string
}
