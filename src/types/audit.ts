/**
 * OptiMax Type Definitions - Audit Log
 */

import type { AuditAction, AuditEntityType } from './enums'

// ---------------------------------------------------------------------------
// Core Audit Entry
// ---------------------------------------------------------------------------

export interface AuditEntry {
  audit_id: string
  action: AuditAction
  entity_type: AuditEntityType
  entity_id: string
  entity_name: string
  actor_id: string
  actor_name: string
  actor_ip?: string
  user_agent?: string
  description: string
  changes?: AuditChange[]
  metadata?: Record<string, unknown>
  organization_id: string
  created_at: string // ISO 8601
}

// ---------------------------------------------------------------------------
// Field-level change tracking
// ---------------------------------------------------------------------------

export interface AuditChange {
  field: string
  old_value: unknown
  new_value: unknown
}

// ---------------------------------------------------------------------------
// List helpers
// ---------------------------------------------------------------------------

export interface AuditEntryListItem
  extends Pick<
    AuditEntry,
    | 'audit_id'
    | 'action'
    | 'entity_type'
    | 'entity_id'
    | 'entity_name'
    | 'actor_name'
    | 'description'
    | 'created_at'
  > {
  change_count: number
}

/** Query parameters for audit log listing */
export interface AuditQueryParams {
  entity_type?: AuditEntityType
  entity_id?: string
  actor_id?: string
  action?: AuditAction
  date_from?: string
  date_to?: string
  page?: number
  page_size?: number
}
