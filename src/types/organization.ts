/**
 * OptiMax Type Definitions - Organization
 */

import type { PlanType } from './enums'

// ---------------------------------------------------------------------------
// Core Organization
// ---------------------------------------------------------------------------

export interface Organization {
  organization_id: string
  name: string
  slug: string // URL-safe identifier
  logo_url?: string
  plan: PlanType
  max_users: number
  max_events_per_month: number
  features: string[] // feature flags
  contact_email: string
  contact_phone?: string
  address?: string
  industry?: string
  timezone: string
  locale: string
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}

// ---------------------------------------------------------------------------
// Organization Stats
// ---------------------------------------------------------------------------

export interface OrganizationStats {
  total_users: number
  active_users: number
  total_events: number
  open_events: number
  total_cases: number
  open_cases: number
  total_suppliers: number
  monitored_suppliers: number
  active_rules: number
  storage_used_bytes: number
}

// ---------------------------------------------------------------------------
// Payloads
// ---------------------------------------------------------------------------

export interface OrganizationCreatePayload {
  name: string
  plan: PlanType
  contact_email: string
  industry?: string
  timezone?: string
  locale?: string
}

export interface OrganizationUpdatePayload extends Partial<OrganizationCreatePayload> {
  logo_url?: string
  contact_phone?: string
  address?: string
}
