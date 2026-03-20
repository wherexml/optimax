/**
 * OptiMax Type Definitions - Rule
 */

import type { Severity, RuleStatus, RiskType } from './enums'

// ---------------------------------------------------------------------------
// Rule Condition
// ---------------------------------------------------------------------------

export interface RuleCondition {
  field: string
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in' | 'not_in' | 'regex'
  value: string | number | boolean | string[]
}

export interface RuleConditionGroup {
  logic: 'and' | 'or'
  conditions: (RuleCondition | RuleConditionGroup)[]
}

// ---------------------------------------------------------------------------
// Rule Action
// ---------------------------------------------------------------------------

export interface RuleAction {
  type: 'set_severity' | 'assign_owner' | 'add_tag' | 'notify' | 'create_case' | 'auto_merge' | 'escalate'
  params: Record<string, unknown>
}

// ---------------------------------------------------------------------------
// Core Rule
// ---------------------------------------------------------------------------

export interface Rule {
  rule_id: string
  name: string
  description: string
  status: RuleStatus
  priority: number // execution order
  risk_types: RiskType[]
  min_severity: Severity
  condition_group: RuleConditionGroup
  actions: RuleAction[]
  match_count: number // total times matched
  last_matched_at?: string // ISO 8601
  created_by: string
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}

// ---------------------------------------------------------------------------
// List helpers
// ---------------------------------------------------------------------------

export interface RuleListItem
  extends Pick<
    Rule,
    | 'rule_id'
    | 'name'
    | 'status'
    | 'priority'
    | 'min_severity'
    | 'match_count'
    | 'last_matched_at'
    | 'updated_at'
  > {
  risk_type_count: number
  action_count: number
}

export interface RuleCreatePayload {
  name: string
  description: string
  priority: number
  risk_types: RiskType[]
  min_severity: Severity
  condition_group: RuleConditionGroup
  actions: RuleAction[]
}

export interface RuleUpdatePayload extends Partial<RuleCreatePayload> {
  status?: RuleStatus
}
