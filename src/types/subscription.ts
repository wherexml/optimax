/**
 * OptiMax Type Definitions - Subscription (monitoring)
 */

import type {
  SubscriptionFrequency,
  SubscriptionChannel,
  RiskType,
  Severity,
} from './enums'

// ---------------------------------------------------------------------------
// Core Subscription
// ---------------------------------------------------------------------------

export interface Subscription {
  subscription_id: string
  name: string
  description?: string
  user_id: string
  enabled: boolean
  frequency: SubscriptionFrequency
  channels: SubscriptionChannel[]
  filters: SubscriptionFilter
  last_triggered_at?: string // ISO 8601
  trigger_count: number
  organization_id: string
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}

// ---------------------------------------------------------------------------
// Filter criteria
// ---------------------------------------------------------------------------

export interface SubscriptionFilter {
  risk_types?: RiskType[]
  min_severity?: Severity
  regions?: string[]
  supplier_ids?: string[]
  keywords?: string[]
  tags?: string[]
}

// ---------------------------------------------------------------------------
// Payloads
// ---------------------------------------------------------------------------

export interface SubscriptionCreatePayload {
  name: string
  description?: string
  frequency: SubscriptionFrequency
  channels: SubscriptionChannel[]
  filters: SubscriptionFilter
}

export interface SubscriptionUpdatePayload extends Partial<SubscriptionCreatePayload> {
  enabled?: boolean
}

// ---------------------------------------------------------------------------
// List helpers
// ---------------------------------------------------------------------------

export interface SubscriptionListItem
  extends Pick<
    Subscription,
    | 'subscription_id'
    | 'name'
    | 'enabled'
    | 'frequency'
    | 'channels'
    | 'trigger_count'
    | 'last_triggered_at'
    | 'updated_at'
  > {
  filter_summary: string
}
